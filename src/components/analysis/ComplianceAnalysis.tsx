
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, Transaction, getTransactionPurposeAnalysis } from "@/utils/dummyData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionTable } from "../transaction/TransactionTable";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangle, CheckCircle, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ComplianceAnalysisProps {
  customers: Customer[];
  transactions: Transaction[];
}

type ComplianceLevel = 'All' | 'High' | 'Medium' | 'Low';

export const ComplianceAnalysis = ({ customers, transactions }: ComplianceAnalysisProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedComplianceLevel, setSelectedComplianceLevel] = useState<ComplianceLevel>('All');

  const getComplianceLevel = (deviationPercentage: number) => {
    if (deviationPercentage <= 10) return { level: 'High', color: 'bg-green-500' };
    if (deviationPercentage <= 20) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'Low', color: 'bg-red-500' };
  };

  const getRiskLevel = (deviationPercentage: number) => {
    if (deviationPercentage <= 10) return { level: 'Low', color: 'bg-green-500' };
    if (deviationPercentage <= 20) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'High', color: 'bg-red-500' };
  };

  const isTransactionCompliant = (transaction: Transaction, customerComplianceLevel: { level: string }) => {
    if (customerComplianceLevel.level === 'High') {
      // For high compliance customers, only RTGS and NEFT debit transactions are considered compliant
      if (transaction.type === 'DEBIT') {
        return ['RTGS', 'NEFT'].includes(transaction.mode);
      }
    }
    return transaction.purposeAlignment !== 'DEVIATED';
  };

  const getNonCompliantTransactions = (customerId: string) => {
    const analysis = getTransactionPurposeAnalysis(customerId);
    const complianceLevel = getComplianceLevel(analysis.deviationPercentage);
    
    // Don't show any non-compliant transactions for high compliance customers
    if (complianceLevel.level === 'High') {
      return [];
    }
    
    return analysis.transactions.filter(t => !isTransactionCompliant(t, complianceLevel));
  };

  const getComplianceAnalysis = (customer: Customer) => {
    const analysis = getTransactionPurposeAnalysis(customer.id);
    const complianceLevel = getComplianceLevel(analysis.deviationPercentage);
    const nonCompliantTransactions = getNonCompliantTransactions(customer.id);
    const totalTransactionValue = analysis.transactions.reduce((sum, t) => sum + t.amount, 0);
    const deviatedValue = nonCompliantTransactions.reduce((sum, t) => sum + t.amount, 0);
    const deviationPercentage = (deviatedValue / totalTransactionValue) * 100;

    let riskFactors = [];
    const cashDebits = nonCompliantTransactions.filter(t => t.mode === 'CASH' && t.type === 'DEBIT');
    
    if (complianceLevel.level === 'High' && cashDebits.length > 0) {
      riskFactors.push("Cash debits detected in high compliance account");
    }
    if (deviatedValue / totalTransactionValue > 0.3) {
      riskFactors.push("Large proportion of transaction value deviating from purpose");
    }
    if (nonCompliantTransactions.length > 3) {
      riskFactors.push("Multiple non-compliant transactions detected");
    }

    return {
      deviationPercentage,
      totalTransactions: analysis.transactions.length,
      nonCompliantCount: nonCompliantTransactions.length,
      totalValue: totalTransactionValue,
      deviatedValue,
      riskFactors,
      isHighRisk: deviationPercentage > 20
    };
  };

  const filteredCustomers = customers.filter(customer => {
    if (selectedComplianceLevel === 'All') return true;
    const analysis = getTransactionPurposeAnalysis(customer.id);
    const compliance = getComplianceLevel(analysis.deviationPercentage);
    return compliance.level === selectedComplianceLevel;
  });

  return (
    <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Customer Compliance Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select
              value={selectedComplianceLevel}
              onValueChange={(value) => setSelectedComplianceLevel(value as ComplianceLevel)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by compliance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Levels</SelectItem>
                <SelectItem value="High">High Compliance</SelectItem>
                <SelectItem value="Medium">Medium Compliance</SelectItem>
                <SelectItem value="Low">Low Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Compliance Level</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead className="text-right">Utilization Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map(customer => {
              const analysis = getTransactionPurposeAnalysis(customer.id);
              const compliance = getComplianceLevel(analysis.deviationPercentage);
              const risk = getRiskLevel(analysis.deviationPercentage);
              const utilizationRate = ((analysis.transactions
                .filter(t => t.type === 'DEBIT')
                .reduce((sum, t) => sum + t.amount, 0) / customer.loanAmount) * 100).toFixed(1);
              
              const nonCompliantTransactions = getNonCompliantTransactions(customer.id);
              const metrics = getComplianceAnalysis(customer);

              return (
                <Dialog key={customer.id}>
                  <DialogTrigger asChild>
                    <TableRow className="cursor-pointer hover:bg-gray-50/50" onClick={() => setSelectedCustomer(customer)}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.businessName}</TableCell>
                      <TableCell>
                        <Badge className={compliance.color}>{compliance.level}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={risk.color}>{risk.level}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{utilizationRate}%</TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Compliance Analysis - {customer.name}</DialogTitle>
                      <DialogDescription>
                        <div className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h3 className="font-medium mb-2">Business Details</h3>
                              <p className="text-sm text-gray-600">Business: {customer.businessName}</p>
                              <p className="text-sm text-gray-600">Sector: {customer.sector}</p>
                              <p className="text-sm text-gray-600">Intended Purpose: {customer.intendedPurpose}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h3 className="font-medium mb-2">Compliance Metrics</h3>
                              <p className="text-sm text-gray-600">
                                Purpose Alignment: {(100 - metrics.deviationPercentage).toFixed(1)}%
                              </p>
                              <p className="text-sm text-gray-600">
                                Non-Compliant Transactions: {metrics.nonCompliantCount} of {metrics.totalTransactions}
                              </p>
                              <p className="text-sm text-gray-600">
                                Deviated Value: {((metrics.deviatedValue / metrics.totalValue) * 100).toFixed(1)}% of total volume
                              </p>
                            </div>
                          </div>

                          {metrics.isHighRisk ? (
                            <Alert variant="destructive">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>High Risk Status</AlertTitle>
                              <AlertDescription>
                                <div className="space-y-2">
                                  <p>This customer has been flagged as high risk due to significant deviations from intended loan purpose.</p>
                                  <ul className="list-disc pl-4 mt-2">
                                    {metrics.riskFactors.map((factor, index) => (
                                      <li key={index}>{factor}</li>
                                    ))}
                                  </ul>
                                </div>
                              </AlertDescription>
                            </Alert>
                          ) : metrics.deviationPercentage > 10 ? (
                            <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              <AlertTitle className="text-yellow-800">Moderate Risk Detected</AlertTitle>
                              <AlertDescription className="text-yellow-700">
                                Some transactions show deviation from intended purpose. Close monitoring recommended.
                              </AlertDescription>
                            </Alert>
                          ) : (
                            <Alert variant="default" className="bg-green-50 border-green-200">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <AlertTitle className="text-green-800">Good Compliance Standing</AlertTitle>
                              <AlertDescription className="text-green-700">
                                Transaction patterns align well with intended loan purpose
                              </AlertDescription>
                            </Alert>
                          )}

                          {compliance.level !== 'High' && nonCompliantTransactions.length > 0 && (
                            <div>
                              <h3 className="font-medium mb-2">Non-Compliant Transactions</h3>
                              <TransactionTable transactions={nonCompliantTransactions} />
                            </div>
                          )}
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

