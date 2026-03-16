const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const roleCheckMiddleware = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }

    throw new ApiError(403, "Invalid Request");
  });
};

module.exports = roleCheckMiddleware;
