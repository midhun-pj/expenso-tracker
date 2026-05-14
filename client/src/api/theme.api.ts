import type { ThemeConfig } from "../utils/app.models";
import { API_BASE } from "../utils/app.constant";
import { authHeaders, handleResponse } from "../utils/app.methods";

export async function fetchConfig(): Promise<{ user_id?: number; currency: string; themeConfig: ThemeConfig }> {
    const res = await fetch(`${API_BASE}/config`, { headers: { ...authHeaders() } });
    return (await handleResponse(res)) as { user_id?: number; currency: string; themeConfig: ThemeConfig };
}

export async function saveConfig(payload: { currency: string; themeConfig: ThemeConfig }): Promise<{ currency: string; themeConfig: ThemeConfig }> {
    const res = await fetch(`${API_BASE}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
    });
    return (await handleResponse(res)) as { currency: string; themeConfig: ThemeConfig };
}
