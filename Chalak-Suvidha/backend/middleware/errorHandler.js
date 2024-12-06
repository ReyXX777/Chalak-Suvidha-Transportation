/**
 * Express error-handling middleware.
 * Logs errors and sends a standardized error response.
 * @param {Object} err - Error object.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {Function} next - Callback to pass control to the next middleware.
 */
const errorHandler = (err, req, res, next) => {
    // Log the full error stack trace for debugging
    console.error('Error Stack:', err.stack);
  
    // Default to 500 if no specific status code is provided
    const statusCode = err.statusCode || 500;
  
    // Respond with a standardized error message
    res.status(statusCode).json({
      error: true,
      code: statusCode,
      message: err.message || 'Internal Server Error',
    });
  };
  
  module.exports = errorHandler;
  