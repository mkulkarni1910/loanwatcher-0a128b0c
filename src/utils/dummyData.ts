export interface Customer {
  id: string;
  name: string;
  businessName: string;
  loanAccountNumber: string;
  loanAmount: number;
  disbursementDate: string;
  sector: string;
  intendedPurpose: string;
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
  category?: string;
  purposeAlignment?: 'ALIGNED' | 'DEVIATED' | 'UNKNOWN';
}

export const customers: Customer[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    businessName: 'Kumar Enterprises',
    loanAccountNumber: 'BL0001234',
    loanAmount: 5000000,
    disbursementDate: '2024-01-15',
    sector: 'Manufacturing',
    intendedPurpose: 'Purchase of machinery for textile manufacturing'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    businessName: 'Sharma Trading Co.',
    loanAccountNumber: 'BL0001235',
    loanAmount: 3000000,
    disbursementDate: '2024-01-20',
    sector: 'Trading',
    intendedPurpose: 'Working capital for wholesale business'
  },
  {
    id: '3',
    name: 'Mohammed Ali',
    businessName: 'Ali Exports',
    loanAccountNumber: 'BL0001236',
    loanAmount: 7500000,
    disbursementDate: '2024-01-10',
    sector: 'Export',
    intendedPurpose: 'Export business expansion'
  },
  {
    id: '4',
    name: 'Anita Patel',
    businessName: 'Patel Agro Industries',
    loanAccountNumber: 'BL0001237',
    loanAmount: 4500000,
    disbursementDate: '2024-02-01',
    sector: 'Agriculture',
    intendedPurpose: 'Setting up food processing unit'
  },
  {
    id: '5',
    name: 'Suresh Reddy',
    businessName: 'Reddy Technologies',
    loanAccountNumber: 'BL0001238',
    loanAmount: 6000000,
    disbursementDate: '2024-02-05',
    sector: 'Technology',
    intendedPurpose: 'Software development center setup'
  },
  {
    id: '6',
    name: 'Meera Desai',
    businessName: 'Desai Pharmaceuticals',
    loanAccountNumber: 'BL0001239',
    loanAmount: 8000000,
    disbursementDate: '2024-02-10',
    sector: 'Healthcare',
    intendedPurpose: 'Medical equipment purchase'
  },
  {
    id: '7',
    name: 'Vikram Singh',
    businessName: 'Singh Logistics',
    loanAccountNumber: 'BL0001240',
    loanAmount: 5500000,
    disbursementDate: '2024-02-15',
    sector: 'Transportation',
    intendedPurpose: 'Fleet expansion'
  },
  {
    id: '8',
    name: 'Lakshmi Nair',
    businessName: 'Kerala Foods',
    loanAccountNumber: 'BL0001241',
    loanAmount: 2500000,
    disbursementDate: '2024-02-20',
    sector: 'Food & Beverage',
    intendedPurpose: 'Restaurant chain expansion'
  },
  {
    id: '9',
    name: 'Abdul Rahman',
    businessName: 'Rahman Textiles',
    loanAccountNumber: 'BL0001242',
    loanAmount: 4000000,
    disbursementDate: '2024-02-25',
    sector: 'Textile',
    intendedPurpose: 'Garment factory setup'
  },
  {
    id: '10',
    name: 'Kavita Joshi',
    businessName: 'Joshi Education Services',
    loanAccountNumber: 'BL0001243',
    loanAmount: 3500000,
    disbursementDate: '2024-03-01',
    sector: 'Education',
    intendedPurpose: 'Educational institute expansion'
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
    reference: 'RTGS24016ABC',
    category: 'LOAN_DISBURSEMENT',
    purposeAlignment: 'ALIGNED'
  },
  {
    id: '2',
    customerId: '1',
    date: '2024-01-17',
    type: 'DEBIT',
    mode: 'CHEQUE',
    amount: 2000000,
    description: 'Equipment Purchase - Textile Machinery',
    reference: 'CHQ002345',
    category: 'MACHINERY',
    purposeAlignment: 'ALIGNED'
  },
  {
    id: '3',
    customerId: '1',
    date: '2024-01-18',
    type: 'DEBIT',
    mode: 'NEFT',
    amount: 1000000,
    description: 'Raw Material Purchase',
    reference: 'NEFT24018XYZ',
    category: 'RAW_MATERIALS',
    purposeAlignment: 'ALIGNED'
  },
  {
    id: '4',
    customerId: '1',
    date: '2024-01-19',
    type: 'DEBIT',
    mode: 'CASH',
    amount: 500000,
    description: 'General Expenses',
    reference: 'CASH24019DEF',
    category: 'MISC_EXPENSES',
    purposeAlignment: 'DEVIATED'
  },
  {
    id: '5',
    customerId: '2',
    date: '2024-01-21',
    type: 'CREDIT',
    mode: 'RTGS',
    amount: 3000000,
    description: 'Loan Amount Disbursement',
    reference: 'RTGS24021GHI',
    category: 'LOAN_DISBURSEMENT',
    purposeAlignment: 'ALIGNED'
  },
  {
    id: '6',
    customerId: '2',
    date: '2024-01-22',
    type: 'DEBIT',
    mode: 'NEFT',
    amount: 1500000,
    description: 'Inventory Purchase',
    reference: 'NEFT24022JKL',
    category: 'INVENTORY',
    purposeAlignment: 'ALIGNED'
  },
  {
    id: '7',
    customerId: '3',
    date: '2024-01-11',
    type: 'CREDIT',
    mode: 'RTGS',
    amount: 7500000,
    description: 'Loan Amount Disbursement',
    reference: 'RTGS24011MNO',
    category: 'LOAN_DISBURSEMENT',
    purposeAlignment: 'ALIGNED'
  },
  {
    id: '8',
    customerId: '3',
    date: '2024-01-12',
    type: 'DEBIT',
    mode: 'CHEQUE',
    amount: 3000000,
    description: 'Export Processing Equipment',
    reference: 'CHQ002346',
    category: 'MACHINERY',
    purposeAlignment: 'ALIGNED'
  },
  {
    id: '9',
    customerId: '4',
    date: '2024-02-02',
    type: 'CREDIT',
    mode: 'RTGS',
    amount: 4500000,
    description: 'Loan Amount Disbursement',
    reference: 'RTGS24032PQR',
    category: 'LOAN_DISBURSEMENT',
    purposeAlignment: 'ALIGNED'
  },
  {
    id: '10',
    customerId: '5',
    date: '2024-02-06',
    type: 'CREDIT',
    mode: 'RTGS',
    amount: 6000000,
    description: 'Loan Amount Disbursement',
    reference: 'RTGS24033STU',
    category: 'LOAN_DISBURSEMENT',
    purposeAlignment: 'ALIGNED'
  },
  {
    id: '11',
    customerId: '5',
    date: '2024-02-07',
    type: 'DEBIT',
    mode: 'CASH',
    amount: 1000000,
    description: 'Personal Withdrawal',
    reference: 'CASH24034VWX',
    category: 'PERSONAL',
    purposeAlignment: 'DEVIATED'
  },
  {
    id: '12',
    customerId: '10',
    date: '2024-03-02',
    type: 'CREDIT',
    mode: 'RTGS',
    amount: 3500000,
    description: 'Loan Amount Disbursement',
    reference: 'RTGS24302ABC',
    category: 'LOAN_DISBURSEMENT',
    purposeAlignment: 'ALIGNED'
  },
  {
    id: '13',
    customerId: '10',
    date: '2024-03-03',
    type: 'DEBIT',
    mode: 'CASH',
    amount: 1000000,
    description: 'Personal Expenses',
    reference: 'CASH24303DEF',
    category: 'PERSONAL',
    purposeAlignment: 'DEVIATED'
  },
  {
    id: '14',
    customerId: '10',
    date: '2024-03-04',
    type: 'DEBIT',
    mode: 'NEFT',
    amount: 1500000,
    description: 'Investment in Personal Property',
    reference: 'NEFT24304GHI',
    category: 'PERSONAL',
    purposeAlignment: 'DEVIATED'
  }
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

export const getTransactionPurposeAnalysis = (customerId: string) => {
  const customerTransactions = getCustomerTransactions(customerId);
  const totalDeviated = customerTransactions
    .filter(t => t.purposeAlignment === 'DEVIATED')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalTransactions = customerTransactions
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    totalDeviated,
    deviationPercentage: (totalDeviated / totalTransactions) * 100,
    transactions: customerTransactions
  };
};

export const TRANSACTION_CATEGORIES = [
  'LOAN_DISBURSEMENT',
  'MACHINERY',
  'RAW_MATERIALS',
  'INVENTORY',
  'MISC_EXPENSES',
  'PERSONAL'
] as const;
