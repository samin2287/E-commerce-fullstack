const roleCheckMiddleware = (...roles) => {
  return (req, res, next) => {
    try {
      if (roles.includes(req.user.role)) {
        return next();
      }
      res.status(400).send("Invalid Request");
    } catch (error) {
      console.log(error);

      res.status(400).send("Invalid Request");
    }
  };
};
module.exports = roleCheckMiddleware;
