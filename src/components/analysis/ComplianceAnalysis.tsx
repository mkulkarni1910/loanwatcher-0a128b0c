
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, Transaction, getTransactionPurposeAnalysis } from "@/utils/dummyData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionTable } from "../transaction/TransactionTable";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface ComplianceAnalysisProps {
  customers: Customer[];
  transactions: Transaction[];
}

export const ComplianceAnalysis = ({ customers, transactions }: ComplianceAnalysisProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

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

  const getNonCompliantTransactions = (customerId: string) => {
    const analysis = getTransactionPurposeAnalysis(customerId);
    return analysis.transactions.filter(t => t.purposeAlignment === 'DEVIATED');
  };

  const getComplianceAnalysis = (customer: Customer) => {
    const analysis = getTransactionPurposeAnalysis(customer.id);
    const nonCompliantTransactions = getNonCompliantTransactions(customer.id);
    const totalTransactionValue = analysis.transactions.reduce((sum, t) => sum + t.amount, 0);
    const deviatedValue = nonCompliantTransactions.reduce((sum, t) => sum + t.amount, 0);
    const deviationPercentage = analysis.deviationPercentage;

    let riskFactors = [];
    if (nonCompliantTransactions.filter(t => t.mode === 'CASH').length > 0) {
      riskFactors.push("High volume of non-compliant cash transactions");
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
      riskFactors
    };
  };

  return (
    <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Customer Compliance Overview</CardTitle>
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
            {customers.map(customer => {
              const analysis = getTransactionPurposeAnalysis(customer.id);
              const compliance = getComplianceLevel(analysis.deviationPercentage);
              const risk = getRiskLevel(analysis.deviationPercentage);
              const utilizationRate = ((analysis.transactions
                .filter(t => t.type === 'DEBIT')
                .reduce((sum, t) => sum + t.amount, 0) / customer.loanAmount) * 100).toFixed(1);
              
              const nonCompliantTransactions = getNonCompliantTransactions(customer.id);

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
                              {(() => {
                                const metrics = getComplianceAnalysis(customer);
                                return (
                                  <>
                                    <p className="text-sm text-gray-600">
                                      Purpose Alignment: {(100 - metrics.deviationPercentage).toFixed(1)}%
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Non-Compliant Transactions: {metrics.nonCompliantCount} of {metrics.totalTransactions}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Deviated Value: {((metrics.deviatedValue / metrics.totalValue) * 100).toFixed(1)}% of total volume
                                    </p>
                                  </>
                                );
                              })()}
                            </div>
                          </div>

                          {(() => {
                            const metrics = getComplianceAnalysis(customer);
                            return metrics.deviationPercentage > 20 ? (
                              <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Risk Factors Identified</AlertTitle>
                                <AlertDescription>
                                  <ul className="list-disc pl-4 mt-2">
                                    {metrics.riskFactors.map((factor, index) => (
                                      <li key={index}>{factor}</li>
                                    ))}
                                  </ul>
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
                            );
                          })()}

                          <div>
                            <h3 className="font-medium mb-2">Non-Compliant Transactions</h3>
                            <TransactionTable transactions={nonCompliantTransactions} />
                          </div>
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
