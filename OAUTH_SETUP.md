# OAuth & Credentials Authentication Setup Guide

This guide will help you set up OAuth providers (Google, GitHub) and credentials authentication with your OTP email verification system.

## 🔐 Authentication Flow Overview

Your system now supports three authentication methods:

1. **Email + OTP + Password** (Credentials) - Users register with email, verify with OTP, then set password
2. **Google OAuth** - Users sign in with Google account
3. **GitHub OAuth** - Users sign in with GitHub account

## 🚀 Quick Setup

### 1. NextAuth Configuration

Add these environment variables to your `.env.local`:

```env
# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 2. Generate NextAuth Secret

```bash
# Generate a secure secret
openssl rand -base64 32
```

Or visit [generate-secret.vercel.app](https://generate-secret.vercel.app/32) for an online generator.

## 🔧 OAuth Provider Setup

### Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)

4. **Get Your Credentials**
   - Copy Client ID and Client Secret
   - Add to your `.env.local`

### GitHub OAuth Setup

1. **Go to GitHub Settings**
   - Visit [github.com/settings/developers](https://github.com/settings/developers)
   - Click "New OAuth App"

2. **Configure OAuth App**
   - Application name: Your App Name
   - Homepage URL: `http://localhost:3000` (development)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

3. **Get Your Credentials**
   - Copy Client ID and generate Client Secret
   - Add to your `.env.local`

## 🎯 Features Implemented

### ✅ Credentials Authentication

- **Email Validation** - Zod schema validation
- **OTP Verification** - Email-based verification required
- **Password Security** - Password strength requirements
- **Database Integration** - Prisma ORM with PostgreSQL
- **Session Management** - JWT-based sessions

### ✅ OAuth Authentication

- **Google Sign-In** - Seamless Google account integration
- **GitHub Sign-In** - Seamless GitHub account integration
- **Auto User Creation** - Creates user records for OAuth sign-ins
- **Email Pre-verification** - OAuth emails are automatically verified

### ✅ Unified User Management

- **Single User Table** - All auth methods use same user model
- **Email Confirmation** - Tracks verification status
- **Fallback Handling** - Graceful error handling for all flows

## 🔒 Security Features

### Authentication Callbacks

- **signIn Callback** - Handles OAuth user creation and verification
- **JWT Callback** - Manages token data and user info
- **Session Callback** - Provides client-side session data

### Database Integration

- **Prisma ORM** - Type-safe database operations
- **User Verification** - Email confirmation tracking
- **OAuth Compatibility** - Seamless integration with existing users

## 🧪 Testing Your Setup

### Test Credentials Authentication

1. Go to `/register`
2. Enter email and receive OTP
3. Complete registration with password
4. Login at `/login` with email/password

### Test OAuth Authentication

1. Go to `/login`
2. Click "Continue with Google" or "Continue with GitHub"
3. Complete OAuth flow
4. Should be redirected to `/dashboard`

### Test Dashboard Access

1. Visit `/dashboard` after authentication
2. Should see user information and session details
3. Test logout functionality in header

## 🛠️ Troubleshooting

### Common Issues

**OAuth Redirect URI Mismatch**

- Ensure callback URLs match exactly in provider settings
- Check for trailing slashes and protocol (http vs https)

**NextAuth Secret Missing**

- Generate and set NEXTAUTH_SECRET in environment
- Required for JWT signing and encryption

**Database Connection Issues**

- Verify DATABASE_URL is correct
- Run `prisma generate` and `prisma db push`

**OAuth Provider Not Working**

- Check client ID and secret are correct
- Verify OAuth app is enabled and configured
- Check browser console for detailed errors

### Development vs Production

**Development (localhost:3000)**

```env
NEXTAUTH_URL=http://localhost:3000
```

**Production**

```env
NEXTAUTH_URL=https://yourdomain.com
```

Update OAuth provider callback URLs accordingly.

## 📱 User Experience Flow

### New User Registration (Credentials)

1. **Email Entry** → User enters email at `/register`
2. **OTP Email** → System sends verification code
3. **OTP Verification** → User enters code + name + password
4. **Welcome Email** → System sends welcome message
5. **Login Ready** → User can now login with credentials

### OAuth Sign-In (Google/GitHub)

1. **OAuth Initiation** → User clicks OAuth button
2. **Provider Auth** → Redirected to Google/GitHub
3. **Callback** → Returned with authorization code
4. **User Creation** → System creates/updates user record
5. **Session Created** → User logged in and redirected

### Existing User Login

1. **Credentials** → Email + password validation
2. **OAuth** → Direct sign-in if account linked
3. **Dashboard** → Redirected to authenticated area

## 🔗 Important URLs

- **Login**: `/login`
- **Register**: `/register`
- **Dashboard**: `/dashboard`
- **OAuth Callbacks**: `/api/auth/callback/[provider]`
- **Email Test**: `/email-test`

## ⚡ Next Steps

1. **Set up OAuth providers** following the guides above
2. **Test authentication flows** with different methods
3. **Customize dashboard** with your app-specific content
4. **Add protected routes** using the `auth()` function
5. **Implement role-based access** if needed

Your authentication system is now fully configured with multiple sign-in options and robust security! 🔐✨
