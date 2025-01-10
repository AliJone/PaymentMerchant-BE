const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const auth= require('../middleware/auth');
const attachZohoApi = require('../middleware/zohoApi');

router.use(auth);
router.use(attachZohoApi);

router.post('/payments/', paymentController.createPayment);
router.put('/payments/:paymentId', paymentController.updatePayment);
router.get('/payments/:paymentId', paymentController.getPaymentById);
router.delete('/payments/:paymentId', paymentController.deletePayment);

module.exports = router;