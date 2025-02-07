
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, Transaction, formatCurrency } from '@/utils/dummyData';
import { Badge } from "@/components/ui/badge";
import { IndianRupee } from 'lucide-react';

interface CashTransactionSummaryProps {
  customers: Customer[];
  transactions: Transaction[];
}

export const CashTransactionSummary = ({ customers, transactions }: CashTransactionSummaryProps) => {
  const cashDebitCustomers = customers.filter(customer => 
    transactions.some(t => 
      t.customerId === customer.id && 
      t.type === 'DEBIT' && 
      t.mode === 'CASH'
    )
  );

  const getCustomerCashDebits = (customerId: string) => {
    return transactions.filter(t => 
      t.customerId === customerId && 
      t.type === 'DEBIT' && 
      t.mode === 'CASH'
    );
  };

  const getTotalCashDebits = (customerId: string) => {
    return getCustomerCashDebits(customerId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-[#ea384c]">Cash Debit Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cashDebitCustomers.map(customer => (
            <div key={customer.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-[#ea384c]/10">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-lg">{customer.name}</div>
                <Badge variant="outline" className="bg-white border-[#ea384c] text-[#ea384c]">
                  {customer.loanAccountNumber}
                </Badge>
              </div>
              <div className="text-sm text-gray-600 mb-3">{customer.businessName}</div>
              <div className="flex items-center gap-2 text-[#ea384c]">
                <IndianRupee className="h-4 w-4" />
                <span className="font-semibold">
                  {formatCurrency(getTotalCashDebits(customer.id))}
                </span>
                <span className="text-sm text-gray-500">
                  in {getCustomerCashDebits(customer.id).length} cash debits
                </span>
              </div>
            </div>
          ))}
          {cashDebitCustomers.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No customers with cash debit transactions found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
