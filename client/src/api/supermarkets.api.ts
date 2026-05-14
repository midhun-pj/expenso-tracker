import { API_BASE } from "../utils/app.constant";
import { authHeaders, handleResponse } from "../utils/app.methods";

import type { Supermarket } from "../utils/app.models";

export async function fetchSupermarkets(): Promise<Supermarket[]> {
    const res = await fetch(`${API_BASE}/supermarkets`, { headers: { ...authHeaders() } });
    return (await handleResponse(res)) as Supermarket[];
}

export async function createSupermarket(name: string): Promise<Supermarket> {
    const res = await fetch(`${API_BASE}/supermarkets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ name }),
    });
    return (await handleResponse(res)) as Supermarket;
}

export async function deleteSupermarket(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/supermarkets/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
    });
    await handleResponse(res);
}