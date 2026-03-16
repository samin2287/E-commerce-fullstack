const { sendEmail } = require("../services/emailServices");
const {
  generateOTP,
  generateAccessToken,
  generateRefreshToken,
  generateResetPassToken,
  hashResetToken,
  verifyToken,
} = require("../services/helpers");
const { isValidEmail, isPasswordValid } = require("../services/validation");
const userSchema = require("../models/userSchema");
const { otpVerificationTemplate } = require("../templates/verifyEmailTemplate");
const {
  resetPasswordTemplate,
} = require("../templates/resetPasswordEmailTemplate");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../services/cloudinaryService");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const successRes = require("../services/responseHandler");

const signupUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, address, phone } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Email is invalid");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }
  if (!isPasswordValid(password)) {
    throw new ApiError(400, "Password must be at least 6 characters long.");
  }
  const existingUser = await userSchema.findOne({ email });
  if (existingUser) throw new ApiError(400, "Email is already registered");
  const generatedOtp = generateOTP();
  const user = new userSchema({
    fullName,
    email,
    password,
    address,
    phone,
    otp: generatedOtp,
    otpExpires: Date.now() + 2 * 60 * 1000,
  });

  await sendEmail({
    email,
    subject: "Verify your email",
    html: otpVerificationTemplate({
      fullName,
      otp: generatedOtp,
      appName: "E-Commerce",
      supportEmail: "support@ecommerce.com",
    }),
  });

  await user.save();
  successRes(
    res,
    201,
    "User registered successfully.Please Verify your email",
    true,
  );
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await userSchema.findOne({
    email,
    otp: Number(otp),
    otpExpires: { $gt: Date.now() },
    isVerified: false,
  });
  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }

  if (!user) {
    throw new ApiError(400, "Invalid OTP or email");
  }

  if (user.otpExpires < Date.now()) {
    throw new ApiError(400, "OTP has expired");
  }

  user.isVerified = true;
  user.otp = null;
  await user.save();
  successRes(res, 200, "OTP verified successfully", true);
});

const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Invalid Request");
  }
  const user = await userSchema.findOne({ email, isVerified: false });
  if (!user) {
    throw new ApiError(400, "Invalid Request");
  }

  const generatedOtp = generateOTP();
  user.otp = generatedOtp;
  user.otpExpires = Date.now() + 2 * 60 * 1000;

  await user.save();
  await sendEmail({
    email,
    subject: "Verify your email",
    html: otpVerificationTemplate({
      fullName: user.fullName,
      otp: generatedOtp,
      appName: "E-Commerce",
      supportEmail: "support@ecommerce.com",
    }),
  });
  successRes(res, 200, "OTP resent to your email successfully", true);
});

const signInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Email is invalid");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }
  const existingUser = await userSchema.findOne({ email });
  if (!existingUser) {
    throw new ApiError(400, "Email is not registered");
  }

  const matchPassword = await existingUser.comparePassword(password);

  if (!matchPassword) throw new ApiError(400, "Wrong Password");
  if (!existingUser.isVerified) {
    throw new ApiError(400, "Email is not verified.");
  }
  const accessToken = generateAccessToken(existingUser);
  const refreshToken = generateRefreshToken(existingUser);

  res.cookie("X-AS-Token", accessToken, {
    httpOnly: false,
    secure: false,
    maxAge: 3600000,
    // sameSite: 'Strict'
  });
  res.cookie("X-RF-Token", refreshToken, {
    httpOnly: false,
    secure: false,
    maxAge: 1296000000,
    // sameSite: 'Strict'
  });

  successRes(res, 200, "Login Successful", true);
});

const forgatePass = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");
  if (!isValidEmail(email)) throw new ApiError(400, "Email is invalid");

  const existingUser = await userSchema.findOne({ email });
  if (!existingUser) throw new ApiError(400, "Email not registered");

  const { resetToken, hashedToken } = generateResetPassToken();

  existingUser.resetPassToken = hashedToken;
  existingUser.resetExpires = Date.now() + 2 * 60 * 1000;
  await existingUser.save();

  const resetLink = `${process.env.CLIENT_URL || "http://localhost:8000"}/auth/resetpass/${resetToken}`;
  console.log("RESET LINK:", resetLink);
  sendEmail({
    email,
    subject: "Rset your password",
    html: resetPasswordTemplate({
      fullName: existingUser.fullName,
      appName: "E-Commerce",
      resetLink: resetLink,
      supportEmail: "support@ecommerce.com",
    }),
  });
  successRes(res, 200, "Check your email for reset link", true, {
    resetLink,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) throw new ApiError(400, "New password required");
  if (!token) throw new ApiError(404, "Invalid link");

  const hashedToken = hashResetToken(token);

  const existingUser = await userSchema.findOne({
    resetPassToken: hashedToken,
    resetExpires: { $gt: Date.now() },
  });

  if (!existingUser) throw new ApiError(400, "Invalid or expired token");

  existingUser.password = newPassword;
  existingUser.resetPassToken = undefined;
  existingUser.resetExpires = undefined;
  await existingUser.save();

  successRes(res, 200, "Password updated successfully", true);
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userProfile = await userSchema
    .findById(req.user._id)
    .select(
      "-password -otp -otpExpires -resetPassToken -resetExpire -updatedAt",
    );
  if (!userProfile) throw new ApiError(404, "User not found");

  successRes(
    res,
    200,
    "User profile retrieved successfully",
    true,
    userProfile,
  );
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, phone, address } = req.body || {};
  const userId = req.user._id;
  const avatar = req.file;

  const user = await userSchema
    .findById(userId)
    .select("-password -otp -otpExpires -resetPassToken -resetExpires -__v");
  if (!user) throw new ApiError(404, "User not found");

  if (avatar) {
    const imgPublicId = user.avatar.split("/").pop().split(".")[0];
    deleteFromCloudinary(`avatar/${imgPublicId}`);
    const imgRes = await uploadToCloudinary(avatar, "avatar");
    user.avatar = imgRes.secure_url;
  }
  if (fullName) user.fullName = fullName;
  if (phone) user.phone = phone;
  if (address) user.address = address;

  await user.save();

  successRes(res, 200, "Profile updated", true, user);
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.["X-RF-Token"] || req.headers.authorization;
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }
  const decoded = verifyToken(refreshToken);
  if (!decoded) throw new ApiError(401, "Invalid refresh token");
  const accessToken = generateAccessToken(decoded);

  res.cookie("X-AS-Token", accessToken, {
    httpOnly: false,
    secure: false,
    maxAge: 3600000,
    // sameSite: 'Strict'
  });
  successRes(res, 200, "Access token refreshed", true);
});

module.exports = { updateUserProfile };

module.exports = {
  signupUser,
  verifyOtp,
  resendOtp,
  signInUser,
  forgatePass,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  refreshAccessToken,
};
