
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, Transaction, getTransactionPurposeAnalysis } from "@/utils/dummyData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionTable } from "../transaction/TransactionTable";

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
                      <DialogTitle>Transaction Details - {customer.name}</DialogTitle>
                      <DialogDescription>
                        Business: {customer.businessName} | Sector: {customer.sector}
                      </DialogDescription>
                    </DialogHeader>
                    <TransactionTable transactions={analysis.transactions} />
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
