

export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Category {
    id: string;
    name: string;
    type: CategoryType;
    userId: string;
    createdAt: string;
}

export const COMMON_CURRENCIES = ['$', '€', '£', '₹', '¥', 'R', 'kr', 'AED', '₱'];


export const THEME_PRESETS = [
    {
        name: 'ocean',
        label: 'Ocean Blue',
        description: 'Cool and professional',
        primaryColor: '#4f46e5',
        successColor: '#10b981',
        navColor: '#ffffff',
        textColor: '#0f172a',
    },
    {
        name: 'sunset',
        label: 'Sunset Orange',
        description: 'Warm and energetic',
        primaryColor: '#ea580c',
        successColor: '#84cc16',
        navColor: '#fafaf9',
        textColor: '#1c1917',
    },
    {
        name: 'forest',
        label: 'Forest Green',
        description: 'Natural and calm',
        primaryColor: '#059669',
        successColor: '#06b6d4',
        navColor: '#fafafa',
        textColor: '#171717',
    },
] as const;

export type ThemeName = typeof THEME_PRESETS[number]['name'];