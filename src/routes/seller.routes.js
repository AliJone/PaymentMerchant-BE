// src/routes/seller.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createSellerRequest,
  approveSellerRequest,
  getSellerEarnings
} = require('../controllers/seller.controller');

router.post('/requests', auth, createSellerRequest);
router.put('/requests/:id/approve', auth, approveSellerRequest);
router.get('/earnings', auth, getSellerEarnings);

module.exports = router;