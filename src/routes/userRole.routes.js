// src/routes/userRole.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  assignRole,
  getUserRoles
} = require('../controllers/userRole.controller');

router.post('/users/:userId/roles', auth, assignRole);
router.get('/users/:userId/roles', auth, getUserRoles);

module.exports = router;