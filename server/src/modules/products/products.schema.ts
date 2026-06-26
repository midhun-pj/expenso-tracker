import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name is too long"),
  brandName: z.string().max(200, "Brand name is too long").optional(),
});

export const getProductSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  search: z.string().optional(),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name is too long")
    .optional(),
  brandName: z.string().max(200, "Brand name is too long").optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
