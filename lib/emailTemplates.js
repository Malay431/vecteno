export const PASSWORD_RESET_TEMPLATE = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
    <div style="max-width: 500px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hello <strong>{{email}}</strong>,</p>
      <p>We received a request to reset your password. Use the following OTP to proceed:</p>
      <h1 style="color: #4A90E2; letter-spacing: 4px;">{{otp}}</h1>
      <p>This OTP is valid for 15 minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
      <hr style="margin: 20px 0;">
      <p style="font-size: 12px; color: #888;">© 2025 Your App. All rights reserved.</p>
    </div>
  </div>
`;
