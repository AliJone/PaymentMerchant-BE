// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');
const { refreshZohoToken } = require('../utils/zohoAuth');

const auth = async (req, res, next) => {
  try {
    // Check JWT token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('token:', token);
    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if Zoho token exists and is valid
    if (!req.user.zohoToken || !req.user.zohoTokenExpiry) {
      throw new UnauthorizedError('Zoho authentication required');
    }

    // Check if Zoho token is about to expire (less than 5 minutes remaining)
    const now = Date.now();
    const expiryTime = new Date(req.user.zohoTokenExpiry).getTime();
    const fiveMinutes = 5 * 60 * 1000;

    if (expiryTime - now < fiveMinutes) {
      // Refresh token
      const newZohoToken = await refreshZohoToken(req.user.zohoRefreshToken);
      
      // Update token in user session/request
      req.user.zohoToken = newZohoToken.access_token;
      req.user.zohoTokenExpiry = new Date(Date.now() + (newZohoToken.expires_in * 1000));
      
      // Add flag to indicate token was refreshed
      req.tokenRefreshed = true;
    }

    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
};

module.exports = auth;