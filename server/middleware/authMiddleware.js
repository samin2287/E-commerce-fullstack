const { verifyToken } = require("../services/helpers");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies;
    console.log(token["X-AS-Token"]);
    if (!token["X-AS-Token"]) {
      return res.status(401).send({ message: "Invalid Request!" });
    }

    const decoded = verifyToken(token["X-AS-Token"]);
    if (!decoded) {
      return res.status(401).send({ message: "Invalid Request!" });
    }
    console.log("DECODED TOKEN:", decoded);
    req.user = decoded.data;
    console.log("REQ.USER:", req.user);
    next();
  } catch (error) {
    console.log(error);
    return responseHandler.error(res, 401, "Invalid Request");
  }
};
module.exports = authMiddleware;
