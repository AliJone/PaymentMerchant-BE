// src/routes/index.routes.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const organizationRoutes = require('./organization.routes');
const paymentMerchantRoutes = require('./paymentMerchant.routes');
const sellerRoutes = require('./seller.routes');
const userRoutes = require('./user.routes');
const userRoleRoutes = require('./userRole.routes');
const zohoInvoiceRoutes = require('./zohoInvoice.routes');
const invoiceRoutes = require('./invoice.routes');
const customerRoutes = require('./customer.routes');
const paymentRoutes = require('./payment.routes');
const paymentLinkRoutes = require('./paymentLink.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/organizations', organizationRoutes);
router.use('/payment-merchants', paymentMerchantRoutes);
router.use('/sellers', sellerRoutes);
// router.use('/users', userRoutes);
router.use('/user-roles', userRoleRoutes);
router.use('/zoho-invoice', zohoInvoiceRoutes);
router.use('/invoice', invoiceRoutes);
router.use('/customer', customerRoutes);
router.use('/payment', paymentRoutes);
router.use('/paymentLink', paymentLinkRoutes);

module.exports = router;