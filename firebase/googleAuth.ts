// firebase/googleAuth.ts
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { logAction } from './LogService';
import { getSimpleDeviceId } from '../utils/deviceInfo';

// Complete the WebBrowser authentication session
WebBrowser.maybeCompleteAuthSession();

// Google OAuth Configuration
const GOOGLE_OAUTH_CONFIG = {
  // You'll need to replace these with your actual Google OAuth credentials
  // Get these from: https://console.developers.google.com/
  clientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || '', // For web/expo
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID || '', // For iOS
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID || '', // For Android
};

// Google OAuth discovery document
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

// Hook for Google authentication
export const useGoogleAuth = () => {
  const redirectUri = makeRedirectUri({
    scheme: 'diabeto',
    path: 'auth',
  });

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
      // Existing user - log the sign-in
      await logAction(
        user.uid,
        userDoc.data()?.username || user.email?.split('@')[0] || '',
        user.email || '',
        userDoc.data()?.role || 'unverified',
        'GOOGLE_SIGNIN_SUCCESS',
        'success',
        {
          displayName: user.displayName,
          provider: 'google',
          existingUser: true,
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
        redirect_uri: makeRedirectUri({
          scheme: 'diabeto',
          path: 'auth',
        }),
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
