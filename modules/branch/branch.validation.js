import { z } from 'zod'

const imgUrlInput = z.union([ //accepts a single url or an array of urls
    z.url(),
    z.array(z.url())
])

export const createBranchSchema = z.object({
    name: z.string().startsWith('Agora ').min(7),
    location: z.string().min(3),
    description: z.string().max(500).optional(),
    imgUrls: imgUrlInput.optional()
})

export const updateBranchSchema = z.object({
    name: z.string().startsWith('Agora ').min(7).optional(),
    location: z.string().min(3).optional(),
    description: z.string().max(500).optional(),
    imgUrls: imgUrlInput.optional()
})