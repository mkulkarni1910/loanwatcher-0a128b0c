
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, Transaction, formatCurrency } from "@/utils/dummyData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

interface UtilizationPatternsProps {
  customers: Customer[];
  transactions: Transaction[];
}

export const UtilizationPatterns = ({ customers, transactions }: UtilizationPatternsProps) => {
  const [selectedData, setSelectedData] = useState<{
    month: string;
    type: 'disbursement' | 'utilization';
    amount: number;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const getContributingCustomers = () => {
    if (!selectedData) return [];

    const monthIndex = new Date(Date.parse(`${selectedData.month} 1, 2024`)).getMonth();
    const type = selectedData.type === 'disbursement' ? 'CREDIT' : 'DEBIT';

    const relevantTransactions = transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate.getMonth() === monthIndex && 
             txDate.getFullYear() === 2024 && 
             t.type === type;
    });

    const customerContributions = relevantTransactions.reduce((acc, t) => {
      const customer = customers.find(c => c.id === t.customerId);
      if (customer) {
        if (!acc[customer.id]) {
          acc[customer.id] = {
            customer,
            total: 0,
            transactions: []
          };
        }
        acc[customer.id].total += t.amount;
        acc[customer.id].transactions.push(t);
      }
      return acc;
    }, {} as Record<string, { customer: Customer; total: number; transactions: Transaction[] }>);

    return Object.values(customerContributions);
  };

  return (
    <>
      <Card className="shadow-md border-0 bg-white/90 backdrop-blur-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-[#333333]">
            Loan Utilization Trends (January - May 2024)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={monthlyData}
                onClick={(data) => {
                  if (data && data.activePayload) {
                    const payload = data.activePayload[0].payload;
                    const dataKey = data.activePayload[0].dataKey as 'disbursement' | 'utilization';
                    setSelectedData({
                      month: payload.month,
                      type: dataKey,
                      amount: payload[dataKey]
                    });
                    setDialogOpen(true);
                  }
                }}
              >
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
                  cursor={{ strokeWidth: 2 }}
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
                  className="cursor-pointer"
                />
                <Line 
                  type="monotone" 
                  dataKey="utilization" 
                  stroke="#7E69AB" 
                  strokeWidth={2}
                  dot={{ fill: '#7E69AB', r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Fund Utilization"
                  className="cursor-pointer"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedData?.type === 'disbursement' ? 'Loan Disbursements' : 'Fund Utilization'} - {selectedData?.month} 2024
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getContributingCustomers().map(({ customer, total, transactions }) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.businessName}</TableCell>
                    <TableCell>{formatCurrency(total)}</TableCell>
                    <TableCell>{transactions.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
