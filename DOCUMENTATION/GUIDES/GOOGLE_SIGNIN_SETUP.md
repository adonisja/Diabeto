# Google Sign-In Configuration Guide

This guide explains how to set up Google Sign-In for the Diabeto app.

**🚨 EXPERIENCING OAUTH ERRORS?** See [GOOGLE_OAUTH_TROUBLESHOOTING.md](./GOOGLE_OAUTH_TROUBLESHOOTING.md) for immediate fixes.

## Quick Start

1. **Copy environment template**: `cp .env.template .env`
2. **Follow Google Cloud Console setup** (detailed below)
3. **Fill in your OAuth client IDs** in `.env`
4. **Restart development server**: `npx expo start --clear`

## Required Environment Variables

Add these to your `.env` file (not tracked by git for security):

```bash
# Google OAuth Configuration
EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=your-web-client-id-here
EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID=your-ios-client-id-here  
EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID=your-android-client-id-here
```

## Setup Steps

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"

### 2. Create OAuth Client IDs

You'll need to create three OAuth clients:

#### Web Application Client ID
- **Application type**: Web application
- **Authorized redirect URIs**: 
  - `https://auth.expo.io/@your-expo-username/diabeto`
  - `http://localhost:19006/auth` (for web development)
- **Use for**: `EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID`

#### iOS Client ID
- **Application type**: iOS
- **Bundle ID**: `com.adonisja.Diabeto` (from app.json)
- **Use for**: `EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID`

#### Android Client ID
- **Application type**: Android
- **Package name**: `com.adonisja.Diabeto` (from app.json)
- **SHA-1 certificate fingerprint**: Get from Expo or your keystore
- **Use for**: `EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID`

### 3. Firebase Configuration

1. In your Firebase Console, go to Authentication
2. Click "Sign-in method" tab
3. Enable "Google" as a sign-in provider
4. Use the Web SDK configuration from your Google Cloud Console

### 4. Testing

- **Development**: Google Sign-In will show a fallback message if not configured
- **Production**: Ensure all environment variables are properly set

## Security Notes

- Never commit OAuth client secrets to version control
- The `.env` file is automatically ignored by git
- Only client IDs are needed for this implementation (no client secrets for mobile OAuth)

## Email Verification Compliance

### Automatic Email Verification
Google OAuth users automatically receive verified email status for medical compliance:

- **Immediate Access**: Google users bypass traditional email verification requirements
- **Compliance Tracking**: Verification method recorded as `'google_oauth'` for audit trails
- **Medical Standards**: Meets healthcare application email verification requirements
- **Audit Documentation**: Timestamps and method tracking for regulatory compliance

### Implementation Details
```typescript
// Automatic verification for Google OAuth users
emailVerified: true
emailVerifiedAt: new Date()
emailVerificationMethod: 'google_oauth'
```

### Benefits for Medical Applications
- **Reduced Friction**: Healthcare providers can immediately access patient data
- **Regulatory Compliance**: Clear audit trail for email verification methods
- **User Experience**: No additional verification steps required for Google users
- **Security Assurance**: Google's identity verification exceeds traditional email verification

## Troubleshootingion Compliance

### Automatic Email Verification
Google OAuth users automatically receive verified email status for medical compliance:

- **Immediate Access**: Google users bypass traditional email verification requirements
- **Compliance Tracking**: Verification method recorded as `'google_oauth'` for audit trails
- **Medical Standards**: Meets healthcare application email verification requirements
- **Audit Documentation**: Timestamps and method tracking for regulatory compliance

### Implementation Details
```typescript
// Automatic verification for Google OAuth users
emailVerified: true
emailVerifiedAt: new Date()
emailVerificationMethod: 'google_oauth'
```

### Benefits for Medical Applications
- **Reduced Friction**: Healthcare providers can immediately access patient data
- **Regulatory Compliance**: Clear audit trail for email verification methods
- **User Experience**: No additional verification steps required for Google users
- **Security Assurance**: Google's identity verification exceeds traditional email verification

## Troubleshooting

- **"Google Sign-In not configured"**: Check environment variables
- **OAuth errors**: Verify redirect URIs match exactly
- **Platform-specific issues**: Ensure correct client ID for each platform
