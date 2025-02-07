
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
      tick: { fill: '#333333' },
      stroke: '#333333'
    },
    yAxis: {
      tick: { fill: '#333333' },
      stroke: '#333333'
    },
    tooltip: {
      contentStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '8px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        color: '#333333'
      },
      labelStyle: { color: '#333333' }
    },
    legend: {
      wrapperStyle: {
        color: '#333333'
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl text-[#333333]">Credit Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={creditData} className="hover:opacity-95 transition-opacity">
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis dataKey="name" {...chartConfig.xAxis} />
              <YAxis {...chartConfig.yAxis} />
              <Tooltip 
                formatter={(value) => `₹${(Number(value)).toLocaleString('en-IN')}`}
                {...chartConfig.tooltip}
              />
              <Legend {...chartConfig.legend} />
              <Bar 
                dataKey="value" 
                fill="#4ade80" 
                name="Credit Amount"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl text-[#333333]">Debit Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={debitData} className="hover:opacity-95 transition-opacity">
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis dataKey="name" {...chartConfig.xAxis} />
              <YAxis {...chartConfig.yAxis} />
              <Tooltip 
                formatter={(value) => `₹${(Number(value)).toLocaleString('en-IN')}`}
                {...chartConfig.tooltip}
              />
              <Legend {...chartConfig.legend} />
              <Bar 
                dataKey="value" 
                fill="#f87171" 
                name="Debit Amount"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl text-[#333333]">Transaction Comparison</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} className="hover:opacity-95 transition-opacity">
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis dataKey="name" {...chartConfig.xAxis} />
              <YAxis {...chartConfig.yAxis} />
              <Tooltip 
                formatter={(value) => `₹${(Number(value)).toLocaleString('en-IN')}`}
                {...chartConfig.tooltip}
              />
              <Legend {...chartConfig.legend} />
              <Bar name="Credit" dataKey="credit" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar name="Debit" dataKey="debit" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
