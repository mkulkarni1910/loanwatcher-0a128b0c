
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
    <Card className="shadow-md border-0 bg-white/90 backdrop-blur-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-[#333333]">Loan Utilization Trends (January - May 2024)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#333333', fontSize: 12 }}
                stroke="#D6BCFA"
                tickLine={{ stroke: '#D6BCFA' }}
              />
              <YAxis 
                tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
                tick={{ fill: '#333333', fontSize: 12 }}
                stroke="#D6BCFA"
                tickLine={{ stroke: '#D6BCFA' }}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: '1px solid #E5DEFF',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: '#333333'
                }}
                labelStyle={{ color: '#6E59A5', fontWeight: 600 }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '12px',
                  color: '#333333'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="disbursement" 
                stroke="#9b87f5" 
                strokeWidth={2}
                dot={{ fill: '#9b87f5', r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Loan Disbursement"
              />
              <Line 
                type="monotone" 
                dataKey="utilization" 
                stroke="#7E69AB" 
                strokeWidth={2}
                dot={{ fill: '#7E69AB', r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Fund Utilization"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

