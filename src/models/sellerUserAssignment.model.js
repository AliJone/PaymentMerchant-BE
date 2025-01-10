const mongoose = require('mongoose');

const sellerUserAssignmentSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add index for faster lookups
sellerUserAssignmentSchema.index({ sellerId: 1, assignedUserId: 1 }, { unique: true });

module.exports = mongoose.model('SellerUserAssignment', sellerUserAssignmentSchema);