const { validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors from `express-validator`.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {Function} next - Callback to pass control to the next middleware.
 */
const validateRequest = (req, res, next) => {
  // Retrieve validation errors from the request
  const errors = validationResult(req);

  // If validation errors exist, return a 400 response with error details
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      code: "400",
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  // Proceed to the next middleware if no errors
  next();
};

module.exports = validateRequest;
