const SIZE_ENUM = ["s", "m", "l", "xl", "2xl", "3xl"];
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const isPasswordValid = (password) => {
  return password && password.length >= 6;
};
module.exports = { isValidEmail, isPasswordValid, SIZE_ENUM };
