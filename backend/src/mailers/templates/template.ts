export const verifyEmailTemplate = (
    url: string,
    brandColor: string = "#2563EB"
) => ({
    subject: "Verify your ExamForge account",
    text: `Please verify your email address by clicking the following link: ${url}`,
    html: `
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #f0f4ff, #ffffff);
          font-family: 'Inter', Arial, sans-serif;
          color: #333333;
        }
        .container {
          max-width: 600px;
          margin: 50px auto;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }
        .header {
          background: linear-gradient(135deg, ${brandColor}, #3b82f6);
          color: #ffffff;
          text-align: center;
          padding: 35px 20px;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .logo {
          background: rgba(255, 255, 255, 0.15);
          display: inline-block;
          padding: 10px 15px;
          border-radius: 12px;
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .content h1 {
          font-size: 26px;
          margin-bottom: 15px;
          color: #111827;
        }
        .content p {
          font-size: 16px;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 25px;
        }
        .button {
          display: inline-block;
          padding: 14px 30px;
          background: linear-gradient(90deg, ${brandColor}, #3b82f6);
          color: #ffffff !important;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          transition: all 0.2s ease-in-out;
        }
        .button:hover {
          background: linear-gradient(90deg, #1d4ed8, #2563eb);
        }
        .footer {
          padding: 25px;
          text-align: center;
          font-size: 13px;
          color: #9ca3af;
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ExamForge</div>
          Confirm Your Email
        </div>
        <div class="content">
          <h1>Verify your email address</h1>
          <p>Thanks for joining ExamForge! Click the button below to confirm your account and get started.</p>
          <a href="${url}" class="button">Confirm Account</a>
          <p style="margin-top: 25px;">If you didn’t create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ExamForge. All rights reserved.</p>
          <p>Need help? <a href="mailto:support@examforge.com" style="color:${brandColor}; text-decoration:none;">Contact support</a></p>
        </div>
      </div>
    </body>
  </html>
  `,
});


export const passwordResetTemplate = (
    url: string,
    brandColor: string = "#2563EB"
) => ({
    subject: "Reset your ExamForge password",
    text: `To reset your password, click the following link: ${url}`,
    html: `
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #f8fafc, #ffffff);
          font-family: 'Inter', Arial, sans-serif;
          color: #333333;
        }
        .container {
          max-width: 600px;
          margin: 50px auto;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }
        .header {
          background: linear-gradient(135deg, ${brandColor}, #3b82f6);
          color: #ffffff;
          text-align: center;
          padding: 35px 20px;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .logo {
          background: rgba(255, 255, 255, 0.15);
          display: inline-block;
          padding: 10px 15px;
          border-radius: 12px;
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .content h1 {
          font-size: 26px;
          margin-bottom: 15px;
          color: #111827;
        }
        .content p {
          font-size: 16px;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 25px;
        }
        .button {
          display: inline-block;
          padding: 14px 30px;
          background: linear-gradient(90deg, ${brandColor}, #3b82f6);
          color: #ffffff !important;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          transition: all 0.2s ease-in-out;
        }
        .button:hover {
          background: linear-gradient(90deg, #1d4ed8, #2563eb);
        }
        .footer {
          padding: 25px;
          text-align: center;
          font-size: 13px;
          color: #9ca3af;
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ExamForge</div>
          Reset Your Password
        </div>
        <div class="content">
          <h1>Password Reset Request</h1>
          <p>We received a request to reset your password. Click the button below to create a new one.</p>
          <a href="${url}" class="button">Reset Password</a>
          <p style="margin-top: 25px;">If you didn’t request a password reset, just ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ExamForge. All rights reserved.</p>
          <p>Need help? <a href="mailto:support@examforge.com" style="color:${brandColor}; text-decoration:none;">Contact support</a></p>
        </div>
      </div>
    </body>
  </html>
  `,
});
