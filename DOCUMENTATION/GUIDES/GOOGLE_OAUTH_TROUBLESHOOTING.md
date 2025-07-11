# Google OAuth Authorization Error - Troubleshooting Guide

**Error**: `Authorization Error: You can't sign in to this app because it doesn't comply with Google's Auth 2.0 policy`  
**Error Code**: `Error 400: invalid_request`  
**Latest Update**: Custom scheme rejection fix applied  
**Date**: July 6, 2025  

---

## 🚨 Recent Fix Applied (July 2025)

### **Issue**: Custom Scheme Rejection
Google OAuth now rejects custom schemes like `diabeto://auth` with error: "Invalid Origin: must end with a public top-level domain"

### **Solution Applied**:
✅ **Code updated in `firebase/googleAuth.ts`**:
```typescript
// OLD (broken):
const redirectUri = makeRedirectUri({ scheme: 'diabeto', path: 'auth' });

// NEW (fixed):
const redirectUri = __DEV__ 
  ? 'http://localhost:19006' // Force localhost in development
  : makeRedirectUri(); // Use proper domain in production
```

✅ **App configuration updated in `app.config.js`**:
```javascript
// Commented out to prevent OAuth issues:
// scheme: "diabeto",
```

### **Google Cloud Console Update Required**:
Remove `diabeto://auth` from redirect URIs and use only localhost URLs.

---

## 🚨 Immediate Fix Required

This error occurs because your Google OAuth configuration is incomplete. Follow these steps to resolve it:

### **Step 1: Create Environment Variables** ✅

1. **Copy the environment template**:
   ```bash
   cp .env.template .env
   ```

2. **The `.env` file is gitignored** - this is correct for security, so your OAuth credentials won't be committed to git.

### **Step 2: Set Up Google Cloud Console** 🔧

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or Select Project**: Create a new project or select existing one
3. **Enable Required APIs**:
   - Go to "APIs & Services" → "Library"
   - Enable "Google+ API" or "People API"
   - Enable "Google Identity and Access Management (IAM) API"

### **Step 3: Create OAuth 2.0 Credentials** 🔑

You need to create **THREE** OAuth client IDs:

#### **A. Web Application Client ID**
```
Application type: Web application
Name: Diabeto Web Client
Authorized redirect URIs:
- http://localhost:19006
- http://localhost:8081
- http://localhost:8082
```
**Copy this Client ID to**: `EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID` in `.env`

**⚠️ IMPORTANT**: Do NOT add `diabeto://auth` as Google now rejects custom schemes

#### **B. iOS Client ID** 
```
Application type: iOS
Name: Diabeto iOS Client  
Bundle ID: com.adonisja.Diabeto
```
**Copy this Client ID to**: `EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID` in `.env`

#### **C. Android Client ID**
```
Application type: Android
Name: Diabeto Android Client
Package name: com.adonisja.Diabeto
SHA-1 certificate fingerprint: (get from expo credentials:manager)
```
**Copy this Client ID to**: `EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID` in `.env`

### **Step 4: Configure OAuth Consent Screen** 🛡️

1. **Go to "OAuth consent screen"** in Google Cloud Console
2. **Choose "External"** (unless you have a Google Workspace)
3. **Fill in required fields**:
   ```
   App name: Diabeto
   User support email: your-email@example.com
   App domain: (leave blank for development)
   Authorized domains: (leave blank for development)
   Developer contact: your-email@example.com
   ```
4. **Add Scopes**:
   - `openid`
   - `profile` 
   - `email`
5. **Add Test Users** (IMPORTANT for development):
   - Add your email: `nicoyhunt@gmail.com`
   - Add any other test user emails

### **Step 5: Fix Your .env File** 📝

Your `.env` file should look like this:
```bash
# Replace with your actual client IDs from Google Cloud Console
EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=123456789012-abcdefghijklmnop.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID=123456789012-qrstuvwxyz123456.apps.googleusercontent.com  
EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID=123456789012-789012345678abcd.apps.googleusercontent.com
```

### **Step 6: Restart Development Server** 🔄

After creating `.env`:
```bash
# Stop current server (Ctrl+C)
# Then restart:
npx expo start --clear
```

---

## 🔍 Understanding the Error

### **Why This Happens**
- **Missing Client IDs**: Environment variables not set up
- **Incorrect Redirect URI**: The redirect URI in your request doesn't match what's registered
- **Unverified App**: Google requires verification for external users (production)
- **Missing Test Users**: Your email isn't added as a test user during development

### **Common OAuth Error Messages**
- `Error 400: invalid_request` → Missing or incorrect client ID
- `Error 400: redirect_uri_mismatch` → Redirect URI not registered in Google Console
- `Error 403: access_denied` → App not verified OR user not in test users list

---

## 🏥 Medical App Considerations

### **For Development (Current)**
- Use "External" OAuth consent screen
- Add specific test users (like your email)
- App doesn't need verification for test users

### **For Production Deployment**
- **Google App Verification Required** for external users
- **Privacy Policy Required** (already have: `PRIVACY_PROTECTION_NOTICE.md`)
- **Terms of Service** may be required
- **Domain Verification** required for production domains

