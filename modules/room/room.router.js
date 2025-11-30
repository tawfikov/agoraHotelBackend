import express from 'express'
import { protect, adminOnly} from '../../middleware/auth.middleware.js'
import * as controller from './room.controller.js'

const router = express.Router()

router.post('/create', protect, adminOnly, controller.createRoom)
router.post('/type/create', protect, adminOnly, controller.createRoomType)
router.put('/:id', protect, adminOnly, controller.updateRoom)
router.put('/type/:id', protect, adminOnly, controller.updateRoomType)
router.delete('/:id', protect, adminOnly, controller.deleteRoom)
router.delete('/type/:id', protect, adminOnly, controller.deleteRoomType)

export default router