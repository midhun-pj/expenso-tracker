import type { ReactNode } from "react";
import type { Account } from "./account.model";
import type { Transaction } from "./transaction.model";

export interface DashboardSummary {
    accounts: Account[];
    recentTransactions: Transaction[];
    summary: {
        totalIncome: number;
        totalExpense: number;
    };
    totalBalance: number;
}

export interface SummaryCardProps {
    title: string;
    value: string;
    badge?: string;
    badgeColor?: 'green' | 'red';
    icon: ReactNode;
    children?: ReactNode;
}