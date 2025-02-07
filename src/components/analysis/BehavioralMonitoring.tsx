
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, Transaction, getTransactionPurposeAnalysis } from "@/utils/dummyData";
import { AlertTriangle, ShieldAlert, ArrowRightLeft, Bell } from "lucide-react";

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
}

export const BehavioralMonitoring = ({ customers, transactions }: BehavioralMonitoringProps) => {
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
      },
      {
        title: "Fraud Risk",
        value: transactions.filter(t => t.type === 'DEBIT' && t.mode === 'CASH' && t.amount > 1000000).length,
        icon: <ShieldAlert className="h-5 w-5" />,
        description: "High-value cash transactions",
        color: "bg-orange-500",
      },
      {
        title: "Fund Diversion",
        value: transactions.filter(t => t.purposeAlignment === 'DEVIATED').length,
        icon: <ArrowRightLeft className="h-5 w-5" />,
        description: "Transactions with purpose mismatch",
        color: "bg-yellow-500",
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
      },
    ];

    return metrics;
  };

  const riskMetrics = calculateRiskMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {riskMetrics.map((metric, index) => (
        <Card key={index} className="shadow-sm border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300">
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
  );
};
