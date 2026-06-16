import type { User } from "@models/user.model";
import type { Account } from "@models/account.model";
import type { Category, CategoryType } from "@models/category.model";
import type { Transaction, Transfer, UpdateTransactionDetailsRequest } from "@models/transaction.model";
import type { Config, ThemeConfig } from "@models/settings.model";
import type { PaginatedResponse } from "@models/common.model";
import type { TransactionsQuery } from "@models/transaction.model";
import type { DashboardSummary } from "@models/dashboard.model";

export interface AppState {
    user: User | null;
    isAuthenticated: boolean;
    categories: Category[];

    transactions: PaginatedResponse<Transaction> | null;

    accounts: Account[];
    currency: string;
    theme: ThemeConfig;

    dashboardSummary: DashboardSummary | null;


    // Account Actions
    loadAccounts: () => Promise<void>;
    createAccount: (data: Omit<Account, "id">) => Promise<void>;
    removeAccount: (id: string) => Promise<void>;


    // combined config
    getConfig: () => Promise<void>;

    setConfig: (cfg: Config) => Promise<{ success: boolean }>;
    setTheme: (themeName: string) => void;
    initializeData: () => Promise<void>;

    // Auth Actions
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => void;


    // Category Actions
    loadCategories: () => Promise<void>;


    // Config Actions
    addCategory: (name: string, categoryType: CategoryType) => Promise<void>;
    removeCategory: (categoryId: string) => Promise<void>;
    setCurrency: (symbol: string) => void;

    // transaction actions

    createTransaction: (item: Omit<Transaction, "id">) => Promise<void>;
    createTransfer: (item: Omit<Transfer, "id">) => Promise<void>;
    getTransactions: (query: TransactionsQuery, append: boolean) => Promise<void>;
    updateTransactionDetails: (id: string, data: UpdateTransactionDetailsRequest) => Promise<void>;
    updateTransaction: (id: string, data: Transaction) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;

    loadDashboardSummary: (month?: number, year?: number) => Promise<void>;
}

export type AppLogoProps = {
    size?: 'sm' | 'md';
    color?: string;
}
