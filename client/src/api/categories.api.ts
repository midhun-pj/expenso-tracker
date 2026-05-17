import { API_BASE } from "@utils/app.constant";
import { authHeaders, handleResponse } from "@utils/app.methods";
import type { Category } from "@models/category.model";

export async function fetchCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`, {
        headers: { ...authHeaders() }
    });
    return (await handleResponse(res)) as Category[];
}

export async function createCategory(data: {
    name: string;
    type: 'EXPENSE' | 'INCOME';
}): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    return (await handleResponse(res)) as Category;
}


export async function deleteCategory(categoryId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
    });
    await handleResponse(res);
}