require('dotenv').config();

const ZOHO_CONFIG = {
  CLIENT_ID: process.env.ZOHO_CLIENT_ID,
  CLIENT_SECRET: process.env.ZOHO_CLIENT_SECRET,
  TOKEN_URL: process.env.ZOHO_TOKEN_URL,
  REDIRECT_URI: process.env.ZOHO_REDIRECT_URI,
  API_BASE_URL: process.env.ZOHO_API_BASE_URL,
  ORG_ID: process.env.ZOHO_ORG_ID,
  SCOPE: process.env.ZOHO_SCOPES
};
// Add configuration validation
const validateConfig = () => {
    const requiredEnvVars = [
      'ZOHO_CLIENT_ID',
      'ZOHO_CLIENT_SECRET',
      'ZOHO_TOKEN_URL',
      'ZOHO_REDIRECT_URI',
      'ZOHO_API_BASE_URL',
      'ZOHO_ORG_ID',
      'ZOHO_SCOPES'
    ];
  
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
    if (missingEnvVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(', ')}`
      );
    }
  };
  
  // Run validation when the config is imported
  validateConfig();
  
  module.exports = { ZOHO_CONFIG };