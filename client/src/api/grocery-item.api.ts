import type { PaginatedResponse } from '@models/common.model';
import type {
    GroceryItem,
    GrocerySummaryItem,
    GroceryItemQuery,
    CreateGroceryItemPayload,
    BulkCreateGroceryPayload,
} from '@models/grocery.model';
import { API_BASE } from '@utils/app.constant';
import { authHeaders, handleResponse } from '@utils/app.methods';

const API_URL = `${API_BASE}/grocery-items`;

export async function list(params: GroceryItemQuery): Promise<PaginatedResponse<GroceryItem>> {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, String(value));
        }
    });

    const res = await fetch(`${API_URL}?${query.toString()}`, {
        headers: authHeaders(),
    });

    return (await handleResponse(res)) as PaginatedResponse<GroceryItem>;
}

export async function getSummary(params: GroceryItemQuery): Promise<PaginatedResponse<GrocerySummaryItem>> {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, String(value));
        }
    });

    const res = await fetch(`${API_URL}/summary?${query.toString()}`, {
        headers: authHeaders(),
    });
    return (await handleResponse(res)) as PaginatedResponse<GrocerySummaryItem>;
}

export async function create(data: CreateGroceryItemPayload): Promise<GroceryItem> {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return (await handleResponse(res)) as GroceryItem;
}

export async function createBulk(data: BulkCreateGroceryPayload): Promise<GroceryItem[]> {
    const res = await fetch(`${API_URL}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return (await handleResponse(res)) as GroceryItem[];
}

export async function update(id: string, data: Partial<CreateGroceryItemPayload>): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    await handleResponse(res);
}

export async function deleteGroceryItem(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    await handleResponse(res);
}
