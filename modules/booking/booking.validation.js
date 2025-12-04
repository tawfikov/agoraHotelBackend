import { z } from 'zod'

export const createBookingSchema = z.object({
    roomTypeId: z.number().int().positive(),
    branchId: z.number().int().positive(),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
})