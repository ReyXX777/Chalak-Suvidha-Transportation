const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes by verifying the JWT token.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {Function} next - Callback to pass control to the next middleware.
 */
const protect = (req, res, next) => {
  let token;

  // Check for the Authorization header with a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user information to the request object
      req.user = decoded.user;

      return next(); // Proceed to the next middleware
    } catch (error) {
      // Respond with a 401 error if the token is invalid or verification fails
      return res.status(401).json({
        error: true,
        code: "401",
        message: 'Not authorized, invalid token'
      });
    }
  }

  // Respond with a 401 error if no token is provided
  if (!token) {
    return res.status(401).json({
      error: true,
      code: "401",
      message: 'Not authorized, no token provided'
    });
  }
};

module.exports = { protect };
