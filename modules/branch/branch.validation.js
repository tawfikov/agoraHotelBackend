import { z } from 'zod'

export const createBranchSchema = z.object({
    name: z.string().startsWith('Agora ').min(7),
    location: z.string().min(3),
    description: z.string().max(500).optional(),
    imgUrls: z.array(z.url().optional())
})