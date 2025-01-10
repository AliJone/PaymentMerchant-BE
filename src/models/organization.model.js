// src/models/organization.model.js
const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  zohoOrgId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Organization', organizationSchema);
