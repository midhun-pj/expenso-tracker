import { z } from 'zod'

export const saveConfigSchema = z.object({
    currency: z.string().min(1).max(5),
    themeConfig: z.object({
        themeName: z.string().min(1),
        navColor: z.string().min(1),
        textColor: z.string().min(1),
        buttonColor: z.string().min(1),
    }),
})

export type SaveConfigInput = z.infer<typeof saveConfigSchema>
