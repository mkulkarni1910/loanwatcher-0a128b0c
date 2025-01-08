import { useState } from 'react';
import { CustomerSelect } from '@/components/CustomerSelect';
import { TransactionAnalysis } from '@/components/TransactionAnalysis';
import { Customer, getCustomerTransactions } from '@/utils/dummyData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const transactions = selectedCustomer ? getCustomerTransactions(selectedCustomer.id) : [];

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[#333333] tracking-tight">Loan Account Monitoring System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <CustomerSelect
              onSelectCustomer={setSelectedCustomer}
              selectedCustomer={selectedCustomer}
            />
          </div>
          
          <div className="md:col-span-2">
            {selectedCustomer ? (
              <>
                <Card className="mb-6 shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#333333]">Customer Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Name</p>
                        <p className="font-medium text-[#333333]">{selectedCustomer.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Business Name</p>
                        <p className="font-medium text-[#333333]">{selectedCustomer.businessName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Loan Account</p>
                        <p className="font-medium text-[#333333]">{selectedCustomer.loanAccountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Sector</p>
                        <p className="font-medium text-[#333333]">{selectedCustomer.sector}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <TransactionAnalysis transactions={transactions} />
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Select a customer to view transaction analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;