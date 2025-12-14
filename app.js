import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { swaggerDocs } from './config/swagger.js'
import authRouter from './modules/auth/auth.router.js'
import branchRouter from './modules/branch/branch.router.js'
import roomRouter from './modules/room/room.router.js'
import bookingRouter from './modules/booking/booking.router.js'
import stripeRouter from './modules/payment/stripe.router.js'
import errorHandler from './middleware/error.middleware.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
//app.use(express.json())
app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') return next();
  express.json()(req, res, next);
});

app.use(cookieParser())
swaggerDocs(app)

app.use('/api/auth', authRouter)
app.use('/api/branches', branchRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/stripe', stripeRouter)

app.use(errorHandler)

export default app