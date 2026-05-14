
export interface Supermarket {
  id: number;
  name: string;
}

export interface Expense {
  id: string;
  amount: number;
  isIncome?: boolean;
  categoryId: number;
  category?: string; // Optional for backward compatibility
  paymentMethodId?: number;
  description: string;
  date: string; // ISO string YYYY-MM-DD
}

export interface GroceryItem {
  id: string;
  name: string;
  store: string;
  quantity?: number;
  supermarket_id?: number;
  price: number;
  unit: string; // e.g., 'kg', 'lb', 'item'
  date: string;
  best_price?: number;
  best_quantity?: number;
  best_unit?: string;
  best_store?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ThemeConfig {
  themeName?: 'ocean' | 'sunset' | 'forest'; // Theme preset name
  navColor: string; // e.g. '#ffffff'
  textColor: string; // e.g. '#0f172a'
  buttonColor: string; // e.g. '#10b981'
}

export interface ExpenseDistribution {
  categoryId: number;
  category_name: string;
  total: number;
  count: number;
}

export interface MonthlyData {
  month: string; // MM format
  income: number;
  expense: number;
}

export interface ExpenseSummary {
  totalIncome: number;
  totalExpenses: number;
  expenseDistribution: ExpenseDistribution[];
  monthlyData: MonthlyData[];
}

export interface BulkItem {
  id: string;
  name: string;
  price: string;
  quantity: string;
  unit: string;
}
