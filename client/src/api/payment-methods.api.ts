import { API_BASE } from "../utils/app.constant";
import { handleResponse } from "../utils/app.methods";
import type { PaymentMethod } from "../utils/app.models";

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
    const res = await fetch(`${API_BASE}/payment-methods`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return (await handleResponse(res)) as PaymentMethod[];
}

export async function createPaymentMethod(name: string, initialBalance?: number): Promise<PaymentMethod> {
    const res = await fetch(`${API_BASE}/payment-methods`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, initialBalance }),
    });
    return (await handleResponse(res)) as PaymentMethod;
}

export async function deletePaymentMethod(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/payment-methods/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    await handleResponse(res);
}
