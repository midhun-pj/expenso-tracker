import type { PaginatedResponse } from "@models/common.model";
import type { GetProductQuery, Product } from "@models/product.model";

import { API_BASE } from "@utils/app.constant";
import { authHeaders, handleResponse } from "@utils/app.methods";

const API_URL = `${API_BASE}/products`;

export async function list(params: GetProductQuery): Promise<PaginatedResponse<Product>> {
  const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            query.append(key, String(value));
        }
    });


  const res = await fetch(`${API_URL}?${query.toString()}`, {
    headers: authHeaders(),
  });

  return (await handleResponse(res)) as PaginatedResponse<Product>;
}

export async function create(data: Omit<Product, "id">): Promise<Product> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  return (await handleResponse(res)) as Product;
}

export async function update(
  id: string,
  data: Partial<Product>,
): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  return (await handleResponse(res)) as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await handleResponse(res);
}
