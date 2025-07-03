// app/index.tsx

import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../firebase/AuthContext';
import { useState, useEffect } from 'react';
import authCommonStyles from '../assets/styles/authStyles/commonAuthStyles';
import appLandingStyles from '../assets/styles/appLandingStyles';

export default function AppLandingScreen() {
    const router = useRouter();
    const { user, userProfile, loading, loadingProfile } = useAuth();
    
    // State for authentication check timer and status
    const [authCheckComplete, setAuthCheckComplete] = useState(false);
    const [authCheckTimer, setAuthCheckTimer] = useState(5); // 5 second timer
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Toggle this for debugging - set to false to disable auto-redirect
    const AUTO_REDIRECT_ENABLED = false; // Changed to false for debugging

    const isProfileComplete = userProfile && userProfile.profileCompleted;

    // Timer effect for authentication check
    useEffect(() => {
        console.log('Landing Screen - Auth State:', { 
            user: user === null ? 'null' : user === undefined ? 'undefined' : 'authenticated',
            loading, 
            loadingProfile,
            authCheckComplete 
        });

        // Don't start/restart timer if auth check is already complete
        if (authCheckComplete) {
            console.log('Auth check already complete, skipping timer setup');
            return;
        }

        // Check if auth state is definitively known right away
        const isAuthStateKnown = !loading && !loadingProfile;
        
        if (isAuthStateKnown) {
            // Auth state is definitively known - both loading states are false
            console.log('Auth check completed early:', { user: !!user, loading, loadingProfile });
            setAuthCheckComplete(true);
            setAuthCheckTimer(0);
            return; // Don't start timer
        }

        // Start timer only if auth state is not yet known
        console.log('Starting auth check timer...');
        const timer = setInterval(() => {
            setAuthCheckTimer(prev => {
                const newValue = prev - 1;
                if (newValue <= 0) {
                    console.log('Auth check timer expired - completing check');
                    setAuthCheckComplete(true);
                    return 0;
                }
                return newValue;
            });
        }, 1000);

        return () => {
            console.log('Cleaning up auth check timer');
            clearInterval(timer);
        };
    }, [loading, loadingProfile, user, authCheckComplete]); // Added authCheckComplete back to dependencies

    // Auto-redirect effect for authenticated users
    useEffect(() => {
        if (AUTO_REDIRECT_ENABLED && authCheckComplete && user && user.emailVerified && !isRedirecting) {
            console.log('Starting auto-redirect for authenticated user');
            // User is authenticated and verified - auto redirect after a brief moment
            setIsRedirecting(true);
            
            const redirectTimer = setTimeout(() => {
                console.log('Executing auto-redirect');
                try {
                    if (isProfileComplete) {
                        console.log('Redirecting to protected area');
                        router.replace('/(protected)');
                    } else {
                        console.log('Redirecting to profile completion');
                        router.replace('/(protected)/userProfile');
                    }
                } catch (error) {
                    console.error('Auto-redirect failed:', error);
                    // Reset redirecting state if navigation fails
                    setIsRedirecting(false);
                }
            }, 1500); // Give user 1.5 seconds to see the "Continue to App" message

            return () => {
                console.log('Cleaning up auto-redirect timer');
                clearTimeout(redirectTimer);
            };
        }
    }, [authCheckComplete, user, isProfileComplete, router]); // Removed isRedirecting from dependencies

    // Manual navigation when user presses the button
    const handleStartApp = () => {
        if (user && user.emailVerified) {
            if (isProfileComplete) {
                router.push('/(protected)');
            } else {
                router.push('/(protected)/userProfile');
            }
        } else {
            router.push('/(auth)');
        }
    };

    // Determine button text and status based on auth check progress and user state
    const getButtonText = () => {
        if (isRedirecting && AUTO_REDIRECT_ENABLED) return "Redirecting...";
        if (!authCheckComplete) return "Loading...";
        if (!user) return "Get Started";
        if (!user.emailVerified) return "Verify Email";
        if (!isProfileComplete) return "Complete Profile";
        return "Continue to App";
    };

    const getStatusMessage = () => {
        if (isRedirecting && AUTO_REDIRECT_ENABLED) return "Taking you to your dashboard...";
        if (!authCheckComplete && authCheckTimer > 0) {
            return `Checking authentication... (${authCheckTimer}s)`;
        }
        if (!authCheckComplete && authCheckTimer === 0) {
            return "Authentication check complete";
        }
        if (!user) return "Welcome! Ready to get started?";
        if (!user.emailVerified) return "Please verify your email to continue";
        if (!isProfileComplete) return "Profile setup required";
        
        // Use first name if available, otherwise username (username is required at signup)
        const displayName = userProfile?.firstName || userProfile?.username || 'User';
        return `Welcome back, ${displayName}!`;
    };

    const shouldShowActivityIndicator = () => {
        return !authCheckComplete || (isRedirecting && AUTO_REDIRECT_ENABLED);
    };

    // Always show the landing screen
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={authCommonStyles.backgroundGradient}
            >
                <ScrollView contentContainerStyle={appLandingStyles.scrollContainer}>
                    <View style={appLandingStyles.container}>
                        {/* App Logo can go here */}
                        {/* <Image source={require('../../assets/images/app-logo.png')} style={appLandingStyles.logo} /> */}

                        <Text style={appLandingStyles.welcomeText}>
                            Welcome to Diabeto!
                        </Text>
                        <Text style={appLandingStyles.descriptionText}>
                            Your personal assistant for managing diabetes with ease.
                        </Text>

                        {/* Status indicator with activity indicator if loading */}
                        <View style={appLandingStyles.statusContainer}>
                            {shouldShowActivityIndicator() ? (
                                <ActivityIndicator 
                                    size="small" 
                                    color="#fff" 
                                    style={appLandingStyles.activityIndicator}
                                />
                            ) : null}
                            <Text style={appLandingStyles.statusText}>
                                {String(getStatusMessage())}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                authCommonStyles.button,
                                (!authCheckComplete || (isRedirecting && AUTO_REDIRECT_ENABLED)) && appLandingStyles.buttonDisabled
                            ]}
                            onPress={handleStartApp}
                            disabled={!authCheckComplete || (isRedirecting && AUTO_REDIRECT_ENABLED)}
                        >
                            <Text style={authCommonStyles.buttonText}>
                                {String(getButtonText())}
                            </Text>
                        </TouchableOpacity>

                        {/* Debug info for development */}
                        {__DEV__ ? (
                            <View style={appLandingStyles.debugContainer}>
                                <Text style={appLandingStyles.debugText}>
                                    Debug Info:
                                </Text>
                                <Text style={appLandingStyles.debugText}>
                                    User: {user ? 'Yes' : 'No'} | Email Verified: {user?.emailVerified ? 'Yes' : 'No'}
                                </Text>
                                <Text style={appLandingStyles.debugText}>
                                    Profile: {userProfile ? 'Yes' : 'No'} | Profile Complete: {isProfileComplete ? 'Yes' : 'No'}
                                </Text>
                                <Text style={appLandingStyles.debugText}>
                                    Loading Auth: {loading ? 'Yes' : 'No'} | Loading Profile: {loadingProfile ? 'Yes' : 'No'}
                                </Text>
                                <Text style={appLandingStyles.debugText}>
                                    Auth Check Complete: {authCheckComplete ? 'Yes' : 'No'} | Timer: {authCheckTimer}s
                                </Text>
                                <Text style={appLandingStyles.debugText}>
                                    Auto-Redirect: {AUTO_REDIRECT_ENABLED ? 'Enabled' : 'Disabled'} | Redirecting: {isRedirecting ? 'Yes' : 'No'}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </ScrollView>
            </LinearGradient>
        </>
    );
}

// Component-Specific Styles
