const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userId: req.user?.userId || 'anonymous'
  });

  // Default error
  let error = {
    success: false,
    message: 'Internal server error'
  };

  // Validation error
  if (err.name === 'ValidationError') {
    error.message = 'Validation failed';
    error.details = Object.values(err.errors).map(val => val.message);
    return res.status(400).json(error);
  }

  // Duplicate key error (MySQL)
  if (err.code === 'ER_DUP_ENTRY') {
    error.message = 'Duplicate entry found';
    return res.status(409).json(error);
  }

  // Foreign key constraint error (MySQL)
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    error.message = 'Referenced record does not exist';
    return res.status(400).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token has expired';
    return res.status(401).json(error);
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error.message = 'File size too large';
    return res.status(413).json(error);
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    error.message = 'Too many files';
    return res.status(413).json(error);
  }

  // Database connection errors
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    error.message = 'Database connection lost';
    return res.status(503).json(error);
  }

  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    error.message = 'Database access denied';
    return res.status(503).json(error);
  }

  // Syntax errors
  if (err.type === 'entity.parse.failed') {
    error.message = 'Invalid JSON format';
    return res.status(400).json(error);
  }

  // Rate limiting error
  if (err.status === 429) {
    error.message = 'Too many requests, please try again later';
    return res.status(429).json(error);
  }

  // Custom application errors
  if (err.status && err.message) {
    error.message = err.message;
    return res.status(err.status).json(error);
  }

  // Send generic error for anything else
  res.status(500).json(error);
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};