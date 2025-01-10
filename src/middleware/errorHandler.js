// src/middleware/errorHandler.js
const logger = require('../utils/logger');
const { BaseError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      errors: err.errors
    });
  }

  res.status(500).json({
    status: err.status || 'error',
    message: err.message || 'Internal Server Error',
    details: err.details || {}
  });
};

module.exports = { errorHandler };