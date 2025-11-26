import express from 'express'
import * as controller from  './branch.controller.js'
import { protect, adminOnly } from '../../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.post('/create', protect, adminOnly, controller.createNew)
//router.delete('/:id', protect, adminOnly, controller.deleteBranch)

export default router