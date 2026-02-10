const otpVerificationTemplate = ({ fullName, otp, appName, supportEmail }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Email Verification</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
        }
        .container {
          max-width: 500px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .header {
          background: #4f46e5;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 30px;
          color: #333333;
          line-height: 1.6;
        }
        .otp-box {
          margin: 20px 0;
          padding: 15px;
          text-align: center;
          background: #f0f2ff;
          border: 1px dashed #4f46e5;
          border-radius: 6px;
          font-size: 26px;
          font-weight: bold;
          letter-spacing: 6px;
          color: #4f46e5;
        }
        .footer {
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #777777;
          background: #fafafa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${appName}</h2>
        </div>

        <div class="content">
          <p>Hi <strong>${fullName || "User"}</strong>,</p>

          <p>
            Thank you for signing up! Please use the OTP below to verify your email
            address:
          </p>

          <div class="otp-box">${otp}</div>

          <p>
            ⏰ This OTP is valid for <strong>2 minutes</strong> only.
          </p>

          <p>
            If you didn’t request this verification, you can safely ignore this
            email.
          </p>

          <p>
            For security reasons, <strong>do not share this OTP</strong> with
            anyone.
          </p>

          <p>Thanks,<br />The ${appName} Team</p>
        </div>

        <div class="footer">
          <p>
            Need help? Contact us at
            <a href="mailto:${supportEmail}">${supportEmail}</a>
          </p>
        </div>
      </div>
    </body>
  </html>
  `;
};

module.exports = { otpVerificationTemplate };
