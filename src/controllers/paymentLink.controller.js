// src/controllers/paymentLink.controller.js
const { ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

// Configuration for the payment links API
const PAYMENT_API_CONFIG = {
  BASE_URL: 'https://books.zoho.com/api/v3'
};

const createPaymentLink = async (req, res, next) => {
  try {
    // Validate required fields
    const requiredFields = ['customer_id', 'payment_amount', 'description'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new ValidationError(`Missing required field: ${field}`);
      }
    }

    const paymentLinkData = {
      customer_id: req.body.customer_id,
      payment_amount: req.body.payment_amount,
      description: req.body.description,
      expiry_time: req.body.expiry_time,
      custom_fields: req.body.custom_fields || []
    };

    logger.info('Creating new payment link', { 
      customer_id: paymentLinkData.customer_id,
      amount: paymentLinkData.payment_amount
    });

    // Use a different base URL for this specific API
    const response = await req.zoho.post('/paymentlinks', paymentLinkData, {
      baseURL: PAYMENT_API_CONFIG.BASE_URL
    });

    res.status(201).json(response);

  } catch (error) {
    logger.error('Error creating payment link', { error });
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        code: 1000,
        message: error.message
      });
    }
    next(error);
  }
};

const getPaymentLinks = async (req, res, next) => {
  try {
    const response = await req.zoho.get('/paymentlinks', {
      baseURL: PAYMENT_API_CONFIG.BASE_URL
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getPaymentLinkById = async (req, res, next) => {
  try {
    const { linkId } = req.params;
    const response = await req.zoho.get(`/paymentlinks/${linkId}`, {
      baseURL: PAYMENT_API_CONFIG.BASE_URL
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const updatePaymentLink = async (req, res, next) => {
  try {
    const { linkId } = req.params;
    const updateData = {
      description: req.body.description,
      expiry_time: req.body.expiry_time,
      custom_fields: req.body.custom_fields
    };

    const response = await req.zoho.put(`/paymentlinks/${linkId}`, updateData, {
      baseURL: PAYMENT_API_CONFIG.BASE_URL
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const deletePaymentLink = async (req, res, next) => {
  try {
    const { linkId } = req.params;
    const response = await req.zoho.delete(`/paymentlinks/${linkId}`, {
      baseURL: PAYMENT_API_CONFIG.BASE_URL
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentLink,
  getPaymentLinks,
  getPaymentLinkById,
  updatePaymentLink,
  deletePaymentLink
};