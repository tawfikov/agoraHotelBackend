import { Resend } from "resend"
import { findBookingDetails } from "./stripe.repo.js"

export const handleEmails = async (bookingId) => {
    const booking = await findBookingDetails(bookingId)

    const message = `
        Hello ${booking.user.name},
        
        Your booking and payment for booking number ${bookingId}:
        Room number: ${booking.room.number}
        Hotel: ${booking.room.branch.name}
        From: ${booking.checkIn} To: ${booking.checkOut}
        Total: ${booking.totalPrice}
        
        Thank you for choosing Agora hotel
        We wish you a good stay.
    `

    console.log("Sending email to:", booking.user.email)
    console.log("Email body:\n", message)

    const resend = new Resend(process.env.RESEND_SECRET)

    await resend.emails.send({
        from: `Agora Hotels <onboarding@resend.dev>`,
        to: booking.user.email,
        subject: 'Booking Confirmation',
        text: message
    })

    console.log("Booking confirmation email sent.")

}