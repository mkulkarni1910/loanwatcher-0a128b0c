
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, Transaction, getTransactionPurposeAnalysis } from "@/utils/dummyData";
import { AlertTriangle, ShieldAlert, ArrowRightLeft, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

interface BehavioralMonitoringProps {
  customers: Customer[];
  transactions: Transaction[];
}

interface RiskMetric {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  color: string;
  affectedCustomers: Customer[];
}

export const BehavioralMonitoring = ({ customers, transactions }: BehavioralMonitoringProps) => {
  const [selectedMetric, setSelectedMetric] = useState<RiskMetric | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const calculateRiskMetrics = () => {
    const metrics: RiskMetric[] = [
      {
        title: "Loan Misuse",
        value: customers.reduce((count, customer) => {
          const analysis = getTransactionPurposeAnalysis(customer.id);
          return count + (analysis.deviationPercentage > 20 ? 1 : 0);
        }, 0),
        icon: <AlertTriangle className="h-5 w-5" />,
        description: "Customers with significant purpose deviation",
        color: "bg-red-500",
        affectedCustomers: customers.filter(customer => {
          const analysis = getTransactionPurposeAnalysis(customer.id);
          return analysis.deviationPercentage > 20;
        }),
      },
      {
        title: "Fraud Risk",
        value: transactions.filter(t => t.type === 'DEBIT' && t.mode === 'CASH' && t.amount > 1000000).length,
        icon: <ShieldAlert className="h-5 w-5" />,
        description: "High-value cash transactions",
        color: "bg-orange-500",
        affectedCustomers: Array.from(new Set(
          transactions
            .filter(t => t.type === 'DEBIT' && t.mode === 'CASH' && t.amount > 1000000)
            .map(t => customers.find(c => c.id === t.customerId))
            .filter((c): c is Customer => c !== undefined)
        )),
      },
      {
        title: "Fund Diversion",
        value: transactions.filter(t => t.purposeAlignment === 'DEVIATED').length,
        icon: <ArrowRightLeft className="h-5 w-5" />,
        description: "Transactions with purpose mismatch",
        color: "bg-yellow-500",
        affectedCustomers: Array.from(new Set(
          transactions
            .filter(t => t.purposeAlignment === 'DEVIATED')
            .map(t => customers.find(c => c.id === t.customerId))
            .filter((c): c is Customer => c !== undefined)
        )),
      },
      {
        title: "Active Alerts",
        value: customers.reduce((count, customer) => {
          const analysis = getTransactionPurposeAnalysis(customer.id);
          return count + (analysis.deviationPercentage > 10 ? 1 : 0);
        }, 0),
        icon: <Bell className="h-5 w-5" />,
        description: "Customers requiring attention",
        color: "bg-blue-500",
        affectedCustomers: customers.filter(customer => {
          const analysis = getTransactionPurposeAnalysis(customer.id);
          return analysis.deviationPercentage > 10;
        }),
      },
    ];

    return metrics;
  };

  const riskMetrics = calculateRiskMetrics();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {riskMetrics.map((metric, index) => (
          <Card 
            key={index} 
            className="shadow-sm border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => {
              setSelectedMetric(metric);
              setDialogOpen(true);
            }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">{metric.title}</CardTitle>
                <div className={`p-2 rounded-full ${metric.color} text-white`}>
                  {metric.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <div className="text-3xl font-bold">{metric.value}</div>
                <p className="text-sm text-gray-500 mt-1">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedMetric?.icon && (
                <div className={`p-2 rounded-full ${selectedMetric.color} text-white`}>
                  {selectedMetric.icon}
                </div>
              )}
              <span>{selectedMetric?.title} Details</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Loan Purpose</TableHead>
                  <TableHead>Loan Amount</TableHead>
                  <TableHead>Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedMetric?.affectedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.loanPurpose}</TableCell>
                    <TableCell>₹{customer.loanAmount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        customer.riskLevel === 'HIGH' ? 'bg-red-100 text-red-800' :
                        customer.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {customer.riskLevel}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
