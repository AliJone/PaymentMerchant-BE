// src/routes/paymentMerchant.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createPaymentMerchant,
  getPaymentMerchants
} = require('../controllers/paymentMerchant.controller');

router.post('/', auth, createPaymentMerchant);
router.get('/', auth, getPaymentMerchants);

module.exports = router;