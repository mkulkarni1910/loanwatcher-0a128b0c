import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, formatCurrency } from '@/utils/dummyData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface TransactionAnalysisProps {
  transactions: Transaction[];
}

export const TransactionAnalysis = ({ transactions }: TransactionAnalysisProps) => {
  const modeColors = {
    CASH: '#9b87f5',
    RTGS: '#b3a4f7',
    NEFT: '#cbc1f9',
    CHEQUE: '#e5deff'
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-xl text-[#333333]">Credit Transactions</CardTitle>
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

        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-xl text-[#333333]">Debit Transactions</CardTitle>
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

      <Card className="shadow-sm border-0">
        <CardHeader>
          <CardTitle className="text-xl text-[#333333]">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Mode</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Reference</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'CREDIT' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="p-3">{transaction.mode}</td>
                    <td className="p-3 text-right font-medium">{formatCurrency(transaction.amount)}</td>
                    <td className="p-3 text-gray-600">{transaction.reference}</td>
                    <td className="p-3 text-gray-600">{transaction.description}</td>
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