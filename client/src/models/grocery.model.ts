import type { FormValues } from "./common.model";

export const GROCERY_UNITS = ['G', 'KG', 'ML', 'L', 'COUNT'] as const;
export type GroceryUnit = (typeof GROCERY_UNITS)[number];

export interface GroceryItem {
    id: string;
    productId: string;
    supermarketId: string;
    quantity: number;
    unit: GroceryUnit;
    price: number;
    date: string;
    // Expanded relations from API
    product?: { id: string; name: string; brandName?: string };
    supermarket?: { id: string; name: string; location?: string };

    // Optional summary fields
    best_price?: number;
    best_quantity?: number;
    best_unit?: string;
    best_store?: string;
    purchaseCount?: number;
}

export type GrocerySummaryItem = GroceryItem & {
    best_price: number;
    best_quantity: number;
    best_unit: string;
    best_store: string;
    purchaseCount: number;
};

export interface CreateGroceryItemPayload {
    productId: string;
    supermarketId: string;
    quantity: number;
    unit: GroceryUnit;
    price: number;
    date: string;
}

export interface BulkCreateGroceryPayload {
    items: CreateGroceryItemPayload[];
}

export interface GroceryItemQuery {
    page?: number;
    limit?: number;
    search?: string;
    month?: number;
    year?: number;
    supermarketId?: string;
    productId?: string;
}


export type Tab = 'single' | 'bulk';

export interface BulkRow {
    productId: string;
    productSearch: string;
    quantity: string;
    unit: string;
    price: string;
}

export const emptyBulkRow = (): BulkRow => ({
    productId: '',
    productSearch: '',
    quantity: '',
    unit: '',
    price: '',
});

export interface SingleTabProps {
    supermarkets: { id: string; name: string }[];
    onSubmit: (values: FormValues, productId: string) => void;
    onCancel: () => void;
    submitting: boolean;
}

export interface BulkTabProps {
    supermarkets: { id: string; name: string }[];
    onSubmit: (sharedValues: FormValues, rows: BulkRow[]) => void;
    onCancel: () => void;
    submitting: boolean;
}