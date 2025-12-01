import express from 'express'
import { protect, adminOnly} from '../../middleware/auth.middleware.js'
import * as controller from './room.controller.js'

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room & Room Type Management
 */

const router = express.Router()

/**
 * @swagger
 * /api/rooms/create:
 *   post:
 *     summary: Create a new room (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - branchId
 *               - roomTypeId
 *             properties:
 *               number:
 *                 type: string
 *                 example: "101"
 *               branchId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               roomTypeId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               roomStatus:
 *                 type: string
 *                 enum: [AVAILABLE, OCCUPIED, MAINTENANCE]
 *                 default: AVAILABLE
 *                 example: AVAILABLE
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newRoom:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     number:
 *                       type: string
 *                     branchId:
 *                       type: integer
 *                     roomTypeId:
 *                       type: integer
 *                     roomStatus:
 *                       type: string
 *                       enum: [AVAILABLE, OCCUPIED, MAINTENANCE]
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - admin access required
 */
router.post('/create', protect, adminOnly, controller.createRoom)

/**
 * @swagger
 * /api/rooms/type/create:
 *   post:
 *     summary: Create a new room type (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - capacity
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Deluxe Suite
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 150.00
 *               imgUrls:
 *                 oneOf:
 *                   - type: string
 *                     format: uri
 *                   - type: array
 *                     items:
 *                       type: string
 *                       format: uri
 *                 example: ["https://example.com/room1.jpg"]
 *               amenities:
 *                 oneOf:
 *                   - type: string
 *                   - type: array
 *                     items:
 *                       type: string
 *                 example: ["WiFi", "TV", "Mini Bar"]
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Spacious room with city view
 *     responses:
 *       201:
 *         description: Room type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newRoomType:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     capacity:
 *                       type: integer
 *                     price:
 *                       type: number
 *                     imgUrls:
 *                       type: array
 *                       items:
 *                         type: string
 *                     amenities:
 *                       type: array
 *                       items:
 *                         type: string
 *                     description:
 *                       type: string
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - admin access required
 */
router.post('/type/create', protect, adminOnly, controller.createRoomType)

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Update a room (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: string
 *                 example: "102"
 *               roomTypeId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               roomStatus:
 *                 type: string
 *                 enum: [AVAILABLE, OCCUPIED, MAINTENANCE]
 *                 example: OCCUPIED
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedRoom:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     number:
 *                       type: string
 *                     branchId:
 *                       type: integer
 *                     roomTypeId:
 *                       type: integer
 *                     roomStatus:
 *                       type: string
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Room not found
 */
router.put('/:id', protect, adminOnly, controller.updateRoom)

/**
 * @swagger
 * /api/rooms/type/{id}:
 *   put:
 *     summary: Update a room type (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room Type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Premium Suite
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 4
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 250.00
 *               imgUrls:
 *                 oneOf:
 *                   - type: string
 *                     format: uri
 *                   - type: array
 *                     items:
 *                       type: string
 *                       format: uri
 *               amenities:
 *                 oneOf:
 *                   - type: string
 *                   - type: array
 *                     items:
 *                       type: string
 *               description:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Room type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedRoomType:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     capacity:
 *                       type: integer
 *                     price:
 *                       type: number
 *                     imgUrls:
 *                       type: array
 *                       items:
 *                         type: string
 *                     amenities:
 *                       type: array
 *                       items:
 *                         type: string
 *                     description:
 *                       type: string
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Room type not found
 */
router.put('/type/:id', protect, adminOnly, controller.updateRoomType)

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Delete a room (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Room not found
 */
router.delete('/:id', protect, adminOnly, controller.deleteRoom)

/**
 * @swagger
 * /api/rooms/type/{id}:
 *   delete:
 *     summary: Delete a room type (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room Type ID
 *     responses:
 *       200:
 *         description: Room type deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Room type not found
 */
router.delete('/type/:id', protect, adminOnly, controller.deleteRoomType)

/**
 * @swagger
 * /api/rooms/types/{branchId}:
 *   get:
 *     summary: Get all room types for a branch
 *     tags: [Rooms]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: List of room types for the branch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomTypes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       capacity:
 *                         type: integer
 *                       price:
 *                         type: number
 *                       imgUrls:
 *                         type: array
 *                         items:
 *                           type: string
 *                       amenities:
 *                         type: array
 *                         items:
 *                           type: string
 *                       description:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Branch not found
 */
router.get('/types/:branchId', controller.getAllRoomTypes)

/**
 * @swagger
 * /api/rooms/types/{branchId}/{roomTypeId}:
 *   get:
 *     summary: Get a specific room type
 *     tags: [Rooms]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *       - in: path
 *         name: roomTypeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room Type ID
 *     responses:
 *       200:
 *         description: Room type details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomType:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     capacity:
 *                       type: integer
 *                     price:
 *                       type: number
 *                     imgUrls:
 *                       type: array
 *                       items:
 *                         type: string
 *                     amenities:
 *                       type: array
 *                       items:
 *                         type: string
 *                     description:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Room type not found
 */
router.get('/types/:branchId/:roomTypeId', controller.getRoomType)

export default router