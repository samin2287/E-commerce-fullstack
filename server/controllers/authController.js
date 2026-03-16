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

const signupUser = async (req, res) => {
  try {
    const { fullName, email, password, address, phone } = req.body;
    if (!email) {
      return res.status(400).send("Email is required");
    }

    if (!isValidEmail(email)) {
      return res.status(400).send("Email is invalid");
    }
    if (!password) {
      return res.status(400).send("Password is required");
    }
    if (!isPasswordValid(password)) {
      return res
        .status(400)
        .send("Password must be at least 6 characters long.");
    }
    const existingUser = await userSchema.findOne({ email });
    if (existingUser)
      return res.status(400).send({ message: "Email is already registered" });
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
    res.status(201).send({
      message: "User registered successfully.Please Verify your email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server signup Error");
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userSchema.findOne({
      email,
      otp: Number(otp),
      otpExpires: { $gt: Date.now() },
      isVerified: false,
    });
    if (!otp) {
      return res.status(400).send({ message: "OTP is required" });
    }

    if (!user) {
      return res.status(400).send({ message: "Invalid OTP or email" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).send({ message: "OTP has expired" });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();
    res.status(200).send({ message: "OTP verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server verify OTP Error");
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Invalid Request" });
    }
    const user = await userSchema.findOne({ email, isVerified: false });
    if (!user) {
      return res.status(400).send({ message: "Invalid Request" });
    }

    const generatedOtp = generateOTP();
    user.otp = generatedOtp;
    user.otpExpires = Date.now() + 2 * 60 * 1000;
    cds;
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
    res.status(200).send({ message: "OTP resent to your email successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Resend OTP Error");
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send("Email is required");
    }

    if (!isValidEmail(email)) {
      return res.status(400).send("Email is invalid");
    }
    if (!password) {
      return res.status(400).send("Password is required");
    }
    const existingUser = await userSchema.findOne({ email });
    if (!existingUser) {
      return res.status(400).send({ message: "Email.is not registered" });
    }

    const matchPassword = await existingUser.comparePassword(password);

    if (!matchPassword)
      return res.status(400).send({ message: "Wrong Password" });
    if (!existingUser.isVerified) {
      return res.status(400).send("Email is not verified.");
    }
    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);
    console.log(accessToken);
    console.log(refreshToken);
    res.cookie("X-AS-Token", accessToken, {
      httpOnly: false, // Not accessible by client-side JS
      secure: false, // Only sent over HTTPS
      maxAge: 3600000, // Expires in 1 hour (in milliseconds)
      // sameSite: 'Strict' // Only send for same-site requests
    });
    res.cookie("X-RF-Token", refreshToken, {
      httpOnly: false, // Not accessible by client-side JS
      secure: false, // Only sent over HTTPS
      maxAge: 1296000000, // Expires in 1 hour (in milliseconds)
      // sameSite: 'Strict' // Only send for same-site requests
    });

    res.status(200).send({ message: "Login Successfull" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Sign In Error");
  }
};

const forgatePass = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send("Email is required");
    if (!isValidEmail(email)) return res.status(400).send("Email is invalid");

    const existingUser = await userSchema.findOne({ email });
    if (!existingUser)
      return res.status(400).send({ message: "Email not registered" });

    // Generate token
    const { resetToken, hashedToken } = generateResetPassToken();

    // Save hashed token + expiry
    existingUser.resetPassToken = hashedToken;
    existingUser.resetExpires = Date.now() + 2 * 60 * 1000; // 2 min
    await existingUser.save(); // ✅ must call save

    // Send email / Postman link
    const resetLink = `${process.env.CLIENT_URL || "http://localhost:8000"}/auth/resetpass/${resetToken}`;
    console.log("RESET LINK:", resetLink); // Postman test-এর জন্য
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
    return res
      .status(200)
      .send({ message: "Check your email for reset link", resetLink });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) return res.status(400).send("New password required");
    if (!token) return res.status(404).send("Invalid link");

    const hashedToken = hashResetToken(token);

    const existingUser = await userSchema.findOne({
      resetPassToken: hashedToken,
      resetExpires: { $gt: Date.now() },
    });

    if (!existingUser) return res.status(400).send("Invalid or expired token");

    existingUser.password = newPassword;
    existingUser.resetPassToken = undefined;
    existingUser.resetExpires = undefined;
    await existingUser.save();

    return res.status(200).send("Password updated successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userProfile = await userSchema
      .findById(req.user._id)
      .select(
        "-password -otp -otpExpires -resetPassToken -resetExpire -updatedAt",
      );
    if (!userProfile)
      return res.status(404).send({ message: "User not found" });

    res.status(200).send({
      getUserProfile,
      message: "User profile create successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body || {};
    const userId = req.user._id;
    const avatar = req.file;

    const user = await userSchema
      .findById(userId)
      .select("-password -otp -otpExpires -resetPassToken -resetExpires -__v");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (avatar) {
      const imgPublicId = user.avatar.split("/").pop().split(".")[0];
      deleteFromCloudinary(`avatar/${imgPublicId}`);
      const imgRes = await uploadToCloudinary(avatar, "avatar");
      user.avatar = imgRes.secure_url;
    }
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save(); // must await

    return res.status(200).json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken =
      req.cookies?.["X-RF-Token"] || req.headers.authorization;
    if (!refreshToken) {
      return res.status(401).send("Refresh token missing");
    }
    // 2. Verify refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded) return;
    const accessToken = generateAccessToken(decoded);
    console.log(decoded);

    res
      .cookie("X-AS-Token", accessToken, {
        httpOnly: false, // Not accessible by client-side JS
        secure: false, // Only sent over HTTPS
        maxAge: 3600000, // Expires in 1 hour (in milliseconds)
        // sameSite: 'Strict' // Only send for same-site requests
      })
      .send({ success: true });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).send("Invalid Request");
  }
};

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
