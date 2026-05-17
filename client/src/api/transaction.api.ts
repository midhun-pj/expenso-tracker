import type { PaginatedResponse } from "@models/common.model";
import type { CreateTransferRequest, Transaction, Transfer, TransactionsQuery } from "@models/transaction.model";
import { API_BASE } from "@utils/app.constant";
import { authHeaders, handleResponse } from "@utils/app.methods";

const apiUrl = `${API_BASE}/transactions`;

export async function create(data: Omit<Transaction, 'id'>): Promise<Transaction> {
    const res = await fetch(`${apiUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return (await handleResponse(res)) as Transaction;
}

export async function list(params: TransactionsQuery): Promise<PaginatedResponse<Transaction>> {


    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            query.append(key, String(value));
        }
    });

    const res = await fetch(`${apiUrl}?${query.toString()}`, {
        headers: authHeaders(),
    });

    return (await handleResponse(res)) as PaginatedResponse<Transaction>;
}

export async function createTransfer(data: CreateTransferRequest): Promise<Transfer> {
    const res = await fetch(`${apiUrl}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return (await handleResponse(res)) as Transfer;
}