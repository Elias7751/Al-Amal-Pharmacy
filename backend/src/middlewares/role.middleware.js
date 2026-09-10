const ApiResponse = require('../utils/apiResponse');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 'Not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        `User role ${req.user.role} is not authorized to access this route`,
        403
      );
    }
    
    next();
  };
};

module.exports = { authorize };
