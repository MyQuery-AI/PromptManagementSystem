import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using Resend service
 */
export async function sendEmailWithResend(options: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.FROM_NAME || "Auth System"} <${process.env.FROM_EMAIL || "onboarding@resend.dev"}>`,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      console.error("Resend email error:", error);
      throw new Error("Failed to send email via Resend");
    }

    console.log("Email sent successfully via Resend:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}

/**
 * Send email using Gmail SMTP (fallback option)
 */
export async function sendEmailWithGmail(options: EmailOptions) {
  // Dynamic import to avoid loading nodemailer if not needed
  const nodemailer = await import("nodemailer");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `${process.env.FROM_NAME || "Auth System"} <${process.env.GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully via Gmail:", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Gmail SMTP error:", error);
    throw error;
  }
}

/**
 * Main email sending function - tries Resend first, then Gmail as fallback
 */
export async function sendEmail(options: EmailOptions) {
  // Try Resend first if API key is available
  if (process.env.RESEND_API_KEY) {
    try {
      return await sendEmailWithResend(options);
    } catch (error) {
      console.log("Resend failed, trying Gmail fallback...");
    }
  }

  // Fallback to Gmail if Resend fails or isn't configured
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return await sendEmailWithGmail(options);
  }

  throw new Error(
    "No email service configured. Please set up either RESEND_API_KEY or Gmail credentials."
  );
}

/**
 * Generate OTP email template
 */
export function generateOTPEmailTemplate(
  otp: string,
  email: string,
  setupLink?: string
) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .otp-code {
          background: #f8f9fa;
          border: 2px dashed #6366f1;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code .code {
          font-size: 32px;
          font-weight: bold;
          color: #6366f1;
          letter-spacing: 4px;
          font-family: monospace;
        }
        .otp-code .label {
          color: #6b7280;
          font-size: 14px;
          margin-top: 8px;
        }
        .warning {
          background: #fef3cd;
          border-left: 4px solid #fbbf24;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .warning p {
          margin: 0;
          color: #92400e;
          font-size: 14px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: #6366f1;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Verify Your Email</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Thank you for signing up! Please use the verification code below to complete your registration:</p>
          
          <div class="otp-code">
            <div class="code">${otp}</div>
            <div class="label">Enter this code to verify your account</div>
          </div>
          
          ${
            setupLink
              ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${setupLink}" class="button" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
              Complete Registration
            </a>
          </div>
          <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 10px;">
            Or copy and paste this link: <br>
            <a href="${setupLink}" style="color: #6366f1; word-break: break-all;">${setupLink}</a>
          </p>
          `
              : ""
          }
          
          <div class="warning">
            <p><strong>Security Notice:</strong></p>
            <p>• This code expires in 10 minutes</p>
            <p>• Don't share this code with anyone</p>
            <p>• If you didn't request this, please ignore this email</p>
          </div>
          
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Best regards,<br>Your App Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to ${email}</p>
          <p>If you didn't request this verification, you can safely ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Verify Your Email
    
    Hello,
    
    Thank you for signing up! Please use the verification code below to complete your registration:
    
    Verification Code: ${otp}
    
    ${setupLink ? `Complete your registration at: ${setupLink}` : ""}
    
    Security Notice:
    • This code expires in 10 minutes
    • Don't share this code with anyone
    • If you didn't request this, please ignore this email
    
    If you have any questions, feel free to contact our support team.
    
    Best regards,
    Your App Team
    
    This email was sent to ${email}
    If you didn't request this verification, you can safely ignore this email.
  `;

  return { html, text };
}

/**
 * Generate welcome email template
 */
export function generateWelcomeEmailTemplate(name: string, email: string) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Platform!</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .welcome-message {
          background: #f0fdf4;
          border-left: 4px solid #10b981;
          padding: 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome Aboard!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          
          <div class="welcome-message">
            <p><strong>Congratulations!</strong> Your account has been successfully created and verified.</p>
          </div>
          
          <p>We're excited to have you join our community. You can now access all the features of our platform.</p>
          
          <p>Here's what you can do next:</p>
          <ul>
            <li>Complete your profile setup</li>
            <li>Explore our features</li>
            <li>Connect with other users</li>
            <li>Start your journey with us</li>
          </ul>
          
          <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
          
          <p>Welcome to the family!</p>
          <p>Best regards,<br>Your App Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to ${email}</p>
          <p>© 2025 Your App. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Welcome Aboard!
    
    Hi ${name},
    
    Congratulations! Your account has been successfully created and verified.
    
    We're excited to have you join our community. You can now access all the features of our platform.
    
    Here's what you can do next:
    • Complete your profile setup
    • Explore our features
    • Connect with other users
    • Start your journey with us
    
    If you have any questions or need assistance, don't hesitate to reach out to our support team.
    
    Welcome to the family!
    
    Best regards,
    Your App Team
    
    This email was sent to ${email}
    © 2025 Your App. All rights reserved.
  `;

  return { html, text };
}
