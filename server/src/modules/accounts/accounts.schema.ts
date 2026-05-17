import { z } from 'zod'
import { ACCOUNT_TYPES } from '../../models/account.model'


export const createAccountSchema = z.object({
    name: z
        .string()
        .min(1, 'Account name is required')
        .max(100, 'Account name is too long'),

    type: z.enum(ACCOUNT_TYPES),
    initialBalance: z.number().optional(),
})

export const updateAccountSchema = z.object({
    name: z
        .string()
        .min(1, 'Account name is required')
        .max(100, 'Account name is too long')
        .optional(),

    type: z.enum(ACCOUNT_TYPES).optional(),
})

export type CreateAccountInput = z.infer<
    typeof createAccountSchema
>

export type UpdateAccountInput = z.infer<
    typeof updateAccountSchema
>