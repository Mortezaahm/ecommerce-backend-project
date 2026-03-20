import { z } from "zod";

export const createProductSchema = z.object({
    title: z.string().min(1, "Title is required"),
    info: z.string().optional(),
    price: z.number().nonnegative("Price cannot be negative"),
    category_id: z.number().optional(),
    in_stock: z.boolean().optional()
});

export const updateProductSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    info: z.string().optional(),
    price: z.number().nonnegative("Price cannot be negative").optional(),
    category_id: z.number().optional(),
    in_stock: z.boolean().optional()
});
