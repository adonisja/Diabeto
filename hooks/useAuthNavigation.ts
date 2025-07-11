// hooks/useAuthNavigation.ts

import { useEffect, useState } from 'react';
import { useRouter, useSegments, usePathname } from 'expo-router';
import { Alert } from 'react-native';
import { useAuth } from '../firebase/AuthContext';
import { auth } from '../firebase/firebaseConfig';
import { logAction } from '../firebase/LogService';
import { getSimpleDeviceId } from '../utils/deviceInfo';

export const useAuthNavigation = () => {
  const { user, userProfile, loading, loadingProfile } = useAuth();
  const router = useRouter();
  const segments = useSegments() as string[];
  const currentFullPath = usePathname();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [deviceId, setDeviceId] = useState<string>('unknown-device');

  const isProfileComplete = userProfile && userProfile.profileCompleted;

  // Get device ID on component mount
  useEffect(() => {
    const getDeviceIdAsync = async () => {
      try {
        const id = await getSimpleDeviceId();
        setDeviceId(id);
      } catch (error) {
        console.warn('Could not get device info:', error);
        setDeviceId(`fallback-${Date.now()}`);
      }
    };
    getDeviceIdAsync();
  }, []);

  useEffect(() => {
    // Give Firebase a moment to initialize before starting navigation logic
    if (!hasInitialized) {
      const initTimer = setTimeout(() => {
        setHasInitialized(true);
      }, 1000); // Wait 1 second for Firebase to initialize
      
      return () => clearTimeout(initTimer);
    }

    // Don't do anything while auth or profile is loading, or before initialization
    if (!hasInitialized || loading || loadingProfile) {
      console.log('useAuthNavigation: Waiting for initialization or auth/profile to load...', {
        hasInitialized,
        loading,
        loadingProfile
      });
      return;
    }

    // Only log when auth state has actually resolved
    console.log('useAuthNavigation: Auth state resolved', { 
      user: !!user, 
      userProfile: !!userProfile, 
      isProfileComplete,
      currentPath: currentFullPath 
    });

    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments[0] === '(protected)';
    const isRootLandingPage = segments.length === 0;
    const userEmailForLog = user?.email ?? 'anonymous-email';
    const userUsernameForLog = userProfile?.username ?? user?.email?.split('@')[0] ?? 'anonymous-user';

    // User is not authenticated
    if (!user) {
      // Allow access to landing page and auth routes
      if (!isRootLandingPage && !inAuthGroup) {
        console.log(`useAuthNavigation: Redirecting unauthenticated user from ${currentFullPath} to /(auth)`);
        router.replace('/(auth)');
        logAction(
          'anonymous-uid', 
          'anonymous-user', 
          'anonymous-email', 
          'unverified', 
          'UNAUTHENTICATED_ACCESS_ATTEMPT', 
          'failure', 
          { path: currentFullPath, deviceId, timestamp: new Date().toISOString() }
        );
      }
      return;
    }

    // User is authenticated but email not verified
    // Check both Firebase Auth emailVerified AND user profile emailVerified (for Google OAuth users)
    const isEmailVerified = user.emailVerified || 
      (userProfile?.emailVerified && userProfile?.emailVerificationMethod === 'google_oauth');
    
    if (!isEmailVerified) {
      if (!inAuthGroup) {
        console.log(`useAuthNavigation: User ${userEmailForLog} email not verified, signing out`);
        
        // Log action BEFORE signing out
        logAction(
          user.uid,
          userUsernameForLog,
          userEmailForLog,
          (userProfile?.role as 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified') || 'unverified',
          'UNVERIFIED_USER_LOGOUT',
          'success',
          { reason: 'Email not verified', deviceId, timestamp: new Date().toISOString() }
        );
        
        // Sign out AFTER logging
        auth.signOut();
        router.replace('/(auth)');
        Alert.alert(
          "Email Not Verified",
          "Please verify your email address to access the app. A verification email has been sent to your inbox.",
          [{ text: "OK" }]
        );
      }
      return;
    }

    // User is authenticated and verified but profile incomplete
    if (!isProfileComplete) {
      if (!inProtectedGroup || segments[1] !== 'userProfile') {
        console.log(`useAuthNavigation: User ${userEmailForLog} profile incomplete, redirecting to profile completion`);
        router.replace('/(protected)/userProfile');
        logAction(
          user.uid,
          userUsernameForLog,
          userEmailForLog,
          (userProfile?.role as 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified') || 'unverified',
          'REDIRECT_TO_PROFILE_COMPLETION',
          'success',
          { deviceId, timestamp: new Date().toISOString() }
        );
      }
      return;
    }

    // User is fully authenticated and profile complete
    // If they're on landing page or auth routes, redirect to protected area
    if (isRootLandingPage || inAuthGroup) {
      console.log(`useAuthNavigation: User ${userEmailForLog} fully authenticated, redirecting to protected area`);
      router.replace('/(protected)');
      logAction(
        user.uid,
        userUsernameForLog,
        userEmailForLog,
        userProfile.role as 'patient' | 'caretaker' | 'doctor' | 'admin',
        'LOGIN_REDIRECT_TO_PROTECTED_ROOT',
        'success',
        { targetPath: '/(protected)', deviceId, timestamp: new Date().toISOString() }
      );
    }

  }, [hasInitialized, user, userProfile, loading, loadingProfile, segments, router, isProfileComplete, currentFullPath]);

  // Enhanced email verification check for Google OAuth users
  const isEmailVerified = user?.emailVerified || 
    (userProfile?.emailVerified && userProfile?.emailVerificationMethod === 'google_oauth');

  return {
    user,
    userProfile,
    loading: !hasInitialized || loading || loadingProfile,
    isAuthenticated: !!user && isEmailVerified,
    isProfileComplete
  };
};
