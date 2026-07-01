export const GROCERY_UNITS = [
    'G',
    'KG',
    'ML',
    'L',
    'COUNT',
] as const

export type GroceryUnit = (typeof GROCERY_UNITS)[number]
