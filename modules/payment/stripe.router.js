import express from 'express'
import * as controller from './stripe.controller.js'
import { protect } from '../../middleware/auth.middleware.js'
import { webhookHandler } from './stripe.webhook.js';


const router = express.Router()

router.post('/checkout', protect, controller.checkoutSession)
router.get('/cancel', controller.cancel)
router.get('/success', controller.success)

router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    webhookHandler
)

export default router