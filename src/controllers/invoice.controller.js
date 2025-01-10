// src/controllers/invoice.controller.js
const { ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

const getInvoiceSetupData = async (req, res, next) => {
  try {
    const response = await req.zoho.get('/invoices/editpage');
    res.json({
      status: 'success',
      data: response
    });
  } catch (error) {
    next(error);
  }
};

const createInvoice = async (req, res, next) => {
  try {
    // Validate required fields
    const requiredFields = ['customer_id', 'invoice_items'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new ValidationError(`Missing required field: ${field}`);
      }
    }

    // Validate invoice items
    if (!Array.isArray(req.body.invoice_items) || req.body.invoice_items.length === 0) {
      throw new ValidationError('invoice_items must be a non-empty array');
    }

    // Prepare invoice data from request body
    const invoiceData = {
      // Required Customer Info
      customer_id: req.body.customer_id,
      contact_persons: req.body.contact_persons,

      // Dates
      date: req.body.date,
      due_date: req.body.due_date,

      // Payment Terms
      payment_terms: req.body.payment_terms,
      payment_terms_label: req.body.payment_terms_label,

      // Tax and Discount Settings
      is_inclusive_tax: req.body.is_inclusive_tax,
      is_discount_before_tax: req.body.is_discount_before_tax,
      discount: req.body.discount,
      discount_type: req.body.discount_type,

      // Invoice Items
      invoice_items: req.body.invoice_items,

      // Payment Options
      payment_options: req.body.payment_options,
      allow_partial_payments: req.body.allow_partial_payments,

      // Charges and Adjustments
      shipping_charge: req.body.shipping_charge,
      adjustment: req.body.adjustment,
      adjustment_description: req.body.adjustment_description,

      // Notes and Terms
      notes: req.body.notes,
      terms: req.body.terms,

      // Address Information
      billing_address: req.body.billing_address,
      shipping_address: req.body.shipping_address,

      // Template Information
      template_id: req.body.template_id,

      // Custom Fields
      custom_fields: req.body.custom_fields,

      // Additional Fields
      exchange_rate: req.body.exchange_rate,
      reference_number: req.body.reference_number
    };

    // Log the request
    logger.info('Creating new invoice', { 
      customer_id: invoiceData.customer_id,
      template_id: invoiceData.template_id
    });

    const response = await req.zoho.post('/invoices', invoiceData);

    console.log('response:', response);

    // Return the raw response from Zoho
    res.status(201).json(response);

  } catch (error) {
    logger.error('Error creating invoice', { error });
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        code: 1000,
        message: error
      });
    }

    // Pass other errors to error handler middleware
    next(error);
  }
};

const listInvoices = async (req, res, next) => {

  try {
    const {
      organizationId,
      baseURL,
      sort_column = 'created_time',
      sort_order = 'D',
      filter_by = 'Status.All',
      per_page = 50
    } = req.query;


    const response = await req.zoho.get('/invoices', {
        organizationId,
        filter_by,
        sort_column,
        sort_order,
        per_page
    });

    res.json({
      status: 'success',
      data: response
    });
  } catch (error) {
    next(error);
  }
};

// src/controllers/invoice.controller.js
const getAllInvoices = async (req, res, next) => {
  try {
    // Using the get method
    const invoices = await req.zoho.get('/invoices', {
      filter_by: 'Status.All',
      per_page: 50,
      sort_column: 'created_time',
      sort_order: 'D'
    });
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};

const getInvoiceById = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const { accept = 'json' } = req.query;  // Can be json, pdf, or html

    const response = await req.zoho.get(`/invoices/${invoiceId}`, {
      accept
    });

    res.json({
      status: 'success',
      data: response
    });
  } catch (error) {
    next(error);
  }
};

const updateInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const invoiceData = req.body;

    const response = await req.zoho.put(`/invoices/${invoiceId}`, invoiceData);
    res.json({
      status: 'success',
      data: response
    });
  } catch (error) {
    next(error);
  }
};

const deleteInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const response = await req.zoho.delete(`/invoices/${invoiceId}`);
    res.json({
      status: 'success',
      data: response
    });
  } catch (error) {
    next(error);
  }
};

const markInvoiceAsSent = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const response = await req.zoho.post(`/invoices/${invoiceId}/status/sent`);
    res.json({
      status: 'success',
      data: response
    });
  } catch (error) {
    next(error);
  }
};

const emailInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const emailData = {
      send_from_org_email_id: req.body.send_from_org_email_id || false,
      to_mail_ids: req.body.to_mail_ids,
      cc_mail_ids: req.body.cc_mail_ids,
      subject: req.body.subject,
      body: req.body.body
    };
    
    const params = {};
    if (req.query.send_customer_statement) params.send_customer_statement = true;
    if (req.query.send_attachment) params.send_attachment = true;

    const response = await req.zoho.post(`/invoices/${invoiceId}/email`, emailData, params);
    res.json({
      status: 'success',
      data: response
    });
  } catch (error) {
    next(error);
  }
};

const getInvoiceEmailContent = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const response = await req.zoho.get(`/invoices/${invoiceId}/email`);
    res.json({
      status: 'success',
      data: response
    });
  } catch (error) {
    next(error);
  }
};

const updateCustomFields = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const customFields = req.body.map(field => ({
      customfield_id: field.customfield_id,
      value: field.value
    }));
    
    const response = await req.zoho.put(`/invoices/${invoiceId}/customfields`, customFields);
    res.json({
      status: 'success',
      data: response
    });
  } catch (error) {
    next(error);
  }
};

const sendPaymentReminder = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const response = await req.zoho.post(`/invoices/${invoiceId}/paymentreminder`);
    res.json({
      status: 'success',
      data: response
    });
  } catch (error) {
    next(error);
  }
};

const writeOffInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const response = await req.zoho.post(`/invoices/${invoiceId}/writeoff`);
    res.json({
      status: 'success',
      data: response
    });
  } catch (error) {
    next(error);
  }
};

const cancelWriteOff = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const response = await req.zoho.post(`/invoices/${invoiceId}/writeoff/cancel`);
    res.json({
      status: 'success',
      data: response
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvoiceSetupData,
  createInvoice,
  listInvoices,
  getInvoiceById,
  updateInvoice,
  getAllInvoices,
  deleteInvoice,
  markInvoiceAsSent,
  emailInvoice,
  getInvoiceEmailContent,
  updateCustomFields,
  sendPaymentReminder,
  writeOffInvoice,
  cancelWriteOff
};
