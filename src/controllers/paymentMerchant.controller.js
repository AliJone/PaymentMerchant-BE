// src/controllers/paymentMerchant.controller.js
const PaymentMerchant = require('../models/paymentMerchant.model');
const MerchantSetting = require('../models/merchantSetting.model');
const { NotFoundError } = require('../utils/errors');

const createPaymentMerchant = async (req, res, next) => {
  try {
    const merchant = new PaymentMerchant(req.body);
    await merchant.save();

    // Create settings if provided
    if (req.body.settings) {
      const settings = req.body.settings.map(setting => ({
        merchantId: merchant._id,
        ...setting
      }));
      await MerchantSetting.insertMany(settings);
    }

    res.status(201).json({
      status: 'success',
      data: merchant
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentMerchants = async (req, res, next) => {
  try {
    const merchants = await PaymentMerchant.find({ isActive: true })
      .populate('organizationId');
    res.json({
      status: 'success',
      data: merchants
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentMerchant,
  getPaymentMerchants
};