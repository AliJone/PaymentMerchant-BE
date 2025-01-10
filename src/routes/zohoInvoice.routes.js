const express = require('express');
const router = express.Router();
const axios = require('axios');
const https = require('https');
const { getAccessToken, setTokens } = require('../utils/zohoAuth');

const CLIENT_ID = '1000.G6UARG8IFIN49ZHEBICTQGVO2KU6TI';
const CLIENT_SECRET = '33a7d6bede7dd757fffc9e5e8192387213ff81e8e7';
const TOKEN_URL = 'https://accounts.zoho.com/oauth/v2/token';
const REDIRECT_URI = 'http://localhost:3002/zoho-invoice';
const ZOHO_INVOICE_API_BASE_URL = 'https://www.zohoapis.com/invoice/v3';
const ZOHO_INVOICE_ORG_ID = '872339474'; // Replace with your org ID

const getZohoInvoiceAPI = async () => {
  try {
    const accessToken = await getAccessToken();
    console.log('Using access token:', accessToken);
    
    if (!accessToken) {
      throw new Error('No access token available');
    }

    return axios.create({
      baseURL: ZOHO_INVOICE_API_BASE_URL,
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'X-com-zoho-invoice-organizationid': ZOHO_INVOICE_ORG_ID,
        'Content-Type': 'application/json'
      },
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });
  } catch (error) {
    console.error('Error in getZohoInvoiceAPI:', error);
    throw error;
  }
};


// Invoice routes
router.post('/invoices', async (req, res) => {
  try {
    const zohoInvoiceAPI = await getZohoInvoiceAPI();
    const invoiceData = req.body;
    const response = await zohoInvoiceAPI.post('/invoices', invoiceData);
    console.log(response);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/invoices', async (req, res) => {
  try {
    const zohoInvoiceAPI = await getZohoInvoiceAPI();
    const invoiceData = req.body;
    const response = await zohoInvoiceAPI.get('/invoices', invoiceData);
    console.log(response);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/invoices/:invoiceId/email', async (req, res) => {
  try {
    const zohoInvoiceAPI = await getZohoInvoiceAPI();
    const invoiceId = req.params.invoiceId;
    const emailData = req.body;
    const response = await zohoInvoiceAPI.post(
      `/invoices/${invoiceId}/email`,
      emailData
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/invoices/:invoiceId', async (req, res) => {
  try {
    const zohoInvoiceAPI = await getZohoInvoiceAPI();
    const invoiceId = req.params.invoiceId;
    const invoiceData = req.body;
    const response = await zohoInvoiceAPI.put(
      `/invoices/${invoiceId}`, 
      invoiceData
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/invoices/:invoiceId', async (req, res) => {
  try {
    const zohoInvoiceAPI = await getZohoInvoiceAPI();
    const invoiceId = req.params.invoiceId;
    const response = await zohoInvoiceAPI.get(`/invoices/${invoiceId}`);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/customerpayments', async (req, res) => {
  try {
    const zohoInvoiceAPI = await getZohoInvoiceAPI();
    const paymentData = req.body;
    const response = await zohoInvoiceAPI.post(
      '/customerpayments',
      paymentData
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;