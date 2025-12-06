import Stripe from 'stripe'
import * as paymentRepo from './stripe.repo.js'
import * as bookingRepo from '../booking/booking.repo.js'
const stripe = new Stripe(process.env.STRIPE_SECRET)

export const webhookHandler = async (req, res) => {
  const signature = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      signature, 
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  console.log('Webhook received:', event.type);
  console.log('Metadata:', event.data.object.metadata);


  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const bookingId = parseInt(session.metadata.bookingId, 10)
      const userId = parseInt(session.metadata.userId, 10)
      const totalPrice = parseFloat(session.metadata.totalPrice);

      await bookingRepo.updateBookingStatus(bookingId, 'CONFIRMED');

      // Create payment record
      await paymentRepo.createPayment({
        bookingId,
        amount: totalPrice,
        status: 'SUCCESS',
        method: 'CARD',
      });

      console.log(`Booking ${bookingId} confirmed and payment recorded.`);
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      console.log(`Payment failed: ${paymentIntent.id}`);
    }

    res.status(200).send('Webhook received');
  } catch (err) {
    console.error('Webhook processing failed:', err);
    res.status(500).send('Server error');
  }


}
