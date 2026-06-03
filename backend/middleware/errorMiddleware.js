/**
 * Global Error Handler Middleware
 * Catches all errors passed via next(error) and returns formatted JSON responses
 * Must be the LAST middleware registered in app.js
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error details in development mode
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    error.message = `Resource not found with id: ${err.value}`;
    error.statusCode = 400;
  }

  // Handle Mongoose Duplicate Key Error (e.g., duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please use a different ${field}.`;
    error.statusCode = 400;
  }

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error.message = messages.join(', ');
    error.statusCode = 400;
  }

  // Handle JWT Invalid Token
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please login again.';
    error.statusCode = 401;
  }

  // Handle JWT Expired Token
  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired. Please login again.';
    error.statusCode = 401;
  }

  // Send formatted error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 Not Found Handler
 * Catches requests to undefined routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
