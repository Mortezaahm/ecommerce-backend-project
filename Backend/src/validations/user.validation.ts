import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),

  email: z.email("Invalid email format").optional(),

  role: z.enum(["user", "admin"]).optional()
})
.refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field must be provided"
    }
);
