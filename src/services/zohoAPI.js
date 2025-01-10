// src/services/zohoAPI.js
const axios = require('axios');
const https = require('https');
const { ZOHO_CONFIG } = require('../config/constants');

const createZohoAPI = (zohoToken, baseURL = ZOHO_CONFIG.API_BASE_URL) => {
  return axios.create({
    baseURL,
    headers: {
      'Authorization': `Zoho-oauthtoken ${zohoToken}`,
      'X-com-zoho-invoice-organizationid': ZOHO_CONFIG.ORG_ID,
      'Content-Type': 'application/json'
    },
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });
};

// Example usage in controller:
/*
const makeZohoRequest = async (req, endpoint, method = 'get', data = null) => {
  const zohoAPI = createZohoAPI(req.user.zohoToken);
  
  try {
    const response = await zohoAPI({
      method,
      url: endpoint,
      data
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
*/

module.exports = { createZohoAPI };

// Usage examples:
/*
// For invoices
const invoiceResponse = await makeZohoRequest(req, '/invoices', 'post', invoiceData);

// For books
const booksResponse = await makeZohoRequest(req, '/books/endpoint', 'get');

// For CRM
const crmResponse = await makeZohoRequest(req, '/crm/endpoint', 'put', crmData);
*/