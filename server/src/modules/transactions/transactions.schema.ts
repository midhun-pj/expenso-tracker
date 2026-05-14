import { z } from 'zod'

export const transactionSchema = z.object({
    accountId: z.string().min(1, 'Account is required'),
    amount: z.number().positive('Amount must be greater than 0'),
    description: z.string().optional(),
    date: z.string().datetime().optional(), // ISO date string
    type: z.enum(['EXPENSE', 'INCOME']),
    categoryId: z.string().min(1, 'Category is required'),
})

export const transferSchema = z.object({
    fromAccountId: z.string().min(1),
    toAccountId: z.string().min(1),
    amount: z.number().positive(),
    description: z.string().optional(),
    date: z.string().datetime().optional(),
})

export type TransactionInput = z.infer<typeof transactionSchema>
export type TransferInput = z.infer<typeof transferSchema>

// For backward compatibility
export type ExpenseInput = TransactionInput