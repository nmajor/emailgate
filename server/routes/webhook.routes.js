import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap
import * as LSController from '../controllers/ls.controller';
import * as WooCommerceController from '../controllers/woo.controller';

router.post('/lightning-source/order-status-response', LSController.orderStatusResponse);

router.post('/woo/orders', WooCommerceController.orderCreated);

module.exports = router;
