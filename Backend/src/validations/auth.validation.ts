import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email format"),
    confirmEmail: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    address: z.string().optional(),
    phone: z.string().optional(),
})
 .refine ((data)=> data.email === data.confirmEmail, {
    message: "Password do not match",
    path: ["confirmPassword"],
 });

 export const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password is required"),
 });


 export type RegisterInput = z.infer<typeof registerSchema>;
 export type LoginInput = z.infer<typeof loginSchema>;
