const { sendEmail } = require("../../services/emailServices");
const { isValidEmail, isPasswordValid } = require("../../services/validation");
const userSchema = require("../models/userSchema");
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
      res.status(400).send("Password must be at least 6 characters long.");
    }
    const existingUser = await userSchema.findOne({ email });
    if (existingUser)
      return res.status(400).send({ message: "Email is already registered" });
    const generateOTP = generateOTP();
    const user = new userSchema({
      fullName,
      email,
      password,
      address,
      phone,
      otp: generateOTP,
      otpExpires: Date.now() + 2 * 60 * 1000,
    });
    sendEmail({ email, subject: "Verify your email", otp: generateOTP });

    await user.save();

    res.status(201).send({
      message: "User registered successfully.Please Verify your email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
module.exports = { signupUser };
