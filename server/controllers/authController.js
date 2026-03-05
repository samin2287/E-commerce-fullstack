const { sendEmail } = require("../services/emailServices");
const {
  generateOTP,
  generateAccessToken,
  generateRefreshToken,
} = require("../services/helpers");
const { isValidEmail, isPasswordValid } = require("../services/validation");
const userSchema = require("../models/userSchema");
const { otpVerificationTemplate } = require("../templates/email/emailTemplate");
const { trace } = require("next/dist/trace");

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

module.exports = {
  signupUser,
  verifyOtp,
  resendOtp,
  signInUser,
};
