# Email Service Setup Guide

This guide will help you set up a free SMTP email service for your authentication system. You have two main options: Resend (recommended) or Gmail SMTP.

## 🚀 Quick Start with Resend (Recommended)

Resend is a modern email API service with a generous free tier and excellent deliverability.

### Free Tier Limits

- 100 emails per day
- 3,000 emails per month
- No domain verification required for development

### Setup Steps

1. **Sign up for Resend**
   - Go to [resend.com](https://resend.com)
   - Create a free account

2. **Get Your API Key**
   - Go to your dashboard
   - Navigate to "API Keys"
   - Create a new API key

3. **Configure Environment Variables**
   Create a `.env.local` file in your project root:

   ```env
   # Resend Configuration
   RESEND_API_KEY=re_your_api_key_here

   # Email Settings (Optional)
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=Your App Name
   ```

4. **Restart Your Development Server**

   ```bash
   pnpm dev
   ```

5. **Test Your Setup**
   - Visit `/email-test` in your app
   - Enter your email and send test emails

## 📧 Alternative: Gmail SMTP

If you prefer to use Gmail, you can set up SMTP authentication.

### Setup Steps

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Enable 2-Factor Authentication

2. **Generate App Password**
   - Go to Google Account > Security > App passwords
   - Select "Mail" as the app
   - Generate a 16-character password

3. **Configure Environment Variables**

   ```env
   # Gmail SMTP Configuration
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your_16_character_app_password

   # Email Settings (Optional)
   FROM_NAME=Your App Name
   ```

4. **Test Your Setup**
   - The system will automatically fallback to Gmail if Resend isn't configured
   - Visit `/email-test` to verify

## 🛠️ Advanced Configuration

### Custom Domain (Resend)

For production, you'll want to use your own domain:

1. **Add Your Domain in Resend**
   - Go to Domains in your Resend dashboard
   - Add your domain (e.g., `yourdomain.com`)

2. **Update DNS Records**
   - Add the provided DNS records to your domain
   - Wait for verification (usually a few minutes)

3. **Update Environment Variables**
   ```env
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=Your Company Name
   ```

### Environment Variables Reference

```env
# Resend (Primary)
RESEND_API_KEY=re_your_api_key_here

# Gmail SMTP (Fallback)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# Email Settings
FROM_EMAIL=noreply@yourdomain.com  # Default: onboarding@resend.dev
FROM_NAME=Your App Name            # Default: Auth System
```

## 📧 Email Templates

The system includes two email templates:

### 1. OTP Verification Email

- Professional design with security warnings
- Clear OTP code display
- 10-minute expiration notice
- Responsive HTML template

### 2. Welcome Email

- Celebration theme for new users
- Getting started information
- Professional branding

## 🧪 Testing

### Test Email Functionality

1. Visit `/email-test` in your browser
2. Enter your email address
3. Click "Send Test Emails"
4. Check your inbox for both OTP and Welcome emails

### Test Registration Flow

1. Go to `/register`
2. Enter your email
3. Check for OTP email
4. Complete the registration with the OTP
5. Check for welcome email

## 🔧 Troubleshooting

### Common Issues

**Resend API Key Invalid**

- Verify your API key is correct
- Check it starts with `re_`
- Ensure no extra spaces

**Gmail Authentication Failed**

- Verify 2FA is enabled
- Check the app password is 16 characters
- Ensure you're using an app password, not your regular password

**Emails Not Received**

- Check spam/junk folder
- Verify the email address is correct
- Check your email service limits

**Domain Not Verified (Resend)**

- For development, use the default domain
- For production, verify your custom domain in Resend dashboard

### Development Mode

In development, you can see email logs in your console:

- OTP generation logs
- Email sending status
- Error messages

## 📈 Production Considerations

### Security

- Never expose API keys in client-side code
- Use environment variables only
- Rotate API keys regularly

### Monitoring

- Set up email delivery monitoring
- Track bounce rates
- Monitor spam reports

### Scaling

- Consider upgrading Resend plan for higher volumes
- Implement email queuing for high traffic
- Add retry logic for failed sends

## 🎯 Features Implemented

- ✅ OTP email verification
- ✅ Welcome emails
- ✅ Resend OTP functionality
- ✅ HTML + text email templates
- ✅ Fallback email service (Gmail)
- ✅ Email testing utilities
- ✅ Error handling and retry logic
- ✅ Professional email templates
- ✅ Responsive design

## 🔗 Useful Links

- [Resend Documentation](https://resend.com/docs)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Email Testing Tools](https://mailtrap.io/)

---

**Need Help?** Visit `/email-test` to test your configuration and see detailed setup instructions.
