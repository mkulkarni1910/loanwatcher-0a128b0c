import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, Customer, formatCurrency } from '@/utils/dummyData';
import { IndianRupee, Users, ArrowUpRight, ArrowDownRight, Banknote } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface BankLevelSummaryProps {
  customers: Customer[];
  transactions: Transaction[];
}

export const BankLevelSummary = ({ customers, transactions }: BankLevelSummaryProps) => {
  const [selectedMode, setSelectedMode] = useState<'ALL' | 'CASH' | 'RTGS' | 'NEFT' | 'CHEQUE'>('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');

  const totalLoanAmount = customers.reduce((sum, customer) => sum + customer.loanAmount, 0);
  const totalCredit = transactions.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + t.amount, 0);
  
  const filteredTransactions = transactions.filter(t => {
    const modeMatch = selectedMode === 'ALL' ? true : t.mode === selectedMode;
    const typeMatch = selectedType === 'ALL' ? true : t.type === selectedType;
    return modeMatch && typeMatch;
  });

  const filteredCustomers = customers.filter(customer => 
    filteredTransactions.some(t => t.customerId === customer.id)
  );

  const totalFilteredAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
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
                {formatCurrency(transactions.filter(t => t.type === 'DEBIT' && t.mode === 'CASH').reduce((sum, t) => sum + t.amount, 0))}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Transaction Mode</h3>
                <RadioGroup 
                  value={selectedMode} 
                  onValueChange={(value) => setSelectedMode(value as typeof selectedMode)}
                  className="flex flex-wrap gap-4"
                >
                  {['ALL', 'CASH', 'RTGS', 'NEFT', 'CHEQUE'].map((mode) => (
                    <div key={mode} className="flex items-center space-x-2">
                      <RadioGroupItem value={mode} id={`mode-${mode}`} />
                      <Label htmlFor={`mode-${mode}`}>{mode}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Transaction Type</h3>
                <RadioGroup 
                  value={selectedType} 
                  onValueChange={(value) => setSelectedType(value as typeof selectedType)}
                  className="flex flex-wrap gap-4"
                >
                  {['ALL', 'CREDIT', 'DEBIT'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={`type-${type}`} />
                      <Label htmlFor={`type-${type}`}>{type}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">
                  Filtered Transactions Summary
                </h3>
                <div className="text-sm text-gray-500">
                  {filteredCustomers.length} customers | Total Amount: {formatCurrency(totalFilteredAmount)}
                </div>
              </div>

              <div className="space-y-4">
                {filteredCustomers.map(customer => {
                  const customerTransactions = filteredTransactions.filter(t => t.customerId === customer.id);
                  const totalAmount = customerTransactions.reduce((sum, t) => sum + t.amount, 0);

                  return (
                    <div key={customer.id} className="bg-gray-50 p-4 rounded-lg hover:shadow-sm transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{customer.name}</div>
                        <Badge variant="outline" className="bg-white">
                          {customer.loanAccountNumber}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{customer.businessName}</div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-500">
                          {customerTransactions.length} transactions
                        </div>
                        <div className="font-medium">
                          {formatCurrency(totalAmount)}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredCustomers.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No customers found with the selected filters
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};