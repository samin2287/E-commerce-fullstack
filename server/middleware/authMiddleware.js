const { verifyToken } = require("../services/helpers");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies;
  const accessToken = token["X-AS-Token"];
  if (!accessToken) {
    throw new ApiError(401, "Invalid Request!");
  }
  const decoded = verifyToken(accessToken);
  if (!decoded) {
    throw new ApiError(401, "Invalid Request!");
  }
  req.user = decoded;
  next();
});
module.exports = authMiddleware;
