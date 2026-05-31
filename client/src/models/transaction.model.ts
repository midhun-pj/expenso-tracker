import type { Account, AccountType } from "./account.model";
import { CATEGORY_TYPES, type Category } from "./category.model";

export type UpdateTransactionDetailsRequest = {
  description?: string;
  date?: string;
};

export type TransactionAccount = {
  id: string;
  name: string;
  type: AccountType;
  entryType: 'DEBIT' | 'CREDIT';
};

export type Transaction = {
  id?: string;
  accountId?: string;
  amount: number;
  description?: string;
  date: string;
  type: TransactionType;
  categoryId?: string;
  category?: Category;
  accounts?: TransactionAccount[];
};

export type AddExpenseFormProps = {
  accounts: Account[];
  categories: Category[];
};



export type CreateTransferRequest = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  date: string;
};

export interface Transfer extends CreateTransferRequest {
  id: string;
};

export const TRANSACTION_TYPES = [...CATEGORY_TYPES, "TRANSFER"] as const;

export type TransactionType = typeof TRANSACTION_TYPES[number];

export const TRANSACTION_FILTER_TYPES = ["ALL", ...TRANSACTION_TYPES] as const;

export type TransactionFilterType = typeof TRANSACTION_FILTER_TYPES[number];

export const TransactionFilterOptions = [
  { value: "ALL", label: "All" },
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expense" },
  { value: "TRANSFER", label: "Transfer" },
];

export interface TransactionsQuery {
  page?: number
  limit?: number

  year?: number
  month?: number

  type?: TransactionType

  categoryId?: string

  accountId?: string

  search?: string
}