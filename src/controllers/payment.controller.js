// src/controllers/payment.controller.js
const { ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

const createPayment = async (req, res, next) => {
  try {
    const requiredFields = ['customer_id', 'payment_mode', 'amount'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new ValidationError(`Missing required field: ${field}`);
      }
    }

    const paymentData = {
      customer_id: req.body.customer_id,
      payment_mode: req.body.payment_mode,
      amount: req.body.amount,
      date: req.body.date,
      reference_number: req.body.reference_number,
      description: req.body.description,
      invoices: req.body.invoices,
      exchange_rate: req.body.exchange_rate || 1,
      bank_charges: req.body.bank_charges,
      tax_account_id: req.body.tax_account_id,
      account_id: req.body.account_id,
      custom_fields: req.body.custom_fields
    };

    logger.info('Creating new payment', {
      customer_id: paymentData.customer_id,
      amount: paymentData.amount
    });

    const response = await req.zoho.post('/payments', paymentData);
    res.status(201).json(response);

  } catch (error) {
    logger.error('Error creating payment', { error });
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        code: 1000,
        message: error.message
      });
    }
    next(error);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const requiredFields = ['customer_id', 'payment_mode', 'amount', 'invoices'];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new ValidationError(`Missing required field: ${field}`);
      }
    }

    const paymentData = {
      customer_id: req.body.customer_id,
      payment_mode: req.body.payment_mode,
      amount: req.body.amount,
      date: req.body.date,
      reference_number: req.body.reference_number,
      description: req.body.description,
      invoices: req.body.invoices,
      exchange_rate: req.body.exchange_rate,
      bank_charges: req.body.bank_charges,
      tax_account_id: req.body.tax_account_id,
      account_id: req.body.account_id,
      custom_fields: req.body.custom_fields
    };

    logger.info('Updating payment', { 
      payment_id: paymentId,
      amount: paymentData.amount 
    });

    const response = await req.zoho.put(`/payments/${paymentId}`, paymentData);
    res.json(response);

  } catch (error) {
    logger.error('Error updating payment', { error });

    if (error instanceof ValidationError) {
      return res.status(400).json({
        code: 1000,
        message: error.message
      });
    }
    next(error);
  }
};

const getPaymentById = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const response = await req.zoho.get(`/payments/${paymentId}`);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const response = await req.zoho.delete(`/payments/${paymentId}`);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  updatePayment,
  getPaymentById,
  deletePayment
};