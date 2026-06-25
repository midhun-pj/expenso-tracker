import { z } from 'zod'

export const createSupermarketSchema = z.object({
    name: z
        .string()
        .min(1, 'Supermarket name is required')
        .max(200, 'Supermarket name is too long'),
})

export const updateSupermarketSchema = z.object({
    name: z
        .string()
        .min(1, 'Supermarket name is required')
        .max(200, 'Supermarket name is too long')
        .optional(),
})

export type CreateSupermarketInput = z.infer<
    typeof createSupermarketSchema
>

export type UpdateSupermarketInput = z.infer<
    typeof updateSupermarketSchema
>
