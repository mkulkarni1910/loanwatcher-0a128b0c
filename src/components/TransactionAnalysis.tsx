import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, Customer, formatCurrency } from '@/utils/dummyData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { TransactionCharts } from "./transaction/TransactionCharts";
import { TransactionTable } from "./transaction/TransactionTable";
import { CashTransactionSummary } from "./transaction/CashTransactionSummary";

interface TransactionAnalysisProps {
  transactions: Transaction[];
  viewType: 'charts' | 'details';
  customers: Customer[];
}

export const TransactionAnalysis = ({ transactions, viewType, customers }: TransactionAnalysisProps) => {
  const [selectedMode, setSelectedMode] = useState<string>('all');

  const modeColors = {
    CASH: '#9b87f5',
    RTGS: '#b3a4f7',
    NEFT: '#cbc1f9',
    CHEQUE: '#e5deff'
  };

  const filteredTransactions = selectedMode === 'all' 
    ? transactions 
    : transactions.filter(t => t.mode === selectedMode);

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCount = filteredTransactions.length;

  const renderModeFilter = () => (
    <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl text-[#333333]">Transaction Mode Filter</CardTitle>
        <Select value={selectedMode} onValueChange={setSelectedMode}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="CASH">Cash</SelectItem>
            <SelectItem value="RTGS">RTGS</SelectItem>
            <SelectItem value="NEFT">NEFT</SelectItem>
            <SelectItem value="CHEQUE">Cheque</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-gray-500">Total Amount</span>
            <span className="text-2xl font-bold">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-gray-500">Transaction Count</span>
            <span className="text-2xl font-bold">{totalCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (viewType === 'charts') {
    return (
      <div className="space-y-6">
        {renderModeFilter()}
        <TransactionCharts 
          transactions={filteredTransactions}
          modeColors={modeColors}
        />
        <CashTransactionSummary 
          customers={customers}
          transactions={transactions}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderModeFilter()}
      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <TransactionTable transactions={filteredTransactions} />
        </CardContent>
      </Card>
      <CashTransactionSummary 
        customers={customers}
        transactions={transactions}
      />
    </div>
  );
};