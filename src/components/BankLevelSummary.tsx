
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, Customer, formatCurrency } from '@/utils/dummyData';
import { IndianRupee, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

interface BankLevelSummaryProps {
  customers: Customer[];
  transactions: Transaction[];
}

export const BankLevelSummary = ({ customers, transactions }: BankLevelSummaryProps) => {
  const [selectedData, setSelectedData] = useState<{
    mode: string;
    type: 'credit' | 'debit';
    value: number;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalLoanAmount = customers.reduce((sum, customer) => sum + customer.loanAmount, 0);

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

  const formatValue = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    }
    return `₹${(value / 100000).toFixed(1)}L`;
  };

  const getTransactionDetails = () => {
    if (!selectedData) return [];

    const relevantTransactions = transactions.filter(t => 
      t.mode === selectedData.mode && 
      t.type === selectedData.type.toUpperCase()
    );

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-[#333333]">Credit Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={creditData} 
                className="hover:opacity-95 transition-opacity"
                onClick={(data) => {
                  if (data && data.activePayload) {
                    const payload = data.activePayload[0].payload;
                    setSelectedData({
                      mode: payload.name,
                      type: 'credit',
                      value: payload.value
                    });
                    setDialogOpen(true);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#333333', fontSize: 8 }}
                  tickLine={{ stroke: '#D6BCFA' }}
                />
                <YAxis 
                  tick={{ fill: '#333333', fontSize: 8 }}
                  tickFormatter={formatValue}
                  tickLine={{ stroke: '#D6BCFA' }}
                />
                <Tooltip 
                  formatter={(value) => formatValue(Number(value))}
                  labelStyle={{ color: '#333333', fontSize: 10 }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: 10
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 8 }} />
                <Bar 
                  dataKey="value" 
                  fill="#4ade80" 
                  name="Credit Amount"
                  radius={[4, 4, 0, 0]}
                  className="cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-[#333333]">Debit Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={debitData} 
                className="hover:opacity-95 transition-opacity"
                onClick={(data) => {
                  if (data && data.activePayload) {
                    const payload = data.activePayload[0].payload;
                    setSelectedData({
                      mode: payload.name,
                      type: 'debit',
                      value: payload.value
                    });
                    setDialogOpen(true);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#333333', fontSize: 8 }}
                  tickLine={{ stroke: '#D6BCFA' }}
                />
                <YAxis 
                  tick={{ fill: '#333333', fontSize: 8 }}
                  tickFormatter={formatValue}
                  tickLine={{ stroke: '#D6BCFA' }}
                />
                <Tooltip 
                  formatter={(value) => formatValue(Number(value))}
                  labelStyle={{ color: '#333333', fontSize: 10 }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: 10
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 8 }} />
                <Bar 
                  dataKey="value" 
                  fill="#f87171" 
                  name="Debit Amount"
                  radius={[4, 4, 0, 0]}
                  className="cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedData?.mode} {selectedData?.type.toUpperCase()} Details
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Transaction Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getTransactionDetails().map(({ customer, total, transactions }) => (
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
    </div>
  );
};
