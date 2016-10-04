import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap
import * as LSController from '../controllers/ls.controller';

router.post('/lightning-source/order-status-response', LSController.orderStatusResponse);

module.exports = router;
