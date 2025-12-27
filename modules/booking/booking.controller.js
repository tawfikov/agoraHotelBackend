import { createBookingSchema, searchRoomsSchema, quoteRoomSchema } from "./booking.validation.js"
import * as bookingService from './booking.service.js'
import * as paymentService from '../payment/payment.service.js'

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

export const searchRoomTypes = async (req, res, next) => {
    try {
        const dto = searchRoomsSchema.parse(req.body)
        const searchResults = await bookingService.searchRoomTypes(dto)
        res.status(200).json({ searchResults })
    } catch (err) {
        next(err)
    }
}

export const pricingRoomType = async (req, res, next) => {
  try {
    const zoddedRoomPricing = quoteRoomSchema.parse(req.body)

    const pricing = await bookingService.pricingRoomType(zoddedRoomPricing)

    res.status(200).json(pricing)
  } catch (err) {
    next(err)
  }
}

// Creates a booking and immediately issues a Stripe Checkout Session so the client can redirect.
export const createBookingWithCheckout = async (req, res, next) => {
  const zoddedBooking = createBookingSchema.parse(req.body)
  zoddedBooking.userId = req.user.sub

  try {
    const booking = await bookingService.createBooking(zoddedBooking)
    const session = await paymentService.createCheckoutSession({ booking, userId: zoddedBooking.userId })

    res.status(201).json({ booking, checkoutUrl: session.url })
  } catch (err) {
    next(err)
  }
}

export const getBookings = async (req, res, next) => {
  const userId = req.user.sub
  try {
    const bookings = await bookingService.getBookingHistory(userId)
    res.status(200).json({ bookings })
  } catch(err) {
    next(err)
  }
}
