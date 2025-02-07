
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, Customer, formatCurrency } from '@/utils/dummyData';
import { IndianRupee, Users } from 'lucide-react';

interface BankLevelSummaryProps {
  customers: Customer[];
  transactions: Transaction[];
}

export const BankLevelSummary = ({ customers, transactions }: BankLevelSummaryProps) => {
  const totalLoanAmount = customers.reduce((sum, customer) => sum + customer.loanAmount, 0);

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
    </div>
  );
};
