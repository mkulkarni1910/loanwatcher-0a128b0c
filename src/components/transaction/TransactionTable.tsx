import { Transaction, formatCurrency } from '@/utils/dummyData';
import { Badge } from "@/components/ui/badge";

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3 text-sm font-medium text-gray-500">Date</th>
            <th className="text-left p-3 text-sm font-medium text-gray-500">Type</th>
            <th className="text-left p-3 text-sm font-medium text-gray-500">Mode</th>
            <th className="text-right p-3 text-sm font-medium text-gray-500">Amount</th>
            <th className="text-left p-3 text-sm font-medium text-gray-500">Reference</th>
            <th className="text-left p-3 text-sm font-medium text-gray-500">Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
              <td className="p-3">{new Date(transaction.date).toLocaleDateString('en-IN')}</td>
              <td className="p-3">
                <Badge variant={transaction.type === 'CREDIT' ? 'default' : 'destructive'} className={transaction.type === 'CREDIT' ? 'bg-green-500' : ''}>
                  {transaction.type}
                </Badge>
              </td>
              <td className="p-3">
                <Badge variant="outline" className="bg-white">
                  {transaction.mode}
                </Badge>
              </td>
              <td className="p-3 text-right font-medium">
                {formatCurrency(transaction.amount)}
              </td>
              <td className="p-3 text-gray-600">{transaction.reference}</td>
              <td className="p-3 text-gray-600">{transaction.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};