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

export const mfaEnabledTemplate = (
  userName: string,
  brandColor: string = "#2563EB"
) => ({
  subject: "Two-Factor Authentication Enabled - ExamForge",
  text: `Hello ${userName}, Two-Factor Authentication has been enabled on your ExamForge account.`,
  html: `
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #f0f9ff, #ffffff);
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
        .security-badge {
          display: inline-block;
          padding: 12px 20px;
          background: linear-gradient(90deg, #10b981, #34d399);
          color: #ffffff;
          font-weight: 600;
          font-size: 16px;
          border-radius: 8px;
          margin: 15px 0;
        }
        .info-box {
          background: #f8fafc;
          border-left: 4px solid ${brandColor};
          padding: 20px;
          margin: 25px 0;
          text-align: left;
          border-radius: 0 8px 8px 0;
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
          Security Update
        </div>
        <div class="content">
          <h1>Two-Factor Authentication Enabled</h1>
          <div class="security-badge">🔒 Security Enhanced</div>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Two-Factor Authentication (2FA) has been successfully enabled on your ExamForge account.</p>

          <div class="info-box">
            <strong>What this means:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>You'll need both your password and a verification code to sign in</li>
              <li>Your account is now protected against unauthorized access</li>
              <li>You'll receive a prompt for a verification code on each login</li>
            </ul>
          </div>

          <p>If you did not enable 2FA, please contact our support team immediately.</p>
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

export const mfaDisabledTemplate = (
  userName: string,
  brandColor: string = "#2563EB"
) => ({
  subject: "Two-Factor Authentication Disabled - ExamForge",
  text: `Hello ${userName}, Two-Factor Authentication has been disabled on your ExamForge account.`,
  html: `
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #fef3c7, #ffffff);
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
        .warning-badge {
          display: inline-block;
          padding: 12px 20px;
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          color: #ffffff;
          font-weight: 600;
          font-size: 16px;
          border-radius: 8px;
          margin: 15px 0;
        }
        .warning-box {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 20px;
          margin: 25px 0;
          text-align: left;
          border-radius: 0 8px 8px 0;
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
          Security Update
        </div>
        <div class="content">
          <h1>Two-Factor Authentication Disabled</h1>
          <div class="warning-badge">⚠️ Security Changed</div>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Two-Factor Authentication (2FA) has been disabled on your ExamForge account.</p>

          <div class="warning-box">
            <strong>Important Security Notice:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Your account is now protected only by your password</li>
              <li>Consider re-enabling 2FA for enhanced security</li>
              <li>Use a strong, unique password for your account</li>
            </ul>
          </div>

          <p>If you did not disable 2FA, please contact our support team immediately and change your password.</p>
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

export const loginAlertTemplate = (
  userName: string,
  loginTime: string,
  deviceInfo: string,
  location: string = "Unknown",
  brandColor: string = "#2563EB"
) => ({
  subject: "New Login Detected - ExamForge",
  text: `Hello ${userName}, there was a new login to your ExamForge account on ${loginTime} from ${deviceInfo} in ${location}.`,
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
        .login-info {
          background: #f8fafc;
          border-radius: 12px;
          padding: 25px;
          margin: 25px 0;
          text-align: left;
          border-left: 4px solid ${brandColor};
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .info-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #374151;
        }
        .info-value {
          color: #6b7280;
        }
        .security-note {
          background: #fef3c7;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
          border-left: 4px solid #f59e0b;
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
          margin: 10px 5px;
        }
        .button:hover {
          background: linear-gradient(90deg, #1d4ed8, #2563eb);
        }
        .button-secondary {
          background: linear-gradient(90deg, #6b7280, #9ca3af);
        }
        .button-secondary:hover {
          background: linear-gradient(90deg, #4b5563, #6b7280);
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
          Security Alert
        </div>
        <div class="content">
          <h1>New Login Detected</h1>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>We noticed a recent login to your ExamForge account. Here are the details:</p>

          <div class="login-info">
            <div class="info-item">
              <span class="info-label">Time:</span>
              <span class="info-value">${loginTime}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Device:</span>
              <span class="info-value">${deviceInfo}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Location:</span>
              <span class="info-value">${location}</span>
            </div>
          </div>

          <div class="security-note">
            <strong>🔒 Security Tip:</strong>
            <p style="margin: 10px 0 0 0;">If this was you, no action is needed. If you don't recognize this activity, please secure your account immediately.</p>
          </div>

          <div>
            <a href="#" class="button">Review Account Activity</a>
            <a href="#" class="button button-secondary">Change Password</a>
          </div>

          <p style="margin-top: 25px; font-size: 14px;">
            For security reasons, we recommend enabling Two-Factor Authentication for extra protection.
          </p>
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
