
import { Transaction, formatCurrency } from '@/utils/dummyData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionChartsProps {
  transactions: Transaction[];
  modeColors: Record<string, string>;
}

export const TransactionCharts = ({ transactions, modeColors }: TransactionChartsProps) => {
  const getTransactionsByMode = (type: 'CREDIT' | 'DEBIT') => {
    const modes = ['CASH', 'RTGS', 'NEFT', 'CHEQUE'] as const;
    return modes.map(mode => ({
      name: mode,
      value: transactions.filter(t => t.type === type && t.mode === mode)
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

  const chartConfig = {
    xAxis: { 
      tick: { fill: '#333333', fontSize: 12 },
      stroke: '#D6BCFA',
      tickLine: { stroke: '#D6BCFA' }
    },
    yAxis: {
      tick: { fill: '#333333', fontSize: 12 },
      stroke: '#D6BCFA',
      tickLine: { stroke: '#D6BCFA' }
    },
    tooltip: {
      contentStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '8px',
        border: '1px solid #E5DEFF',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '8px 12px',
        fontSize: '12px',
        color: '#333333'
      },
      labelStyle: { color: '#6E59A5', fontWeight: 600 }
    },
    legend: {
      wrapperStyle: {
        paddingTop: '20px',
        fontSize: '12px',
        color: '#333333'
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-md border-0 bg-white/90 backdrop-blur-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#333333]">Credit Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={creditData} className="hover:opacity-95 transition-opacity">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
              <XAxis {...chartConfig.xAxis} dataKey="name" />
              <YAxis {...chartConfig.yAxis} />
              <Tooltip {...chartConfig.tooltip} formatter={(value) => `₹${(Number(value)).toLocaleString('en-IN')}`} />
              <Legend {...chartConfig.legend} />
              <Bar 
                dataKey="value" 
                fill="#9b87f5"
                name="Credit Amount"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-md border-0 bg-white/90 backdrop-blur-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#333333]">Debit Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={debitData} className="hover:opacity-95 transition-opacity">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
              <XAxis {...chartConfig.xAxis} dataKey="name" />
              <YAxis {...chartConfig.yAxis} />
              <Tooltip {...chartConfig.tooltip} formatter={(value) => `₹${(Number(value)).toLocaleString('en-IN')}`} />
              <Legend {...chartConfig.legend} />
              <Bar 
                dataKey="value" 
                fill="#7E69AB"
                name="Debit Amount"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-md border-0 bg-white/90 backdrop-blur-md hover:shadow-lg transition-all duration-300 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#333333]">Transaction Comparison</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} className="hover:opacity-95 transition-opacity">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
              <XAxis {...chartConfig.xAxis} dataKey="name" />
              <YAxis {...chartConfig.yAxis} />
              <Tooltip {...chartConfig.tooltip} formatter={(value) => `₹${(Number(value)).toLocaleString('en-IN')}`} />
              <Legend {...chartConfig.legend} />
              <Bar name="Credit" dataKey="credit" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              <Bar name="Debit" dataKey="debit" fill="#7E69AB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

