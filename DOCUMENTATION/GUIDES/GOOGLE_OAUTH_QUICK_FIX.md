# 🚨 QUICK FIX: Google OAuth Erro3. Create **Web Application** client:
   - Authorized redirect URIs: `http://localhost:19006`, `http://localhost:8081`, `http://localhost:8082`
   - **⚠️ IMPORTANT**: Do NOT add `diabeto://auth` (Google now rejects custom schemes)
**Your Error**: `Authorization Error: invalid_request` - App doesn't comply with Google's Auth 2.0 policy

**Latest Update**: ✅ Custom scheme rejection fix applied (July 2025)

**Cross-References**:
- **Complete Setup Guide**: [GOOGLE_SIGNIN_SETUP.md](./GOOGLE_SIGNIN_SETUP.md)
- **Detailed Troubleshooting**: [GOOGLE_OAUTH_TROUBLESHOOTING.md](./GOOGLE_OAUTH_TROUBLESHOOTING.md)
- **Bug Documentation**: See Bug #76 in `SUMMARIES/BUGS_AND_FIXES.md`

## Recent Fix Applied ✅

**Issue**: Google OAuth now rejects custom schemes like `diabeto://auth`
**Solution**: Code updated to use localhost URLs only in development

### Code Changes Made:
- ✅ Updated `firebase/googleAuth.ts` to use localhost redirect URIs
- ✅ Commented out custom scheme in `app.config.js`
- ✅ Both auth functions now use consistent redirect URIs

## Immediate Action Required (5 minutes)

### 1. Create Environment File
```bash
cd /Users/akkeem/Documents/ClassAssignments/GitHub_Projects/Diabeto
cp .env.template .env
```

### 2. Get Google OAuth Credentials
1. Go to: https://console.cloud.google.com/
2. Create/select project
3. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
4. Create **Web Application** client:
   - Authorized redirect URIs: `http://localhost:19006`
5. Copy the Client ID

### 3. Update .env File
```bash
# Edit .env and replace this line:
EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
```

### 4. Set Up OAuth Consent Screen
1. Go to "OAuth consent screen" in Google Cloud Console
2. Choose "External"
3. Fill in app name: `Diabeto`
4. **IMPORTANT**: Add your email `nicoyhunt@gmail.com` as a test user

### 5. Restart Server
```bash
npx expo start --clear
```

## That's It!
Google Sign-In should now work. 

**For detailed help**: See [GOOGLE_OAUTH_TROUBLESHOOTING.md](./GOOGLE_OAUTH_TROUBLESHOOTING.md)
**For complete setup**: See [GOOGLE_SIGNIN_SETUP.md](./GOOGLE_SIGNIN_SETUP.md)
