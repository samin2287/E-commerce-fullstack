const express = require("express");
const multer = require("multer");
const upload = multer();
const {
  signupUser,
  verifyOtp,
  resendOtp,
  signInUser,
  forgatePass,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  refreshAccessToken,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const route = express.Router();
route.post("/signup", signupUser);
route.post("/verifyotp", verifyOtp);
route.post("/resendotp", resendOtp);
route.post("/login", signInUser);
route.post("/forgatepass", forgatePass);
route.post("/resetpass/:token", resetPassword);
route.get("/profile", authMiddleware, getUserProfile);
route.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  updateUserProfile,
);
route.post("/refreshToken", refreshAccessToken);
module.exports = route;
