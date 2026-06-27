import type { Supermarket } from "@models/supermarket.model";
import { API_BASE } from "@utils/app.constant";
import { authHeaders, handleResponse } from "@utils/app.methods";

const API_URL = `${API_BASE}/supermarkets`;

export async function list(search: string): Promise<Supermarket[]> {
  const query = new URLSearchParams();

  query.append('search', search);


  const res = await fetch(`${API_URL}?${query.toString()}`, {
    headers: authHeaders(),
  });

  return (await handleResponse(res)) as Supermarket[];
}

export async function create(data: Omit<Supermarket, "id">): Promise<Supermarket> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  return (await handleResponse(res)) as Supermarket;
}

export async function update(
  id: string,
  data: Partial<Supermarket>,
): Promise<Supermarket> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  return (await handleResponse(res)) as Supermarket;
}

export async function deleteSupermarket(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await handleResponse(res);
}
