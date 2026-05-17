import { z } from 'zod'
import { TRANSACTION_CATEGORY_TYPES, TRANSACTION_TYPES } from '@models/common.model'

export const transactionSchema = z.object({
    accountId: z.string().min(1, 'Account is required'),
    amount: z.number().positive('Amount must be greater than 0'),
    description: z.string().optional(),
    date: z.string().datetime().optional(), // ISO date string
    type: z.enum(TRANSACTION_CATEGORY_TYPES),
    categoryId: z.string().min(1, 'Category is required'),
})

export const transferSchema = z.object({
    fromAccountId: z.string().min(1),
    toAccountId: z.string().min(1),
    amount: z.number().positive(),
    description: z.string().optional(),
    date: z.string().datetime().optional(),
})

export const getTransactionsQuerySchema = z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20),
    year: z.coerce.number().optional(),
    month: z.coerce.number().optional(),
    type: z.enum(TRANSACTION_TYPES).optional(),
    categoryId: z.string().optional(),
    accountId: z.string().optional(),
    search: z.string().optional(),
})

export const updateTransactionDetailsSchema = z.object({
    description: z.string().optional(),
    date: z.string().datetime().optional(),
})

export type TransactionInput = z.infer<typeof transactionSchema>
export type TransferInput = z.infer<typeof transferSchema>

// For backward compatibility
export type ExpenseInput = TransactionInput