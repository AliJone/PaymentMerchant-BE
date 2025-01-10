// src/utils/logger.js
const winston = require('winston');
const path = require('path');

// Custom format for error handling
const errorFormat = winston.format((info) => {
  if (info.message instanceof Error) {
    // Capture the full error info
    info.message = {
      message: info.message.message,
      stack: info.message.stack,
      ...info.message
    };
  }
  if (info instanceof Error) {
    info = {
      message: info.message,
      stack: info.stack,
      ...info
    };
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    errorFormat(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join('logs', 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  exitOnError: false
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Morgan stream
logger.stream = {
  write: (message) => logger.info(message.trim())
};

// MongoDB specific logging helpers
logger.mongodb = {
  connected: () => logger.info('Connected to MongoDB'),
  error: (err) => logger.error('MongoDB connection error:', err),
  disconnected: () => logger.warn('Disconnected from MongoDB')
};

// Process error logging helpers
logger.process = {
  unhandledRejection: (err) => logger.error('Unhandled Promise Rejection:', err),
  uncaughtException: (err) => logger.error('Uncaught Exception:', err)
};

module.exports = logger;