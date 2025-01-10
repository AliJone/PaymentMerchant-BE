// src/controllers/customer.controller.js
const { ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

const createCustomer = async (req, res, next) => {
  try {
    // Validate required fields
    const requiredFields = ['display_name', 'email'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new ValidationError(`Missing required field: ${field}`);
      }
    }

    // Prepare customer data
    const customerData = {
      display_name: req.body.display_name,
      salutation: req.body.salutation,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      company_name: req.body.company_name,
      phone: req.body.phone,
      mobile: req.body.mobile,
      website: req.body.website,
      department: req.body.department,
      designation: req.body.designation,

      billing_address: req.body.billing_address,
      shipping_address: req.body.shipping_address,

      currency_code: req.body.currency_code,
      payment_terms: req.body.payment_terms,
      payment_terms_label: req.body.payment_terms_label,

      notes: req.body.notes,
      custom_fields: req.body.custom_fields,

      gst_treatment: req.body.gst_treatment,
      tax_treatment: req.body.tax_treatment,
      tax_regime: req.body.tax_regime,
      place_of_contact: req.body.place_of_contact,
      
      is_portal_enabled: req.body.is_portal_enabled,
      tags: req.body.tags,
    };

    logger.info('Creating new customer', { 
      email: customerData.email,
      company: customerData.company_name 
    });

    const response = await req.zoho.post('/customers', customerData);
    res.status(201).json(response);

  } catch (error) {
    logger.error('Error creating customer', { error });
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        code: 1000,
        message: error.message
      });
    }
    next(error);
  }
};

const listCustomers = async (req, res, next) => {
  try {
    const {
      filter_by = 'Status.All',
      sort_column,
      search_text,
      status,
      ...otherParams
    } = req.query;

    const response = await req.zoho.get('/customers', {
      filter_by,
      sort_column,
      search_text,
      status,
      ...otherParams
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const response = await req.zoho.get(`/customers/${customerId}`);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const customerData = req.body;

    const response = await req.zoho.put(`/customers/${customerId}`, customerData);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const response = await req.zoho.delete(`/customers/${customerId}`);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const markCustomerAsActive = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const response = await req.zoho.post(`/customers/${customerId}/markasactive`);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const markCustomerAsInactive = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const response = await req.zoho.post(`/customers/${customerId}/markasinactive`);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCustomerTransactions = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { filter_by } = req.query;

    const response = await req.zoho.get('/transactions', {
      customer_id: customerId,
      filter_by
    });
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCustomer,
  listCustomers, 
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  markCustomerAsActive,
  markCustomerAsInactive,
  getCustomerTransactions
};