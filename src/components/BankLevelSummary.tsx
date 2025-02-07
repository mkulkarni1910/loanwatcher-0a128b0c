
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, Customer, formatCurrency } from '@/utils/dummyData';
import { IndianRupee, Users } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface BankLevelSummaryProps {
  customers: Customer[];
  transactions: Transaction[];
}

export const BankLevelSummary = ({ customers, transactions }: BankLevelSummaryProps) => {
  const [selectedMode, setSelectedMode] = useState<'ALL' | 'CASH' | 'RTGS' | 'NEFT' | 'CHEQUE'>('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');

  const totalLoanAmount = customers.reduce((sum, customer) => sum + customer.loanAmount, 0);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-[#333333]">Bank Level Overview</CardTitle>
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

          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
