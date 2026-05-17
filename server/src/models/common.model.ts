export const TRANSACTION_CATEGORY_TYPES = [
    "INCOME",
    "EXPENSE"
] as const;

export type TransactionCategoryType =
    (typeof TRANSACTION_CATEGORY_TYPES)[number];

export const TRANSACTION_TYPES = [
    "INCOME",
    "EXPENSE",
    "TRANSFER"
] as const;

export type TransactionType =
    (typeof TRANSACTION_TYPES)[number];
