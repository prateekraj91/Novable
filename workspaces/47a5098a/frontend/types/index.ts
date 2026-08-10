export type TransactionType = 'income' | 'expense';

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister extends UserLogin {
  // No additional fields for now, but could be extended
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  transaction_date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
  category?: Category; // Optional, might be populated on fetches
}

export interface DashboardSummary {
  total_income: number;
  total_expenses: number;
  current_balance: number;
}

// Forms
export interface CategoryFormValues {
  name: string;
  type: TransactionType;
}

export interface TransactionFormValues {
  amount: number;
  description: string;
  transaction_date: string;
  category_id: string;
  type: TransactionType;
}

export interface FilterOptions {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  categoryId?: string;
  type?: TransactionType;
}
