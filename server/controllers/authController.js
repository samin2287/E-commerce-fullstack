const { sendEmail } = require("../services/emailServices");
const { generateOTP } = require("../services/helpers");
const { isValidEmail, isPasswordValid } = require("../services/validation");
const userSchema = require("../models/userSchema");
const { otpVerificationTemplate } = require("../templates/email/emailTemplate");

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
    // await sendEmail({
    //   email,
    //   template: otpVerificationTemplate({
    //     fullName,
    //     otp: generatedOtp,
    //     appName: "E-Commerce",
    //     supportEmail: "support@ecommerce.com",
    //   }),
    //   subject: "Verify your email",
    //   otp: generatedOtp,
    // });

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
    res.status(500).send("Server Error");
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp) return res.status(400).send({ message: "OTP is required" });
    if (!email) return res.status(400).send({ message: "Invalid Request" });

    const user = await userSchema.findOne({
      email,
      otp: Number(otp),
      otpExpires: { $gt: new Date() },
      isVerified: false,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }
    user.isVerified = true;
    user.otp = null;
    user.save();

    res.status(200).send({ message: "Verified successfully" });
  } catch (error) {
    return responseHandler(res, 500, "Internal Server Error");
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ message: "Invalid Request" });

    const user = await userSchema.findOne({
      email,
      isVerified: false,
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid Request",
      });
    }

    const generatedOtp = generateOTP();
    user.otp = generatedOtp;
    user.otpExpires = Date.now() + 2 * 60 * 1000;
    user.save();
    sendEmail({
      email,
      subject: "Email Verification",
      otp: generatedOtp,
      template: emailVerifyTem,
    });

    res.status(201).send({ message: "OTP send to your email successfully." });
  } catch (error) {
    return responseHandler(res, 500, "Internal Server Error");
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!isValidEmail(email))
      return res.status(400).send({ message: "Enter a valid email address" });
    if (!password)
      return res.status(400).send({ message: "Password is required" });
    const existingUser = await userSchema.findOne({ email });
    if (!existingUser)
      return res.status(400).send({ message: "Email is not registered" });

    const matchPass = await existingUser.comparePassword(password);
    if (!matchPass) {
      return res.status(400).send({ message: "Wrong Password" });
    }
    if (!existingUser.isVerified)
      return responseHandler(res, 400, "Email is not verified.");

    const accToken = generateAccessToken(existingUser);
    const refToken = generateRefreshToken(existingUser);

    res.cookie("X-AS-Token", accToken, {
      httpOnly: false,
      secure: false,
      maxAge: 3600000,
    });
    res.cookie("X-RF-Token", refToken, {
      httpOnly: false,
      secure: false,
      maxAge: 1296000000,
    });
    res.status(200).send({ message: "Login Successfylly" });
  } catch (error) {
    return responseHandler(res, 500, "Internal Server Error");
  }
};

const forgatePass = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!isValidEmail(email))
      return res.status(400).send({ message: "Enter a valid email address" });
    const existingUser = await userSchema.findOne({ email });
    if (!existingUser)
      return res.status(400).send({ message: "Email is not registered" });

    const resetPassToken = generateResetPassToken(existingUser);

    const RESET_PASSWORD_LINK = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/resetpass/?sec=${resetPassToken}`;
    sendEmail({
      email,
      subject: "Reset Your Password",
      otp: RESET_PASSWORD_LINK,
      template: resetPassEmailTemp,
    });
    responseHandler(
      res,
      200,
      "Find the reset password link in your email",
      true
    );
  } catch (error) {
    return responseHandler(res, 500, "Internal Server Error");
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).send({ message: "All fields are required" });

    if (!isPasswordValid(newPassword))
      return res
        .status(400)
        .send({ message: "Password must be at least 6 characters long" });

    const user = await userSchema.findOne({
      email,
      resetOtp: Number(otp),
      resetOtpExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).send({ message: "Invalid or expired OTP" });

    user.password = newPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;

    await user.save();

    res.status(200).send({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  signupUser,
  verifyOtp,
  resendOtp,
  signInUser,
  forgatePass,
  resetPassword,
};
