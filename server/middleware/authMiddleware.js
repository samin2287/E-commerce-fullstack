const { verifyToken } = require("../services/helpers");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const authMiddleware = asyncHandler(async (req, res, next) => {
  let accessToken = req.cookies?.["X-AS-Token"];
  if (!accessToken) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.slice(7);
    }
  }
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
