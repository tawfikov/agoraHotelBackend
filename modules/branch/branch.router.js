import express from 'express'
import * as controller from  './branch.controller.js'
import { protect, adminOnly } from '../../middleware/auth.middleware.js'

/**
 * @swagger
 * tags:
 *   name: Branches
 *   description: Hotel branch management endpoints
 */

const router = express.Router()

/**
 * @swagger
 * /api/branches:
 *   get:
 *     summary: Get all branches
 *     tags: [Branches]
 *     security: []
 *     responses:
 *       200:
 *         description: List of all branches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 branches:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                         example: Agora Downtown
 *                       location:
 *                         type: string
 *                         example: New York, NY
 *                       description:
 *                         type: string
 *                         nullable: true
 *                       imgUrls:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 */
router.get('/', controller.getAll)

/**
 * @swagger
 * /api/branches/{id}:
 *   get:
 *     summary: Get branch by ID
 *     tags: [Branches]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 branch:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     location:
 *                       type: string
 *                     description:
 *                       type: string
 *                       nullable: true
 *                     imgUrls:
 *                       type: array
 *                       items:
 *                         type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Branch not found
 */
router.get('/:id', controller.getById)

/**
 * @swagger
 * /api/branches/create:
 *   post:
 *     summary: Create a new branch (Admin only)
 *     tags: [Branches]
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
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 7
 *                 pattern: '^Agora .*'
 *                 example: Agora Downtown
 *                 description: Must start with "Agora "
 *               location:
 *                 type: string
 *                 minLength: 3
 *                 example: New York, NY
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: A luxurious hotel in the heart of downtown
 *               imgUrls:
 *                 oneOf:
 *                   - type: string
 *                     format: uri
 *                   - type: array
 *                     items:
 *                       type: string
 *                       format: uri
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *     responses:
 *       201:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newBranch:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     location:
 *                       type: string
 *                     description:
 *                       type: string
 *                     imgUrls:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - admin access required
 */
router.post('/create', protect, adminOnly, controller.createNew)

/**
 * @swagger
 * /api/branches/{id}:
 *   delete:
 *     summary: Delete a branch (Admin only)
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     responses:
 *       204:
 *         description: Branch deleted successfully
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Branch not found
 */
router.delete('/:id', protect, adminOnly, controller.deleteBranch)

/**
 * @swagger
 * /api/branches/{id}:
 *   put:
 *     summary: Update a branch (Admin only)
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 7
 *                 pattern: '^Agora .*'
 *                 example: Agora Downtown
 *                 description: Must start with "Agora "
 *               location:
 *                 type: string
 *                 minLength: 3
 *                 example: New York, NY
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Updated description
 *               imgUrls:
 *                 oneOf:
 *                   - type: string
 *                     format: uri
 *                   - type: array
 *                     items:
 *                       type: string
 *                       format: uri
 *                 example: ["https://example.com/image1.jpg"]
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedBranch:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     location:
 *                       type: string
 *                     description:
 *                       type: string
 *                     imgUrls:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Branch not found
 */
router.put('/:id', protect, adminOnly, controller.updateBranch)

export default router