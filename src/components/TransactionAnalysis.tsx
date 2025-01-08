import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, formatCurrency } from '@/utils/dummyData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface TransactionAnalysisProps {
  transactions: Transaction[];
}

export const TransactionAnalysis = ({ transactions }: TransactionAnalysisProps) => {
  const modeColors = {
    CASH: '#2c5282',
    RTGS: '#4299e1',
    NEFT: '#63b3ed',
    CHEQUE: '#90cdf4'
  };

  const getTransactionsByMode = (type: 'CREDIT' | 'DEBIT') => {
    const filtered = transactions.filter(t => t.type === type);
    const modes = ['CASH', 'RTGS', 'NEFT', 'CHEQUE'] as const;
    return modes.map(mode => ({
      name: mode,
      value: filtered.filter(t => t.mode === mode)
        .reduce((sum, t) => sum + t.amount, 0)
    }));
  };

  const creditData = getTransactionsByMode('CREDIT');
  const debitData = getTransactionsByMode('DEBIT');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Credit Transactions</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={creditData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {creditData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={modeColors[entry.name as keyof typeof modeColors]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debit Transactions</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={debitData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {debitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={modeColors[entry.name as keyof typeof modeColors]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Mode</th>
                  <th className="text-right p-2">Amount</th>
                  <th className="text-left p-2">Reference</th>
                  <th className="text-left p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id} className="border-b">
                    <td className="p-2">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        transaction.type === 'CREDIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="p-2">{transaction.mode}</td>
                    <td className="p-2 text-right">{formatCurrency(transaction.amount)}</td>
                    <td className="p-2">{transaction.reference}</td>
                    <td className="p-2">{transaction.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};