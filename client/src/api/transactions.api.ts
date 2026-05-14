import { API_BASE } from "../utils/app.constant";
import { authHeaders, handleResponse } from "../utils/app.methods";

export interface Transaction {
    id: string;
    type: 'EXPENSE' | 'INCOME' | 'TRANSFER';
    description?: string;
    amount: number;
    userId: string;
    createdAt: string;
}

export async function fetchTransactions(): Promise<Transaction[]> {
    const res = await fetch(`${API_BASE}/transactions`, {
        headers: { ...authHeaders() }
    });
    return (await handleResponse(res)) as Transaction[];
}

export async function createExpense(data: {
    accountId: string;
    amount: number;
    description?: string;
}): Promise<Transaction> {
    const res = await fetch(`${API_BASE}/transactions/expense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return (await handleResponse(res)) as Transaction;
}

export async function createTransfer(data: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description?: string;
}): Promise<Transaction> {
    const res = await fetch(`${API_BASE}/transactions/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return (await handleResponse(res)) as Transaction;
}
