import { z } from 'zod'

export const saveConfigSchema = z.object({
    currency: z.string().min(1).max(2),
    themeConfig: z.object({
        themeName: z.string().min(1),
        navColor: z.string().min(1),
        textColor: z.string().min(1),
        primaryColor: z.string().min(1),
        successColor: z.string().min(1).optional(),
        label: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
    }),
})

export type SaveConfigInput = z.infer<typeof saveConfigSchema>
