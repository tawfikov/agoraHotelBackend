import { z } from 'zod'
export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
    username: z.string().min(4),
    name: z.string().min(4),
    phone: z.string().min(11).max(14),
})

export const loginSchema = z.object({
    email: z.email().optional(),
    username: z.string().min(3).optional(),
    password: z.string().min(6),
}).refine((data) => data.email || data.username, {
    message: "Login using either email or username.",
    path: ["email", "username"]
})
