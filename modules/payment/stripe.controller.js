// This is your test secret API key.
import * as paymentRepo from './stripe.repo.js'
import { BadRequestError, NotFoundError } from '../../utils/AppError.js'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET)

const YOUR_DOMAIN = 'http://localhost:3000/api/stripe'

export const checkoutSession = async (req, res, next) => {
    try {
    const { bookingId, totalPrice, roomTypeId, branchId, userId, checkIn, checkOut } = req.body
    const booking = await paymentRepo.findBookingById(bookingId)

    if (!booking) {
        throw new NotFoundError('Booking not found')
    }
    if (booking.status !== 'PENDING') {
        throw new BadRequestError('Booking couldn\'t be confirmed. Please try again.')
    }

    const session = await stripe.checkout.sessions.create({
        line_items: [
        {
            price_data: {
                currency: 'egp',
                product_data: {
                    name: `Booking #${bookingId} - Room Type: ${roomTypeId}, Branch: ${branchId}`
                },
                unit_amount: totalPrice * 100
            },
            quantity: 1
        }
        ],
        mode: 'payment',

        metadata: {
        bookingId: bookingId.toString(),
        userId: userId.toString(),
        totalPrice: totalPrice.toString(),
        roomTypeId: roomTypeId.toString(),
        branchId: branchId.toString()
      },

        success_url: `${YOUR_DOMAIN}/success`,
        cancel_url: `${YOUR_DOMAIN}/cancel`
    })

    res.json({ url: session.url })
    } catch(err) {
        next(err)
    }
}

export const success = (req, res, next) => {
    res.json('Payment processed successfully.')
}

export const cancel = (req, res, next) => {
    res.json('Payment cancelled.')
}
