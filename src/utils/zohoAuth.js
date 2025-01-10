// src/utils/zohoAuth.js
const axios = require('axios');
const https = require('https');
const { ZOHO_CONFIG } = require('../config/constants');

const getAccessToken = async () => {
  try {
    console.log('Attempting to get new access token...');
    
    const response = await axios.post(ZOHO_CONFIG.TOKEN_URL, null, {
      params: {
        client_id: ZOHO_CONFIG.CLIENT_ID,
        client_secret: ZOHO_CONFIG.CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: ZOHO_CONFIG.SCOPE,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });
    
    if (!response.data.access_token) {
      throw new Error('No access token in response');
    }

    return {
      access_token: response.data.access_token,
      expires_in: response.data.expires_in || 3600,
      refresh_token: response.data.refresh_token
    };
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
  }
};

const refreshZohoToken = async (refreshToken) => {
  try {
    const response = await axios.post(ZOHO_CONFIG.TOKEN_URL, null, {
      params: {
        client_id: ZOHO_CONFIG.CLIENT_ID,
        client_secret: ZOHO_CONFIG.CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });

    return {
      access_token: response.data.access_token,
      expires_in: response.data.expires_in || 3600
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

module.exports = { 
  getAccessToken,
  refreshZohoToken
};