// src/models/sellerRequestDocument.model.js
const mongoose = require('mongoose');

const sellerRequestDocumentSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SellerRequest',
    required: true
  },
  documentType: {
    type: String,
    required: true
  },
  documentUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SellerRequestDocument', sellerRequestDocumentSchema);