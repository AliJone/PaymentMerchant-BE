// src/middleware/zohoApi.js
const zohoApiWrapper = require('../utils/zohoApi');

const attachZohoApi = (req, res, next) => {
  if (!req.user || !req.user.zohoToken) {
    return next(new Error('No Zoho token available'));
  }

  // Just update the token
  zohoApiWrapper.setToken(req.user.zohoToken);
  
  // Attach the singleton instance
  req.zoho = zohoApiWrapper;
  next();
};

module.exports = attachZohoApi;