import { authHeaders, handleResponse } from "../utils/app.methods";
import type { ExpenseSummary } from "../utils/app.models";
import { API_BASE } from "../utils/app.constant";

export async function fetchExpenseSummary(
    month?: string,
    year?: string
): Promise<ExpenseSummary> {
    // Build query string
    const params = new URLSearchParams();
    if (month) params.set('month', month);
    if (year) params.set('year', year);

    const url = `${API_BASE}/expenses/summary${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { headers: { ...authHeaders() } });
    return (await handleResponse(res)) as ExpenseSummary;
}
