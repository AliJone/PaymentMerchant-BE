// src/controllers/seller.controller.js
const SellerRequest = require('../models/sellerRequest.model');
const SellerRequestDocument = require('../models/sellerRequestDocument.model');
const SellerEarning = require('../models/sellerEarning.model');
const { NotFoundError } = require('../utils/errors');

const createSellerRequest = async (req, res, next) => {
  try {
    const sellerRequest = new SellerRequest({
      ...req.body,
      userId: req.user.userId
    });
    await sellerRequest.save();

    // Handle document uploads if any
    if (req.body.documents) {
      const documents = req.body.documents.map(doc => ({
        requestId: sellerRequest._id,
        ...doc
      }));
      await SellerRequestDocument.insertMany(documents);
    }

    res.status(201).json({
      status: 'success',
      data: sellerRequest
    });
  } catch (error) {
    next(error);
  }
};

const approveSellerRequest = async (req, res, next) => {
  try {
    const request = await SellerRequest.findById(req.params.id);
    if (!request) {
      throw new NotFoundError('Seller request not found');
    }

    request.status = 'approved';
    request.approvedBy = req.user.userId;
    await request.save();

    res.json({
      status: 'success',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

const getSellerEarnings = async (req, res, next) => {
  try {
    const earnings = await SellerEarning.find({ userId: req.user.userId })
      .populate('merchantId');
    res.json({
      status: 'success',
      data: earnings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSellerRequest,
  approveSellerRequest,
  getSellerEarnings
};
