import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, formatCurrency } from '@/utils/dummyData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Badge } from "@/components/ui/badge";

interface TransactionAnalysisProps {
  transactions: Transaction[];
  viewType: 'charts' | 'details';
}

export const TransactionAnalysis = ({ transactions, viewType }: TransactionAnalysisProps) => {
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

  const barData = ['CASH', 'RTGS', 'NEFT', 'CHEQUE'].map(mode => ({
    name: mode,
    credit: transactions.filter(t => t.type === 'CREDIT' && t.mode === mode)
      .reduce((sum, t) => sum + t.amount, 0),
    debit: transactions.filter(t => t.type === 'DEBIT' && t.mode === mode)
      .reduce((sum, t) => sum + t.amount, 0),
  }));

  if (viewType === 'charts') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-[#333333]">Credit Distribution</CardTitle>
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
                    label={({ name, value }) => `${name}: ₹${(value / 1000).toFixed(1)}K`}
                    className="hover:opacity-95 transition-opacity"
                  >
                    {creditData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={modeColors[entry.name as keyof typeof modeColors]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => `₹${(Number(value)).toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-[#333333]">Debit Distribution</CardTitle>
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
                    label={({ name, value }) => `${name}: ₹${(value / 1000).toFixed(1)}K`}
                    className="hover:opacity-95 transition-opacity"
                  >
                    {debitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={modeColors[entry.name as keyof typeof modeColors]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => `₹${(Number(value)).toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-[#333333]">Transaction Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} className="hover:opacity-95 transition-opacity">
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `₹${(Number(value)).toLocaleString('en-IN')}`}
                  labelStyle={{ color: '#333333' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar name="Credit" dataKey="credit" fill="#4ade80" radius={[4, 4, 0, 0]} />
                <Bar name="Debit" dataKey="debit" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
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
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="p-3">{new Date(transaction.date).toLocaleDateString('en-IN')}</td>
                  <td className="p-3">
                    <Badge variant={transaction.type === 'CREDIT' ? 'default' : 'destructive'} className={transaction.type === 'CREDIT' ? 'bg-green-500' : ''}>
                      {transaction.type}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="bg-white">
                      {transaction.mode}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="p-3 text-gray-600">{transaction.reference}</td>
                  <td className="p-3 text-gray-600">{transaction.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};