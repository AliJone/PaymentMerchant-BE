class BaseError extends Error {
    constructor(message, statusCode = 500, errors = []) {
      super(message);
      this.statusCode = statusCode;
      this.errors = errors;
    }
  }
  
  class ValidationError extends BaseError {
    constructor(message, errors = []) {
      super(message, 400, errors);
    }
  }

  class ForbiddenError extends BaseError {
    constructor(message = 'Access forbidden') {
      super(message, 403);
    }
  }
  
  class UnauthorizedError extends BaseError {
    constructor(message) {
      super(message, 401);
    }
  }
  
  class NotFoundError extends BaseError {
    constructor(message) {
      super(message, 404);
    }
  }
  
  module.exports = {
    BaseError,
    ValidationError,
    UnauthorizedError,
    NotFoundError,
    ForbiddenError
  };