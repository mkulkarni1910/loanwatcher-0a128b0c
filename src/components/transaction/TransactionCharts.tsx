
import { Transaction, formatCurrency, Customer } from '@/utils/dummyData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

interface TransactionChartsProps {
  transactions: Transaction[];
  modeColors: Record<string, string>;
}

export const TransactionCharts = ({ transactions, modeColors }: TransactionChartsProps) => {
  const [selectedData, setSelectedData] = useState<{
    mode: string;
    type: 'credit' | 'debit';
    value: number;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getTransactionsByMode = (type: 'CREDIT' | 'DEBIT') => {
    const modes = ['CASH', 'RTGS', 'NEFT', 'CHEQUE'] as const;
    return modes.map(mode => ({
      name: mode,
      value: transactions.filter(t => t.type === type && t.mode === mode)
        .reduce((sum, t) => sum + t.amount, 0),
      fill: mode === 'CASH' ? '#ea384c' : '#7E69AB'
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
    fillCredit: mode === 'CASH' ? '#ea384c' : '#9b87f5',
    fillDebit: mode === 'CASH' ? '#ea384c' : '#7E69AB'
  }));

  const getTransactionDetails = () => {
    if (!selectedData) return [];

    const filteredTransactions = transactions.filter(t => 
      t.mode === selectedData.mode && 
      t.type === selectedData.type.toUpperCase()
    );

    return filteredTransactions.map(t => ({
      transaction: t,
      amount: t.amount,
      date: new Date(t.date).toLocaleDateString('en-IN'),
      reference: t.reference,
      description: t.description
    }));
  };

  const chartConfig = {
    xAxis: { 
      tick: { fill: '#333333', fontSize: 8 },
      stroke: '#D6BCFA',
      tickLine: { stroke: '#D6BCFA' }
    },
    yAxis: {
      tick: { fill: '#333333', fontSize: 8 },
      stroke: '#D6BCFA',
      tickLine: { stroke: '#D6BCFA' },
      tickFormatter: (value: number) => `₹${(value / 1000000).toFixed(1)}M`
    },
    tooltip: {
      contentStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '8px',
        border: '1px solid #E5DEFF',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '8px 12px',
        fontSize: '8px',
        color: '#333333'
      },
      labelStyle: { color: '#6E59A5', fontWeight: 600, fontSize: '10px' }
    },
    legend: {
      wrapperStyle: {
        paddingTop: '20px',
        fontSize: '8px',
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
                className="cursor-pointer"
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
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
              <XAxis {...chartConfig.xAxis} dataKey="name" />
              <YAxis {...chartConfig.yAxis} />
              <Tooltip {...chartConfig.tooltip} formatter={(value) => `₹${(Number(value)).toLocaleString('en-IN')}`} />
              <Legend {...chartConfig.legend} />
              <Bar 
                dataKey="value" 
                name="Debit Amount"
                radius={[4, 4, 0, 0]}
                className="cursor-pointer"
                fill={(data) => data.fill}
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
            <BarChart 
              data={barData} 
              className="hover:opacity-95 transition-opacity"
              onClick={(data) => {
                if (data && data.activePayload) {
                  const payload = data.activePayload[0].payload;
                  const dataKey = data.activePayload[0].dataKey as 'credit' | 'debit';
                  setSelectedData({
                    mode: payload.name,
                    type: dataKey,
                    value: payload[dataKey]
                  });
                  setDialogOpen(true);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
              <XAxis {...chartConfig.xAxis} dataKey="name" />
              <YAxis {...chartConfig.yAxis} />
              <Tooltip {...chartConfig.tooltip} formatter={(value) => `₹${(Number(value)).toLocaleString('en-IN')}`} />
              <Legend {...chartConfig.legend} />
              <Bar 
                name="Credit" 
                dataKey="credit" 
                radius={[4, 4, 0, 0]}
                className="cursor-pointer"
                fill={(data) => data.fillCredit}
              />
              <Bar 
                name="Debit" 
                dataKey="debit" 
                radius={[4, 4, 0, 0]}
                className="cursor-pointer"
                fill={(data) => data.fillDebit}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedData?.mode} {selectedData?.type.toUpperCase()} Transactions
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getTransactionDetails().map((detail) => (
                  <TableRow key={detail.transaction.id}>
                    <TableCell>{detail.date}</TableCell>
                    <TableCell>{formatCurrency(detail.amount)}</TableCell>
                    <TableCell>{detail.reference}</TableCell>
                    <TableCell>{detail.description}</TableCell>
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

