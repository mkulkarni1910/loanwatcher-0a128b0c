import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, Customer, formatCurrency } from '@/utils/dummyData';
import { IndianRupee, Users, ArrowUpRight, ArrowDownRight, Banknote } from 'lucide-react';

interface BankLevelSummaryProps {
  customers: Customer[];
  transactions: Transaction[];
}

export const BankLevelSummary = ({ customers, transactions }: BankLevelSummaryProps) => {
  const totalLoanAmount = customers.reduce((sum, customer) => sum + customer.loanAmount, 0);
  const totalCredit = transactions.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + t.amount, 0);
  
  const cashDebitCustomers = customers.filter(customer => 
    transactions.some(t => 
      t.customerId === customer.id && 
      t.type === 'DEBIT' && 
      t.mode === 'CASH'
    )
  );

  const totalCashDebits = transactions
    .filter(t => t.type === 'DEBIT' && t.mode === 'CASH')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-[#333333]">Bank Level Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              Total Credits
            </div>
            <div className="text-2xl font-semibold text-green-600">
              {formatCurrency(totalCredit)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <ArrowDownRight className="h-4 w-4 text-red-500" />
              Total Debits
            </div>
            <div className="text-2xl font-semibold text-red-600">
              {formatCurrency(totalDebit)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Banknote className="h-4 w-4 text-orange-500" />
              Cash Debits
            </div>
            <div className="text-2xl font-semibold text-orange-600">
              {formatCurrency(totalCashDebits)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {cashDebitCustomers.length} customers
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};