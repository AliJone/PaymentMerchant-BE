// src/routes/invoice.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const attachZohoApi = require('../middleware/zohoApi');
const {
  getInvoiceSetupData,
  createInvoice,
  listInvoices,
  getInvoiceById,
  updateInvoice,
  getAllInvoices,
  deleteInvoice,
  markInvoiceAsSent,
  emailInvoice,
  getInvoiceEmailContent,
  updateCustomFields,
  sendPaymentReminder,
  writeOffInvoice,
  cancelWriteOff
} = require('../controllers/invoice.controller');

router.use(auth);

// Apply role check middleware
router.use(roleCheck({
  requireTargetUser: true,
  allowedRoles: ['super_admin', 'admin', 'seller', 'user']
}));



router.use(attachZohoApi);

// Existing routes
router.get('/setup', getInvoiceSetupData);
router.get('/invoices', listInvoices);
router.post('/invoices', createInvoice);
router.get('/invoices/:invoiceId', getInvoiceById);
router.put('/invoices/:invoiceId', updateInvoice);
router.delete('/invoices/:invoiceId', deleteInvoice);
router.post('/invoices/:invoiceId/status/sent', markInvoiceAsSent);
router.post('/invoices/:invoiceId/email', emailInvoice);
router.get('/invoices/:invoiceId/email', getInvoiceEmailContent);
router.put('/invoices/:invoiceId/customfields', updateCustomFields);
router.post('/invoices/:invoiceId/paymentreminder', sendPaymentReminder);
router.post('/invoices/:invoiceId/writeoff', writeOffInvoice);
router.post('/invoices/:invoiceId/writeoff/cancel', cancelWriteOff);

module.exports = router;
