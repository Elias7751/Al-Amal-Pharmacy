const ApiResponse = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('[Error]:', err);

  const statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    message = err.errors.map(e => e.message).join(', ');
    return ApiResponse.error(res, message, 400);
  }

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    message = err.errors.map(e => e.message).join(', ');
    return ApiResponse.error(res, message, 400);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 'Invalid token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 'Token expired. Please log in again.', 401);
  }

  // In production, don't leak stack traces
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong on the server';
  }

  return ApiResponse.error(res, message, statusCode);
};

module.exports = errorHandler;