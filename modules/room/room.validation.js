import { z } from 'zod'

const imgUrlInput = z.union([
    z.url(),
    z.array(z.url())
])

const amenitiesInput = z.union([
    z.string(),
    z.array(z.string())
])

export const createRoomSchema = z.object({
    number: z.string(),
    branchId: z.number().int().positive(),
    roomTypeId: z.number().int().positive(),
    roomStatus: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).optional()
})

export const createRoomTypeSchema = z.object({
    name: z.string(),
    capacity: z.number().int().positive(),
    price: z.number().positive(),
    imgUrls: imgUrlInput.optional(),
    amenities: amenitiesInput.optional(),
    description: z.string().max(500).optional()
})

export const updateRoomSchema = z.object({
    number: z.string().optional(),
    roomTypeId: z.number().int().positive().optional(),
    roomStatus: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).optional()
})

export const updateRoomTypeSchema = z.object({
    name: z.string().optional(),
    capacity: z.number().int().positive().optional(),
    price: z.number().positive().optional(),
    imgUrls: imgUrlInput.optional(),
    amenities: amenitiesInput.optional(),
    description: z.string().max(500).optional()
})