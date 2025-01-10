// src/models/merchantSetting.model.js
const mongoose = require('mongoose');

const merchantSettingSchema = new mongoose.Schema({
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMerchant',
    required: true
  },
  settingKey: {
    type: String,
    required: true
  },
  settingValue: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MerchantSetting', merchantSettingSchema);