const express = require("express");
const {
  signupUser,
  verifyOtp,
  resendOtp,
  signInUser,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const route = express.Router();
route.post("/signup", signupUser);
route.post("/verifyotp", verifyOtp);
route.post("/resendotp", resendOtp);
route.post("/login", signInUser);
route.get("/check-auth", authMiddleware, (req, res) => {
  res.send({
    message: "Middleware working ✅",
    user: req.user,
  });
});
module.exports = route;
