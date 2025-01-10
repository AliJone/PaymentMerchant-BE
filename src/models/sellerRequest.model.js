// src/models/sellerRequest.model.js
const mongoose = require('mongoose');

const sellerRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  merchantFee: {
    type: Number,
    required: true
  },
  numPayouts: {
    type: Number,
    required: true
  },
  payoutDate: {
    type: Date,
    required: true
  },
  numMerchants: {
    type: Number,
    required: true
  },
  merchantType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SellerRequest', sellerRequestSchema);