import type { DashboardSummary } from "@models/dashboard.model";
import { API_BASE } from "@utils/app.constant";
import { authHeaders, handleResponse } from "@utils/app.methods";

export async function fetchDashboardSummary(month?: number, year?: number): Promise<DashboardSummary> {
    const params = new URLSearchParams();

    if (month) params.set('month', month.toString());
    if (year) params.set('year', year.toString());

    const url = `${API_BASE}/dashboard/summary${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { headers: { ...authHeaders() } });
    return (await handleResponse(res));
}
