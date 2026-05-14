
export async function handleResponse(res: Response) {
    if (!res.ok) {
        const text = await res.text();

        throw new Error(`${res.status} ${res.statusText}: ${text}`);
    }
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        return res.json();
    }

    return null;
}



export function authHeaders(): Record<string, string> {
    try {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
        return {};
    }
}