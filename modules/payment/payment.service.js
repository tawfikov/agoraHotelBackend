import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET)

const SUCCESS_URL = process.env.STRIPE_SUCCESS_URL
const CANCEL_URL = process.env.STRIPE_CANCEL_URL

export const createCheckoutSession = async ({ booking, userId }) => {
  return stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: `Booking #${booking.id} - Room Type: ${booking.roomTypeId}, Branch: ${booking.branchId}`
          },
          unit_amount: booking.totalPrice * 100
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    metadata: {
      bookingId: booking.id.toString(),
      userId: userId.toString(),
      totalPrice: booking.totalPrice.toString(),
      roomTypeId: booking.roomTypeId.toString(),
      branchId: booking.branchId.toString(),
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString()
    },
    success_url: SUCCESS_URL,
    cancel_url: CANCEL_URL
  })
}
