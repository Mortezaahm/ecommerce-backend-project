import { z } from "zod";

export const createCategorySchema = z.object({
    title: z.string().min(1, "Title is required")
});

export const updateCategorySchema = z.object({
    title: z.string().min(1, "Title is required").optional()
})
.refine (data=> Object.keys(data).length > 0 , {
    message: "At least one field must be provided"
});
