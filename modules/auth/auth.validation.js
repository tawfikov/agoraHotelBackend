import { z } from 'zod'
export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
    username: z.string().min(4),
    name: z.string().min(4),
    phone: z.string().min(11).max(14),
})

export const loginSchema = z.object({
    email: z.string().optional(),
    username: z.string().optional(),
    password: z.string(),
}).refine((data) => data.email || data.username, {
    message: "Login using either email or username.",
    path: ["email", "username"]
})
