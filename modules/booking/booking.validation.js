import { z } from 'zod'

export const createBookingSchema = z.object({
    roomTypeId: z.number().int().positive(),
    branchId: z.number().int().positive(),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
})

export const searchRoomsSchema = z.object({
  branchId: z.number().int().positive(),
  guests: z.number().int().positive(),
})

export const quoteRoomSchema = z.object({
  branchId: z.number().int().positive(),
  roomTypeId: z.number().int().positive(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
}).refine(
  (data) => data.checkOut > data.checkIn,
  {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  }
)

