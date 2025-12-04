import { createBookingSchema } from "./booking.validation.js"
import * as bookingService from './booking.service.js'

export const createBooking = async (req, res, next) => {
    const zoddedBooking = createBookingSchema.parse(req.body)
    zoddedBooking.userId = req.user.sub
    try {
        const newBooking = await bookingService.createBooking(zoddedBooking)
        res.status(201).json({ newBooking })
    } catch (err) {
        next(err)
    }
}