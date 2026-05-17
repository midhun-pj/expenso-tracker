import { API_BASE } from "@utils/app.constant";
import { authHeaders, handleResponse } from "@utils/app.methods";

import type { Config } from "@models/settings.model";

const apiUrl = `${API_BASE}/config`;

export async function fetchConfig(): Promise<Config> {
    const res = await fetch(apiUrl, { headers: { ...authHeaders() } });
    return (await handleResponse(res)) as Config;
}

export async function saveConfig(payload: Config): Promise<any> {
    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
    });
    return (await handleResponse(res)) as any;
}
