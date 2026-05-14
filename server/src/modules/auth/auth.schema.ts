import { z } from 'zod'

export const registerSchema = z.object({
    email: z
        .email('Invalid email address')
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100),

    name: z
        .string()
        .min(2, 'Name is too short')
        .max(100)
        .optional(),
})

export const loginSchema = z.object({
    email: z
        .email('Invalid email address')
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters'),
})

export type RegisterInput = z.infer<
    typeof registerSchema
>

export type LoginInput = z.infer<
    typeof loginSchema
>