// src/middleware/zoho.js
const { createZohoAPI } = require('../services/zohoAPI');

const attachZohoAPI = (req, res, next) => {
  // Create a helper function for making Zoho API requests
  req.zoho = async (endpoint, method = 'get', data = null) => {
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

  next();
};

module.exports = { attachZohoAPI };