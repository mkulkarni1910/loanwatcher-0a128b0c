
import { useState } from 'react';
import { CustomerSelect } from '@/components/CustomerSelect';
import { TransactionAnalysis } from '@/components/TransactionAnalysis';
import { Customer, getCustomerTransactions, customers, transactions } from '@/utils/dummyData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndianRupee, TrendingUp, TrendingDown, BarChart3, ListFilter, GitCommitHorizontal, Shield, FileBarChart } from 'lucide-react';
import { BankLevelSummary } from '@/components/BankLevelSummary';
import { PurposeAnalysis } from '@/components/transaction/PurposeAnalysis';
import { UtilizationPatterns } from '@/components/analysis/UtilizationPatterns';
import { ComplianceAnalysis } from '@/components/analysis/ComplianceAnalysis';
import { BehavioralMonitoring } from '@/components/analysis/BehavioralMonitoring';

const Index = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const customerTransactions = selectedCustomer ? getCustomerTransactions(selectedCustomer.id) : [];

  const totalCredit = customerTransactions
    .filter(t => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = customerTransactions
    .filter(t => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-[#333333] tracking-tight">
            Janakalyan Bank - Loan Monitoring System
          </h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        <BankLevelSummary 
          customers={customers}
          transactions={transactions}
        />
        
        <Tabs defaultValue="utilization" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="utilization" className="flex items-center gap-2">
              <GitCommitHorizontal className="h-4 w-4" />
              Utilization Patterns
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance Analysis
            </TabsTrigger>
            <TabsTrigger value="behavioral" className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              Behavioral Monitoring
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Transaction Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="utilization">
            <UtilizationPatterns customers={customers} transactions={transactions} />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceAnalysis customers={customers} transactions={transactions} />
          </TabsContent>

          <TabsContent value="behavioral">
            <BehavioralMonitoring customers={customers} transactions={transactions} />
          </TabsContent>

          <TabsContent value="transactions">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <CustomerSelect
                  onSelectCustomer={setSelectedCustomer}
                  selectedCustomer={selectedCustomer}
                />

                {selectedCustomer && (
                  <div className="mt-6">
                    <PurposeAnalysis
                      customer={selectedCustomer}
                      transactions={customerTransactions}
                    />
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                {selectedCustomer ? (
                  <>
                    <Card className="mb-6 shadow-sm border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl text-[#333333]">Account Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                              <IndianRupee className="h-4 w-4" />
                              Loan Amount
                            </div>
                            <div className="text-2xl font-semibold text-[#333333]">
                              ₹{selectedCustomer.loanAmount.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              Total Credits
                            </div>
                            <div className="text-2xl font-semibold text-green-600">
                              ₹{totalCredit.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                              <TrendingDown className="h-4 w-4 text-red-500" />
                              Total Debits
                            </div>
                            <div className="text-2xl font-semibold text-red-600">
                              ₹{totalDebit.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <TransactionAnalysis 
                      transactions={customerTransactions}
                      viewType="charts"
                      customers={customers}
                    />
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center p-12 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                    <p className="text-gray-500 flex items-center gap-2">
                      <ListFilter className="h-5 w-5" />
                      Select a customer to view transaction analysis
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
