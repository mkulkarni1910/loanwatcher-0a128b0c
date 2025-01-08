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
    <Card className="w-full shadow-sm border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-[#333333]">Select Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or account"
            className="pl-9 bg-white border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-4 space-y-2">
          {filteredCustomers.map(customer => (
            <div
              key={customer.id}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedCustomer?.id === customer.id
                  ? 'bg-primary text-white shadow-md'
                  : 'hover:bg-accent hover:text-accent-foreground'
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