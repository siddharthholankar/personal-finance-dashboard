// User types
export interface User {
  id: number;
  email: string;
  name: string;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

// Account types
export interface Account {
  id: number;
  user_id: number;
  account_name: string;
  account_type: 'bank' | 'investment';
  balance: string;
  created_at: string;
}

// Transaction types
export interface Transaction {
  id: number;
  user_id: number;
  account_id?: number;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  date: string;
  created_at: string;
  account_name?: string;
}

export interface TransactionFormData {
  accountId?: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  date: string;
}

// Portfolio types
export interface PortfolioHolding {
  id: number;
  user_id: number;
  symbol: string;
  shares: string;
  purchase_price: string;
  current_price: string;
  created_at: string;
}

export interface PortfolioFormData {
  symbol: string;
  shares: string;
  purchasePrice: string;
  currentPrice?: string;
}

// Analytics types
export interface MonthlySummary {
  month: string;
  total_income: string;
  total_expenses: string;
  net: string;
}

export interface CategoryBreakdown {
  category: string;
  total: string;
  count: string;
}

export interface RecentSummary {
  total_balance: string;
  monthly_income: string;
  monthly_expenses: string;
  total_transactions: string;
}

export interface PortfolioSummary {
  total_invested: string;
  current_value: string;
  total_gain_loss: string;
}

// Chart data types
export interface MonthlyChartData {
  month: string;
  Income: number;
  Expenses: number;
}

export interface PieChartData {
  name: string;
  value: number;
}

// API error types
export interface ApiError {
  error: string;
  details?: string;
  stack?: string;
}

