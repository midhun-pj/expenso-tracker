import { API_BASE } from "../utils/app.constant";
import { handleResponse } from "../utils/app.methods";

// Authentication
export async function login(email: string, password: string): Promise<{ token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    return (await handleResponse(res)) as { token: string };
}

export async function register(email: string, password: string, name?: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
    });
    return handleResponse(res)
}

export async function fetchCurrentUser(): Promise<{ id: string; name: string; email: string }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return (await handleResponse(res)) as { id: string; name: string; email: string };
}
