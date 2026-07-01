export interface Category {
    id: string;
    name: string;
    type: CategoryType;
    userId: string;
    createdAt: string;
}

export const CATEGORY_TYPES = ['INCOME', 'EXPENSE'] as const;

export type CategoryType = typeof CATEGORY_TYPES[number];

export type CategoryFormProps = {
    categories: Category[];
    addCategory: (name: string, type: CategoryType) => void;
    removeCategory: (id: string) => void;
}
