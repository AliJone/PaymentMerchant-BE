const mongoose = require('mongoose');

const adminSellerAssignmentSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
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

adminSellerAssignmentSchema.index({ adminId: 1, sellerId: 1 }, { unique: true });

module.exports = mongoose.model('AdminSellerAssignment', adminSellerAssignmentSchema);