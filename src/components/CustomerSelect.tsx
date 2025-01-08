import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { customers, Customer } from '@/utils/dummyData';
import { Search, Building2, User2, Briefcase } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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
    <Card className="w-full shadow-sm border-0 bg-white/80 backdrop-blur-sm">
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
        <div className="mt-4 space-y-3">
          {filteredCustomers.map(customer => (
            <div
              key={customer.id}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedCustomer?.id === customer.id
                  ? 'bg-primary text-white shadow-md'
                  : 'hover:bg-accent hover:text-accent-foreground bg-white'
              }`}
              onClick={() => onSelectCustomer(customer)}
            >
              <div className="flex items-center gap-2 mb-2">
                <User2 className="h-5 w-5" />
                <span className="font-medium">{customer.name}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <Building2 className="h-4 w-4" />
                  {customer.businessName}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Briefcase className="h-4 w-4" />
                    {customer.sector}
                  </div>
                  <Badge variant={selectedCustomer?.id === customer.id ? "secondary" : "outline"} className="bg-white/90">
                    {customer.loanAccountNumber}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};