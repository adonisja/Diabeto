// firebase/googleAuth.ts
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { logAction } from './LogService';
import { getSimpleDeviceId } from '../utils/deviceInfo';
import Constants from 'expo-constants';

// Complete the WebBrowser authentication session
WebBrowser.maybeCompleteAuthSession();

// Get environment variables from Expo Constants (same pattern as firebaseConfig.ts)
const getOAuthEnvVar = (key: string): string => {
  // First try to get from Expo Constants extra
  const extraValue = Constants.expoConfig?.extra?.[key];
  if (extraValue) return extraValue;
  
  // Then try process.env (for development)
  const envValue = process.env[`EXPO_PUBLIC_${key.toUpperCase()}`];
  if (envValue) return envValue;
  
  throw new Error(`OAuth environment variable ${key} is required but not found. Check your app.config.js and .env file.`);
};

// Google OAuth Configuration
const GOOGLE_OAUTH_CONFIG = {
  // Using Expo Constants for client-side environment variable access
  clientId: getOAuthEnvVar('googleOAuthClientId'), // For web/expo
  iosClientId: getOAuthEnvVar('googleOAuthIosClientId'), // For iOS
  androidClientId: getOAuthEnvVar('googleOAuthAndroidClientId'), // For Android
};

// Debug logging in development
if (__DEV__) {
  console.log('🔐 Google OAuth Config loaded:', {
    clientId: GOOGLE_OAUTH_CONFIG.clientId ? `${GOOGLE_OAUTH_CONFIG.clientId.substring(0, 12)}...` : '❌ Missing',
    iosClientId: GOOGLE_OAUTH_CONFIG.iosClientId ? `${GOOGLE_OAUTH_CONFIG.iosClientId.substring(0, 12)}...` : '❌ Missing',
    androidClientId: GOOGLE_OAUTH_CONFIG.androidClientId ? `${GOOGLE_OAUTH_CONFIG.androidClientId.substring(0, 12)}...` : '❌ Missing',
  });
}

// Google OAuth discovery document
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

// Hook for Google authentication
export const useGoogleAuth = () => {
  // Force localhost redirect URI to avoid Google's custom scheme restriction
  // In development, use localhost; in production, could use a proper domain
  const redirectUri = __DEV__ 
    ? 'http://localhost:19006' // Force localhost in development
    : makeRedirectUri(); // Use default in production (if needed)

  // Log the redirect URI being used for debugging
  if (__DEV__) {
    console.log('🔗 OAuth Redirect URI:', redirectUri);
  }

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GOOGLE_OAUTH_CONFIG.clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: 'code',
      extraParams: {},
    },
    discovery
  );

  return { request, response, promptAsync };
};

// Sign in with Google using Firebase
export const signInWithGoogle = async (accessToken: string): Promise<{success: boolean, user?: any, error?: string}> => {
  try {
    // Create a Google credential with the token
    const credential = GoogleAuthProvider.credential(null, accessToken);
    
    // Sign in with the credential
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    // Get device ID for logging
    const deviceId = await getSimpleDeviceId();

    // Check if this is a new user and create their profile
    const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'default-app-id';
    const userDocRef = doc(db, 'artifacts', FIREBASE_APP_ID, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create new user profile for Google sign-in
      // IMPORTANT: Google OAuth users have verified emails by default
      const newUserProfile = {
        uid: user.uid,
        email: user.email || '',
        username: user.email?.split('@')[0] || '', // Use email prefix as default username
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        role: 'unverified' as const,
        profileCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        authProvider: 'google', // Track authentication method
        photoURL: user.photoURL || null,
        emailVerified: true, // Google OAuth users have verified emails
        emailVerifiedAt: new Date(), // Track when email was verified
        emailVerificationMethod: 'google_oauth', // Track verification method
      };

      await setDoc(userDocRef, newUserProfile);

      // Log the successful Google sign-up
      await logAction(
        user.uid,
        newUserProfile.username,
        user.email || '',
        'unverified',
        'GOOGLE_SIGNUP_SUCCESS',
        'success',
        {
          displayName: user.displayName,
          provider: 'google',
          profileCompleted: false,
          deviceId: deviceId,
        }
      );
    } else {
      // Existing user - ensure email verification status is correct for Google OAuth
      const existingUserData = userDoc.data();
      
      // Update profile if email verification info is missing (for existing Google users)
      if (!existingUserData?.emailVerified || existingUserData?.authProvider !== 'google') {
        const updateData: any = {
          updatedAt: new Date(),
          authProvider: 'google',
          emailVerified: true, // Google OAuth users always have verified emails
        };
        
        // Only set these if they don't exist
        if (!existingUserData?.emailVerifiedAt) {
          updateData.emailVerifiedAt = new Date();
          updateData.emailVerificationMethod = 'google_oauth';
        }
        
        await updateDoc(userDocRef, updateData);
      }
      
      // Log the sign-in
      await logAction(
        user.uid,
        existingUserData?.username || user.email?.split('@')[0] || '',
        user.email || '',
        existingUserData?.role || 'unverified',
        'GOOGLE_SIGNIN_SUCCESS',
        'success',
        {
          displayName: user.displayName,
          provider: 'google',
          existingUser: true,
          emailVerified: true, // Google users always have verified emails
          deviceId: deviceId,
        }
      );
    }

    return { success: true, user };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    
    // Log the failed attempt
    try {
      const deviceId = await getSimpleDeviceId();
      await logAction(
        'anonymous',
        'anonymous',
        'anonymous',
        null,
        'GOOGLE_SIGNIN_FAILED',
        'failure',
        {
          error: error.message,
          errorCode: error.code,
          provider: 'google',
          deviceId: deviceId,
        }
      );
    } catch (logError) {
      console.error('Failed to log Google sign-in error:', logError);
    }

    return { 
      success: false, 
      error: error.message || 'Failed to sign in with Google. Please try again.' 
    };
  }
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code: string): Promise<string | null> => {
  try {
    const tokenEndpoint = 'https://oauth2.googleapis.com/token';
    
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_OAUTH_CONFIG.clientId,
        code,
        grant_type: 'authorization_code',
        redirect_uri: __DEV__ ? 'http://localhost:19006' : makeRedirectUri(), // Match the same redirect URI
      }).toString(),
    });

    const data = await response.json();
    
    if (data.access_token) {
      return data.access_token;
    } else {
      console.error('No access token in response:', data);
      return null;
    }
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
};

// Configuration check for Google OAuth
export const isGoogleAuthConfigured = (): boolean => {
  return !!(
    GOOGLE_OAUTH_CONFIG.clientId &&
    GOOGLE_OAUTH_CONFIG.clientId !== ''
  );
};
