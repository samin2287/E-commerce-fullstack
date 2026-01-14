const userSchema = require("../models/userSchema");

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const isPasswordValid = (password) => {
  return password && password.length >= 6;
};
module.exports = { isValidEmail, isPasswordValid };
