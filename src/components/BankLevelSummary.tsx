
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, Customer, formatCurrency } from '@/utils/dummyData';
import { IndianRupee, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

interface BankLevelSummaryProps {
  customers: Customer[];
  transactions: Transaction[];
}

export const BankLevelSummary = ({ customers, transactions }: BankLevelSummaryProps) => {
  const totalLoanAmount = customers.reduce((sum, customer) => sum + customer.loanAmount, 0);

  const barData = ['CASH', 'RTGS', 'NEFT', 'CHEQUE'].map(mode => ({
    name: mode,
    credit: transactions.filter(t => t.type === 'CREDIT' && t.mode === mode)
      .reduce((sum, t) => sum + t.amount, 0),
    debit: transactions.filter(t => t.type === 'DEBIT' && t.mode === mode)
      .reduce((sum, t) => sum + t.amount, 0),
  }));

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-[#333333]">Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Users className="h-4 w-4" />
                Total Customers
              </div>
              <div className="text-2xl font-semibold text-[#333333]">
                {customers.length}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <IndianRupee className="h-4 w-4" />
                Total Loan Amount
              </div>
              <div className="text-2xl font-semibold text-[#333333]">
                {formatCurrency(totalLoanAmount)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-[#333333]">Transaction Mode Analysis</CardTitle>
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
};

