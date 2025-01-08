export interface Customer {
  id: string;
  name: string;
  businessName: string;
  loanAccountNumber: string;
  loanAmount: number;
  disbursementDate: string;
  sector: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  date: string;
  type: 'CREDIT' | 'DEBIT';
  mode: 'CASH' | 'RTGS' | 'NEFT' | 'CHEQUE';
  amount: number;
  description: string;
  reference: string;
}

export const customers: Customer[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    businessName: 'Kumar Enterprises',
    loanAccountNumber: 'BL0001234',
    loanAmount: 5000000,
    disbursementDate: '2024-01-15',
    sector: 'Manufacturing'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    businessName: 'Sharma Trading Co.',
    loanAccountNumber: 'BL0001235',
    loanAmount: 3000000,
    disbursementDate: '2024-01-20',
    sector: 'Trading'
  },
  {
    id: '3',
    name: 'Mohammed Ali',
    businessName: 'Ali Exports',
    loanAccountNumber: 'BL0001236',
    loanAmount: 7500000,
    disbursementDate: '2024-01-10',
    sector: 'Export'
  }
];

export const transactions: Transaction[] = [
  {
    id: '1',
    customerId: '1',
    date: '2024-01-16',
    type: 'CREDIT',
    mode: 'RTGS',
    amount: 5000000,
    description: 'Loan Amount Disbursement',
    reference: 'RTGS24016ABC'
  },
  {
    id: '2',
    customerId: '1',
    date: '2024-01-17',
    type: 'DEBIT',
    mode: 'CHEQUE',
    amount: 2000000,
    description: 'Equipment Purchase',
    reference: 'CHQ002345'
  },
  {
    id: '3',
    customerId: '1',
    date: '2024-01-18',
    type: 'DEBIT',
    mode: 'NEFT',
    amount: 1000000,
    description: 'Raw Material Purchase',
    reference: 'NEFT24018XYZ'
  },
  // Add more transactions for other customers...
];

export const getCustomerTransactions = (customerId: string): Transaction[] => {
  return transactions.filter(t => t.customerId === customerId);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};