// src/models/paymentMerchant.model.js
const mongoose = require('mongoose');

const paymentMerchantSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  merchantType: {
    type: String,
    required: true
  },
  feePercentage: {
    type: Number,
    required: true
  },
  monthlyPayouts: {
    type: Number,
    required: true
  },
  payoutDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PaymentMerchant', paymentMerchantSchema);