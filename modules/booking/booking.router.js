import express from 'express'
import * as controller from './booking.controller.js'
import { protect, adminOnly } from '../../middleware/auth.middleware.js'

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Hotel booking management endpoints
 */

const router = express.Router()

/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - branchId
 *               - roomTypeId
 *               - checkIn
 *               - checkOut
 *             properties:
 *               branchId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               roomTypeId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *               checkIn:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-10T14:00:00Z"
 *                 description: Check-in date and time
 *               checkOut:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-15T11:00:00Z"
 *                 description: Check-out date and time
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newBooking:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 42
 *                     userId:
 *                       type: integer
 *                       example: 12
 *                     roomId:
 *                       type: integer
 *                       example: 101
 *                     checkIn:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-10T14:00:00Z"
 *                     checkOut:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-15T11:00:00Z"
 *                     totalPrice:
 *                       type: number
 *                       format: float
 *                       example: 2500.00
 *                     status:
 *                       type: string
 *                       enum: [PENDING, CONFIRMED, CANCELLED]
 *                       example: PENDING
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: No available rooms for the selected branch and room type, or branch/type not found
 */
router.post('/', protect, controller.createBooking)

export default router