import { API_BASE } from "@utils/app.constant";
import { authHeaders, handleResponse } from "@utils/app.methods";
import type { Account, AccountBase } from "@models/account.model";

const API_URL = `${API_BASE}/accounts`;

export async function list(search: string): Promise<Account[]> {
  const query = new URLSearchParams();

  query.append("search", search);

  const res = await fetch(`${API_URL}?${query.toString()}`, {
    headers: authHeaders(),
  });
  return (await handleResponse(res)) as Account[];
}

export async function getById(id: string): Promise<Account> {
  const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    headers: { ...authHeaders() },
  });
  return (await handleResponse(res)) as Account;
}

export async function create(data: Omit<Account, "id">): Promise<Account> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  return (await handleResponse(res)) as Account;
}

export async function update(
  id: string,
  data: AccountBase,
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  return (await handleResponse(res)) as { message: string };
}

export async function remove(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });

  return (await handleResponse(res)) as { message: string };
}
