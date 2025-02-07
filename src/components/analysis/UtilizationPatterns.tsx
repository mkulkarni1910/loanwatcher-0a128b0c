
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, Transaction } from "@/utils/dummyData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface UtilizationPatternsProps {
  customers: Customer[];
  transactions: Transaction[];
}

export const UtilizationPatterns = ({ customers, transactions }: UtilizationPatternsProps) => {
  const monthlyData = Array.from({ length: 5 }, (_, i) => {
    const month = new Date(2024, i).toLocaleString('default', { month: 'short' });
    const disbursement = transactions
      .filter(t => {
        const txDate = new Date(t.date);
        return txDate.getMonth() === i && txDate.getFullYear() === 2024 && t.type === 'CREDIT';
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const utilization = transactions
      .filter(t => {
        const txDate = new Date(t.date);
        return txDate.getMonth() === i && txDate.getFullYear() === 2024 && t.type === 'DEBIT';
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month,
      disbursement,
      utilization,
    };
  });

  return (
    <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Loan Utilization Trends (January - May 2024)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#333333' }}
                stroke="#333333"
              />
              <YAxis 
                tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
                tick={{ fill: '#333333' }}
                stroke="#333333"
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                labelStyle={{ color: '#333333' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: '#333333'
                }}
              />
              <Legend 
                wrapperStyle={{
                  color: '#333333'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="disbursement" 
                stroke="#4ade80" 
                strokeWidth={2}
                dot={{ fill: '#4ade80' }}
                name="Loan Disbursement"
              />
              <Line 
                type="monotone" 
                dataKey="utilization" 
                stroke="#f87171" 
                strokeWidth={2}
                dot={{ fill: '#f87171' }}
                name="Fund Utilization"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
