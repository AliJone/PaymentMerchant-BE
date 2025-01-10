require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const routes = require('./routes/index.routes');
const app = express();

// Middleware
app.use(helmet());
app.use(morgan('combined', { stream: logger.stream }));
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.mongodb.connected())
  .catch(err => logger.mongodb.error(err));

mongoose.connection.on('disconnected', () => logger.mongodb.disconnected());

const port = process.env.PORT || 8187;
const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.process.unhandledRejection(err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.process.uncaughtException(err);
  server.close(() => process.exit(1));
});

module.exports = app;