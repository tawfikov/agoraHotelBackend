import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { swaggerDocs } from './config/swagger.js'
import authRouter from './modules/auth/auth.router.js'
import branchRouter from './modules/branch/branch.router.js'
import roomRouter from './modules/room/room.router.js'
import errorHandler from './middleware/error.middleware.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
swaggerDocs(app)

app.use('/api/auth', authRouter)
app.use('/api/branches', branchRouter)
app.use('/api/rooms', roomRouter)

app.use(errorHandler)

export default app