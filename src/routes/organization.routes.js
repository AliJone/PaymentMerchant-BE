// src/routes/organization.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization
} = require('../controllers/organization.controller');

router.post('/', auth, createOrganization);
router.get('/', auth, getOrganizations);
router.get('/:id', auth, getOrganizationById);
router.put('/:id', auth, updateOrganization);

module.exports = router;