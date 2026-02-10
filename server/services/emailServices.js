const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "zubayersamin287@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

const sendEmail = async ({ email, subject, html }) => {
  try {
    await transporter.sendMail({
      from: "E-Commerce <zubayersamin287@gmail.com>",
      to: email,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email send failed:", err?.response || err?.message || err);
    throw err;
  }
};

module.exports = { sendEmail };
