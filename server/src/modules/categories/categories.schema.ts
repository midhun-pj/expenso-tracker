import { z } from 'zod'
import { TRANSACTION_CATEGORY_TYPES } from '@models/common.model'

export const createCategorySchema = z.object({
    name: z.string().min(1),
    type: z.enum(TRANSACTION_CATEGORY_TYPES),
})

export type CreateCategoryInput = z.infer<
    typeof createCategorySchema
>