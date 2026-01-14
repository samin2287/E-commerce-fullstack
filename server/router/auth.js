const express = require("express");
const {
  signupUser,
  resendOtp,
  signInUser,
  forgatePass,
  resetPassword,
} = require("../controllers/authController");
const { verifyOtp } = require("../controllers/authController");
const route = express.Router();
route.post("/signup", signupUser);
route.post("/verifyOtp", verifyOtp);
route.post("/resendOtp", resendOtp);
route.post("/signin", signInUser);
route.post("/forgatepass", forgatePass);
route.post("/resetpassword", resetPassword);

module.exports = route;
