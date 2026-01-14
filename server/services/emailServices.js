// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   port: 587,
//   secure: false, // Use true for port 465, false for port 587
//   auth: {
//     user: "zubayersamin287@gmail.com",
//     pass: process.env.App_Password,
//   },
// });

// const sendEmail = async ({ email, subject, otp, otpVerificationTemplate }) => {
//   await transporter.sendMail({
//     from: "E-Commerce",
//     to: email,

//     subject: subject,
//     html: otpVerificationTemplate,
//   });
// };

// module.exports = { sendEmail };

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "zubayersamin287@gmail.com",
    pass: process.env.App_Password,
  },
});

const sendEmail = async ({ email, subject, html }) => {
  await transporter.sendMail({
    from: "E-Commerce <zubayersamin287@gmail.com>",
    to: email,
    subject,
    html,
  });
};

module.exports = { sendEmail };
