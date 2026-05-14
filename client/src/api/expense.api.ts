import { authHeaders, handleResponse } from "../utils/app.methods";
import type { Expense, Pagination } from "../utils/app.models";
import { API_BASE } from "../utils/app.constant";

export async function fetchExpenses(
    page = 1,
    limit = 10,
    month?: string,
    type?: 'income' | 'expense' | 'all',
    categoryId?: number,
    year?: string
): Promise<{ data: Expense[]; pagination: Pagination }> {
    // Build query string
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (month) params.set('month', month);
    if (year) params.set('year', year);
    if (type && type !== 'all') params.set('type', type);
    if (categoryId) params.set('categoryId', String(categoryId));

    const url = `${API_BASE}/expenses${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { headers: { ...authHeaders() } });
    const body = (await handleResponse(res)) as unknown;

    // Handle the new format: { data: [], pagination: {} }
    const maybeBody = (body as Record<string, unknown> | null) ?? null;
    const rawData = Array.isArray(maybeBody) ? (maybeBody as Expense[]) : [];
    const pagination = (maybeBody?.pagination as Pagination | undefined) ?? {
        currentPage: page,
        totalPages: 1,
        totalCount: rawData.length,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPrevPage: false,
    };

    return { data: rawData, pagination };
}

export async function createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    const payload = {
        categoryId: expense.categoryId,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        isIncome: expense.isIncome ?? false,
        paymentMethodId: expense.paymentMethodId,
    };

    const res = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
    });
    return (await handleResponse(res)) as Expense;
}

export async function updateExpense(id: string, expense: Omit<Expense, 'id'>): Promise<Expense> {
    const payload = {
        categoryId: expense.categoryId,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        isIncome: expense.isIncome ?? false,
        paymentMethodId: expense.paymentMethodId,
    };
    const res = await fetch(`${API_BASE}/expenses/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
    });
    return (await handleResponse(res)) as Expense;
}

export async function deleteExpenseApi(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/expenses/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
    });
    await handleResponse(res);
}

