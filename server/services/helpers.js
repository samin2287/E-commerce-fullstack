const jwt = require("jsonwebtoken");
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: "15d" },
  );
};
const verifyToken = (token) => {
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateOTP,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
