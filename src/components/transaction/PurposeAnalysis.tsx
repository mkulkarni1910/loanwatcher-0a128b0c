
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, Transaction, formatCurrency, getTransactionPurposeAnalysis } from '@/utils/dummyData';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PurposeAnalysisProps {
  customer: Customer;
  transactions: Transaction[];
}

export const PurposeAnalysis = ({ customer, transactions }: PurposeAnalysisProps) => {
  const analysis = getTransactionPurposeAnalysis(customer.id);
  const deviationPercentage = analysis.deviationPercentage;

  return (
    <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-[#333333]">Loan Purpose Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Intended Purpose</h3>
            <p className="text-gray-600">{customer.intendedPurpose}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Purpose Alignment</span>
              <span className="font-medium">{100 - deviationPercentage}%</span>
            </div>
            <Progress value={100 - deviationPercentage} className="h-2" />
          </div>

          {deviationPercentage > 20 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>High Risk Alert</AlertTitle>
              <AlertDescription>
                {formatCurrency(analysis.totalDeviated)} ({deviationPercentage.toFixed(1)}%) of transactions deviate from intended purpose
              </AlertDescription>
            </Alert>
          )}

          {deviationPercentage <= 20 && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-800">Good Standing</AlertTitle>
              <AlertDescription className="text-green-700">
                Majority of transactions align with intended purpose
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="font-medium">Recent Transactions</h3>
            {transactions.slice(0, 5).map(transaction => (
              <div key={transaction.id} className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${
                    transaction.purposeAlignment === 'DEVIATED' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.purposeAlignment}
                  </span>
                  <span className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{transaction.description}</span>
                  <span className="font-medium">{formatCurrency(transaction.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
