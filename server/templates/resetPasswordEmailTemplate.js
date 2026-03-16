const resetPasswordTemplate = ({
  fullName,
  resetLink,
  appName,
  supportEmail,
}) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Reset Password</title>
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
            We received a request to reset your password. Click the button below
            to create a new password.
          </p>
<a href="${resetLink}" style="
    display: inline-block;
    margin: 20px 0;
    padding: 12px 20px;
    background: #4f46e5;
    color: #ffffff;
    text-decoration: none;
    border-radius: 6px;
    font-weight: bold;
">Reset Password</a>
          <p>
             This link will expire in <strong>10 minutes</strong> for security
            reasons.
          </p>
          <p>
            If you didn’t request a password reset, you can safely ignore this
            email.
          </p>
          <p>
            For security reasons, please do not share this link with anyone.
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

module.exports = { resetPasswordTemplate };