---

## 🔧 How to Verify and Fix Redirect URI

### **Step 1: Identify Your Current Redirect URIs** 🕵️

**🚨 IMPORTANT UPDATE**: Google OAuth now rejects custom schemes like `diabeto://auth` with error: "Invalid Origin: must end with a public top-level domain"

**Current Configuration (Updated):**
```
http://localhost:19006            (Web development - primary)
http://localhost:8081             (Web development - alternative)
http://localhost:8082             (Web development - backup)
```

**❌ REMOVE THESE (No longer supported):**
```
diabeto://auth                    (REJECTED by Google OAuth)
```

**Why the Change?**
Google OAuth now requires redirect URIs to end with public top-level domains (.com, .org, etc.). Custom schemes like `diabeto://` are no longer accepted.

### **Step 2: Check What Google Cloud Console Has** 👀

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Navigate to**: APIs & Services → Credentials
3. **Find your OAuth 2.0 Client ID** (Web Application type)
4. **Click on it** to see the current redirect URIs
5. **Compare with the URIs above**

### **Step 3: Fix Redirect URIs in Google Cloud Console** ✅

**For your Web Application OAuth Client:**

1. **Edit your Web Application client** in Google Cloud Console
2. **In "Authorized redirect URIs", add these EXACT URIs:**
   ```
   http://localhost:19006
   http://localhost:8081
   diabeto://auth
   ```
3. **Remove any incorrect URIs** (especially ones with `auth.expo.io` since you're not using Expo Go)
4. **Save the changes**

### **Step 4: Verify Your Current Setup** 🔍

**Check your environment variables:**
```bash
# Run this to see what client ID you're using:
cat .env | grep EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID
```

**Test the redirect URI generation:**
```bash
# Start your development server and check the console
npx expo start --clear
# Look for any OAuth-related logs
```

### **Step 5: Common Redirect URI Mistakes** ❌

**DON'T use these (common mistakes):**
```
❌ https://auth.expo.io/@username/diabeto  (only for Expo Go)
❌ http://localhost:3000                   (wrong port)
❌ https://localhost:19006                 (https instead of http)
❌ diabeto://                             (missing path)
```

**DO use these (correct URIs):**
```
✅ http://localhost:19006                  (web development)
✅ http://localhost:8081                   (alternative web port)
✅ diabeto://auth                          (native development)
```

### **Step 6: Test Your Fix** 🧪

1. **Save changes** in Google Cloud Console
2. **Wait 5-10 minutes** for changes to propagate
3. **Restart your development server:**
   ```bash
   npx expo start --clear
   ```
4. **Test Google Sign-In** in your app
5. **Check for redirect URI mismatch errors**

---

## 🛠️ Quick Debugging Steps

### **1. Check Environment Variables**
```bash
# Run this in your terminal to verify env vars are loaded:
node -e "console.log('Client ID:', process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID)"
```

### **2. Verify OAuth Configuration**
```bash
# Check if your OAuth config is being loaded:
grep -r "EXPO_PUBLIC_GOOGLE_OAUTH" .
```

### **3. Test OAuth Flow**
```bash
# Check redirect URI being used:
node -e "
const { makeRedirectUri } = require('expo-auth-session');
console.log('Redirect URI:', makeRedirectUri({ scheme: 'diabeto', path: 'auth' }));
"
```

---

## ✅ Success Checklist

Before testing Google Sign-In again, verify:

- [ ] ✅ Created `.env` file with actual Google client IDs
- [ ] ✅ Set up OAuth consent screen in Google Cloud Console
- [ ] ✅ Added your email as a test user
- [ ] ✅ Created all three OAuth client IDs (Web, iOS, Android)
- [ ] ✅ Configured correct redirect URIs in Google Cloud Console
- [ ] ✅ Restarted Expo development server after adding `.env`
- [ ] ✅ Verified environment variables are loaded

---

## 🆘 If Still Not Working

### **Check These Common Issues**:

1. **Wrong Client ID Type**: Make sure you're using the Web Application client ID for `EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID`

2. **Redirect URI Mismatch**: The redirect URI must exactly match what's in Google Cloud Console

3. **Test Users**: Your email must be added as a test user in Google Cloud Console

4. **Environment Variables Not Loaded**: Restart Expo server after creating `.env`

5. **Multiple Projects**: Make sure you're configuring the correct Google Cloud project

### **Debug Commands**:
```bash
# Verify environment variables
npx expo config --type introspect | grep GOOGLE

# Check current expo username (for redirect URI)
npx expo whoami

# Check app configuration
npx expo config
```

---

## 📞 Need Help?

If you're still experiencing issues:

1. **Check Google Cloud Console logs** for detailed error messages
2. **Verify your expo username** with `npx expo whoami`
3. **Double-check redirect URIs** match exactly
4. **Ensure test users are properly added**

**Remember**: This is a development setup issue, not a code problem. Once the OAuth credentials are properly configured, your existing Google Sign-In code will work correctly.
