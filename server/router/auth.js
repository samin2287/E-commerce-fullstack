const express = require("express");
const {
  signupUser,
  verifyOtp,
  resendOtp,
  signInUser,
} = require("../controllers/authController");
const route = express.Router();
route.post("/signup", signupUser);
route.post("/verifyotp", verifyOtp);
route.post("/resendotp", resendOtp);
route.post("/login", signInUser);
module.exports = route;
