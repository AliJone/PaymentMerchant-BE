const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const attachZohoApi = require('../middleware/zohoApi');
const { createCustomer, listCustomers, getCustomerById, updateCustomer, deleteCustomer, markCustomerAsActive, markCustomerAsInactive, getCustomerTransactions } = require('../controllers/customer.controller');

router.use(auth);
router.use(attachZohoApi);

router.post('/customers/', createCustomer);
router.get('/customers/', listCustomers);
router.get('/customers/:customerId', getCustomerById);
router.put('/customers/:customerId', updateCustomer);
router.delete('/customers/:customerId', deleteCustomer);

router.post('/customers/:customerId/markasactive', markCustomerAsActive);
router.post('/customers/:customerId/markasinactive', markCustomerAsInactive);
router.get('/customers/:customerId/transactions', getCustomerTransactions);

module.exports = router;