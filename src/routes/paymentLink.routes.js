const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const attachZohoApi = require('../middleware/zohoApi');
const {
  createPaymentLink,
  getPaymentLinks,
  getPaymentLinkById,
  updatePaymentLink,
  deletePaymentLink
} = require('../controllers/paymentLink.controller');

router.use(auth);

router.use(roleCheck({
  requireTargetUser: true,
  allowedRoles: ['super_admin', 'admin', 'seller', 'user']
}));

router.use(attachZohoApi);

router.post('/paymentLinks', createPaymentLink);
router.get('/paymentLinks', getPaymentLinks);
router.get('/paymentLinks/:linkId', getPaymentLinkById);
router.put('/paymentLinks/:linkId', updatePaymentLink);
router.delete('/paymentLinks/:linkId', deletePaymentLink);

module.exports = router;