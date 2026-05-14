import type { GroceryItem, Pagination } from "../utils/app.models";
import { API_BASE } from "../utils/app.constant";
import { authHeaders, handleResponse } from "../utils/app.methods";

export function mapRawToGrocery(it: Record<string, unknown>): GroceryItem {
    const id = it.id ?? it['Id'] ?? it['ID'];
    const priceVal = it.price ?? it['price'] ?? it['Price'];
    const quantityVal = it.quantity ?? it.qty ?? it['qty'];
    const supermarketIdVal = it.supermarket_id ?? it['supermarket_id'] ?? it['supermarketId'];

    return {
        id: String(id ?? ''),
        name: String(it.name ?? it['name'] ?? ''),
        store: String(it.supermarket ?? it.store ?? ''),
        quantity: typeof quantityVal === 'number' ? quantityVal : (typeof quantityVal === 'string' && quantityVal ? Number(quantityVal) : undefined),
        supermarket_id: typeof supermarketIdVal === 'number' ? supermarketIdVal : (typeof supermarketIdVal === 'string' ? Number(supermarketIdVal) : undefined),
        price: typeof priceVal === 'number' ? priceVal : (priceVal ? Number(priceVal) : 0),
        unit: String(it.unit ?? it.u ?? ''),
        date: String(it.date ?? it['date'] ?? ''),
        best_price: it.best_price ? Number(it.best_price) : undefined,
        best_quantity: it.best_quantity ? Number(it.best_quantity) : undefined,
        best_unit: it.best_unit ? String(it.best_unit) : undefined,
        best_store: it.best_supermarket ? String(it.best_supermarket) : (it.best_store ? String(it.best_store) : undefined),
    } as GroceryItem;
}

export async function fetchGroceryHistory(id: string): Promise<GroceryItem[]> {
    const res = await fetch(`${API_BASE}/grocery-items/${encodeURIComponent(id)}`, { headers: { ...authHeaders() } });
    const body = (await handleResponse(res)) as unknown;
    const maybe = (body as Record<string, unknown> | null) ?? null;

    let raw: unknown[] = [];
    if (Array.isArray(maybe)) {
        raw = maybe as unknown[];
    }
    else if (Array.isArray(maybe?.data)) {
        raw = maybe!.data as unknown[];
    }
    else if (maybe && typeof maybe === 'object') {
        // some backends wrap single object; try to find a 'history' or 'items' property
        if (Array.isArray(maybe.history)) raw = (maybe.history as unknown[]);
        else if (Array.isArray(maybe.items)) raw = (maybe.items as unknown[]);
        else if (maybe.item) raw = [maybe.item as unknown];
    }

    return raw.map(r => mapRawToGrocery((r as Record<string, unknown>) || {}));
}


export async function fetchGroceryItems(
    page = 1,
    perPage = 10,
    search = '',
    month?: string,
    supermarket_id?: number
): Promise<{ data: GroceryItem[]; pagination: Pagination; search?: string }> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(perPage));
    if (search) params.set('search', search);
    params.set('distinct', 'true'); // Always get distinct/grouped items
    if (month) params.set('month', month);
    if (supermarket_id) params.set('supermarket_id', String(supermarket_id));

    const url = `${API_BASE}/grocery-items${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { headers: { ...authHeaders() } });
    const body = (await handleResponse(res)) as unknown;

    // Expected body shape: { data: [...], pagination: { ... }, search: '' }
    const maybeBody = (body as Record<string, unknown> | null) ?? null;
    const rawData = Array.isArray(maybeBody?.data) ? (maybeBody.data as unknown[]) : [];
    const pagination = (maybeBody?.pagination as Pagination | undefined) ?? {
        currentPage: page,
        totalPages: 1,
        totalCount: rawData.length,
        itemsPerPage: perPage,
        hasNextPage: false,
        hasPrevPage: false,
    };

    // Map backend fields to GroceryItem shape
    const data: GroceryItem[] = rawData.map((it: unknown) => {
        const obj = (it as Record<string, unknown>) || {};
        const id = obj.id ?? obj['Id'] ?? obj['ID'];
        const priceVal = obj.price ?? obj['price'] ?? obj['Price'];
        const quantityVal = obj.quantity ?? obj.qty ?? obj['qty'];
        const supermarketIdVal = obj.supermarket_id ?? obj['supermarket_id'] ?? obj['supermarketId'];

        return {
            id: String(id ?? ''),
            name: String(obj.name ?? obj['name'] ?? ''),
            store: String(obj.supermarket ?? obj.store ?? ''),
            quantity: typeof quantityVal === 'number' ? quantityVal : (typeof quantityVal === 'string' && quantityVal ? Number(quantityVal) : undefined),
            supermarket_id: typeof supermarketIdVal === 'number' ? supermarketIdVal : (typeof supermarketIdVal === 'string' ? Number(supermarketIdVal) : undefined),
            price: typeof priceVal === 'number' ? priceVal : (priceVal ? Number(priceVal) : 0),
            unit: String(obj.unit ?? obj.u ?? ''),
            date: String(obj.date ?? obj['date'] ?? ''),
            best_price: obj.best_price ? Number(obj.best_price) : undefined,
            best_quantity: obj.best_quantity ? Number(obj.best_quantity) : undefined,
            best_unit: obj.best_unit ? String(obj.best_unit) : undefined,
            best_store: obj.best_supermarket ? String(obj.best_supermarket) : (obj.best_store ? String(obj.best_store) : undefined),
        } as GroceryItem;
    });

    const searchValue = typeof maybeBody?.search === 'string' ? (maybeBody.search as string) : search;
    return { data, pagination, search: searchValue };
}

export async function createGroceryItem(item: Omit<GroceryItem, 'id'>): Promise<GroceryItem> {
    const payload = {
        ...item,
        supermarket_id: item.supermarket_id,
    };
    // Remove store name if present, as backend relies on supermarket_id
    if ('store' in payload) {
        delete (payload as any).store;
    }
    const res = await fetch(`${API_BASE}/grocery-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
    });
    return (await handleResponse(res)) as GroceryItem;
}



export async function updateGroceryItem(id: string, item: Omit<GroceryItem, 'id'>): Promise<GroceryItem> {
    const payload = {
        ...item,
        supermarket_id: item.supermarket_id,
    };
    // Remove store name if present, as backend relies on supermarket_id
    if ('store' in payload) {
        delete (payload as any).store;
    }
    const res = await fetch(`${API_BASE}/grocery-items/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
    });
    return (await handleResponse(res)) as GroceryItem;
}

export async function deleteGroceryItemApi(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/grocery-items/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
    });
    await handleResponse(res);
}

export async function createGroceryItemsBulk(items: Omit<GroceryItem, 'id'>[]): Promise<GroceryItem[]> {
    const sanitizedItems = items.map(item => {
        const newItem = { ...item };
        if ('store' in newItem) {
            delete (newItem as any).store;
        }
        return newItem;
    });
    const payload = { items: sanitizedItems };
    const res = await fetch(`${API_BASE}/grocery-items/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
    });
    const body = (await handleResponse(res)) as unknown;
    const maybeBody = (body as Record<string, unknown> | null) ?? null;
    const rawData = Array.isArray(maybeBody?.data) ? (maybeBody.data as unknown[]) : (Array.isArray(maybeBody) ? maybeBody : []);

    return rawData.map((it: unknown) => mapRawToGrocery(it as Record<string, unknown>));
}
