const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});
const sendEmail = async (email, subject, otp) => {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
    to: email,
    subject: subject,
    // text: `Your OTP is ${otp}`, // Plain-text version of the message
    html: `<b>Your OTP is ${otp}</b>`, // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
};

module.exports = { sendEmail };
