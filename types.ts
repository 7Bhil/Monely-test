
export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  status: 'pending' | 'completed';
  icon: string;
}

export interface SummaryData {
  totalBalance: number;
  income: number;
  expenses: number;
  budgetLeft: number;
  budgetPercentage: number;
}
