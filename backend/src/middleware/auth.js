const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Authentication disabled - using default user
  req.userId = 1; // Default user ID
  next();
};

module.exports = authMiddleware;

