// src/utils/zohoApi.js
const axios = require('axios');
const https = require('https');
const { ZOHO_CONFIG } = require('../config/constants');

class ZohoApiWrapper {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: ZOHO_CONFIG.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });
  }

  setToken(token) {
    this.axiosInstance.defaults.headers['Authorization'] = `Zoho-oauthtoken ${token}`;
  }

  async get(endpoint, params = {}) {
    try {
      const { organizationId, baseURL, ...queryParams } = params;

      let finalBaseURL= ZOHO_CONFIG.API_BASE_URL
      if (baseURL) {
        finalBaseURL = baseURL;
      }

      console.log('finalBaseURL:', finalBaseURL);

      console.log('organizationId:', organizationId || 860019360);
      const response = await this.axiosInstance.get(endpoint, { 
        params: queryParams,
        headers: {
          'X-com-zoho-subscriptions-organizationid': organizationId || 860019360
        },
        baseURL: finalBaseURL
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async post(endpoint, data = {}) {
    try {
      const { organizationId, ...postData } = data;
      const response = await this.axiosInstance.post(endpoint, postData, {
        headers: {
          'X-com-zoho-subscriptions-organizationid': organizationId || 860019360
        }
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async put(endpoint, data = {}) {
    try {
      const { organizationId, ...putData } = data;
      const response = await this.axiosInstance.put(endpoint, putData, {
        headers: {
          'X-com-zoho-subscriptions-organizationid': organizationId || 860019360
        }
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async delete(endpoint, data = {}) {
    try {
      const { organizationId, ...deleteParams } = data;
      const response = await this.axiosInstance.delete(endpoint, {
        params: deleteParams,
        headers: {
          'X-com-zoho-subscriptions-organizationid': organizationId || 860019360
        }
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  _handleError(error) {
    if (error.response) {
      // Special handling for organization-related errors
      if (error.response.status === 400 && error.response.data?.details?.code === 6024) {
        return {
          status: 400,
          message: 'Organization ID is required',
          details: {
            code: 6024,
            organizations: error.response.data.details.error_info,
            message: error.response.data.details.message
          }
        };
      }
      return {
        status: error.response.status,
        message: error.response.data.message || 'Zoho API error',
        details: error.response.data
      };
    }
    return {
      status: 500,
      message: error.message,
      details: error
    };
  }
}

// Create a single instance
const zohoApiWrapper = new ZohoApiWrapper();

module.exports = zohoApiWrapper;