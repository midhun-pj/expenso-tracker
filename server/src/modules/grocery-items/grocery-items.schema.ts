import { z } from 'zod'
import { GROCERY_UNITS } from '@models/grocery.model'

export const createGroceryItemSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    supermarketId: z.string().min(1, 'Supermarket is required'),
    quantity: z.number().positive('Quantity must be greater than 0'),
    unit: z.enum(GROCERY_UNITS),
    price: z.number().min(0, 'Price must be >= 0'),
    date: z.string().min(1, 'Date is required'),
})

export const updateGroceryItemSchema = z.object({
    productId: z.string().min(1).optional(),
    supermarketId: z.string().min(1).optional(),
    quantity: z.number().positive().optional(),
    unit: z.enum(GROCERY_UNITS).optional(),
    price: z.number().min(0).optional(),
    date: z.string().min(1).optional(),
})

export const bulkCreateGroceryItemSchema = z.object({
    items: z
        .array(createGroceryItemSchema)
        .min(1, 'At least one item is required'),
})

export type CreateGroceryItemInput = z.infer<
    typeof createGroceryItemSchema
>

export type UpdateGroceryItemInput = z.infer<
    typeof updateGroceryItemSchema
>

export type BulkCreateGroceryItemInput = z.infer<
    typeof bulkCreateGroceryItemSchema
>
