const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findByPk(decoded.id);

      if (!req.user) {
        return ApiResponse.error(res, 'Not authorized, user not found', 401);
      }
      
      if (!req.user.isActive) {
        return ApiResponse.error(res, 'Not authorized, account is disabled', 401);
      }

      next();
    } catch (error) {
      return ApiResponse.error(res, 'Not authorized, token failed', 401);
    }
  }

  if (!token) {
    return ApiResponse.error(res, 'Not authorized, no token provided', 401);
  }
};

module.exports = { protect };
