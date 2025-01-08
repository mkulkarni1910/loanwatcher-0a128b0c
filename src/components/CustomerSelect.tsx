import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { customers, Customer } from '@/utils/dummyData';
import { Search } from 'lucide-react';

interface CustomerSelectProps {
  onSelectCustomer: (customer: Customer) => void;
  selectedCustomer?: Customer;
}

export const CustomerSelect = ({ onSelectCustomer, selectedCustomer }: CustomerSelectProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.loanAccountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Select Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, account number or business name"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-4 space-y-2">
          {filteredCustomers.map(customer => (
            <div
              key={customer.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedCustomer?.id === customer.id
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => onSelectCustomer(customer)}
            >
              <div className="font-medium">{customer.name}</div>
              <div className="text-sm opacity-90">{customer.businessName}</div>
              <div className="text-sm opacity-90">Loan A/C: {customer.loanAccountNumber}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};