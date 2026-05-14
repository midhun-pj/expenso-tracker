import { z } from 'zod'

export const accountTypes = [
    'CASH',
    'BANK',
    'CREDIT_CARD',
    'SAVINGS',
    'WALLET',
] as const

export const createAccountSchema = z.object({
    name: z
        .string()
        .min(1, 'Account name is required')
        .max(100, 'Account name is too long'),

    type: z.enum(accountTypes),
    initialBalance: z.number().optional(),
})

export const updateAccountSchema = z.object({
    name: z
        .string()
        .min(1, 'Account name is required')
        .max(100, 'Account name is too long')
        .optional(),

    type: z.enum(accountTypes).optional(),
})

export type CreateAccountInput = z.infer<
    typeof createAccountSchema
>

export type UpdateAccountInput = z.infer<
    typeof updateAccountSchema
>