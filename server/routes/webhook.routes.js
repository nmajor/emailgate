import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap
import * as LSController from '../controllers/ls.controller';
import * as WooCommerceController from '../controllers/woo.controller';
import * as MailBucket from '../controllers/mailBucket.controller';

router.post('/lightning-source/order-status-response', LSController.orderStatusResponse);
router.post('/woo/orders', WooCommerceController.orderCreated);
router.post('/mail-bucket/create-email/:compilationId', MailBucket.createEmail);

module.exports = router;
