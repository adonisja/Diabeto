// app/(auth)/Signin.tsx
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { useState, useEffect } from "react";
import { KeyboardAvoidingView, View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import { useRouter, Stack } from "expo-router";
import signinStyles from '../../assets/styles/authStyles/signinStyle';
import { LinearGradient } from "expo-linear-gradient";
import { logAction } from '../../firebase/LogService';
import { useAuth } from '../../firebase/AuthContext';
import { getSimpleDeviceId, getDeviceInfo } from '../../utils/deviceInfo';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import GoogleSignInButton, { GoogleSignInUnavailable } from '../../components/coreComponents/GoogleSignInButton';
import { isGoogleAuthConfigured } from '../../firebase/googleAuth';

export default function Signin() {
    const [emailOrUsername, setEmailOrUsername] = useState(``);
    const [password, setPassword] = useState(``);
    const [errorMsg, setErrorMsg] = useState(``);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [deviceId, setDeviceId] = useState<string>('unknown-device');

    const { userProfile } = useAuth();
    const router = useRouter();

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

    // Helper function to check if input is an email
    const isEmailFormat = (input: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
    };

    // Helper function to find email by username
    const findEmailByUsername = async (username: string): Promise<string | null> => {
        try {
            const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'default-app-id';
            const usersCollectionRef = collection(db, 'artifacts', FIREBASE_APP_ID, 'users');
            const q = query(usersCollectionRef, where('username', '==', username.toLowerCase()));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                return userDoc.data().email || null;
            }
            return null;
        } catch (error) {
            console.error('Error finding email by username:', error);
            return null;
        }
    };

    const onSubmit = async () => {
        setErrorMsg(``);

        if (isSigningIn) { return; }
        if (!emailOrUsername.trim() || !password.trim()) {
            setErrorMsg('Please enter both username/email and password');
            return;
        }

        setIsSigningIn(true);
        let emailToUse = emailOrUsername.trim();
        let usernameForLogging = emailOrUsername.trim();

        try {
            // If input is not an email format, try to find the email by username
            if (!isEmailFormat(emailOrUsername)) {
                const foundEmail = await findEmailByUsername(emailOrUsername);
                if (!foundEmail) {
                    throw new Error('Username not found. Please check your username or try using your email address.');
                }
                emailToUse = foundEmail;
                usernameForLogging = emailOrUsername; // Keep the original username for logging
            } else {
                // If it's an email, we'll use the email as username for logging initially
                usernameForLogging = emailOrUsername.split('@')[0];
            }

            const userCredentials = await signInWithEmailAndPassword(auth, emailToUse, password);
            const user = userCredentials.user;

            // Check if email is verified before proceeding
            if (!user.emailVerified) {
                console.log('🔒 Email verification check: User email not verified', user.email);
                
                // Log the failed attempt BEFORE signing out (while user is still authenticated)
                try {
                    console.log('🔒 Attempting to log EMAIL_LOGIN_BLOCKED_UNVERIFIED action');
                    await logAction(
                        user.uid,
                        usernameForLogging,
                        user.email ?? 'no-email-provided',
                        'unverified',
                        'EMAIL_LOGIN_BLOCKED_UNVERIFIED',
                        'failure',
                        { 
                            reason: 'Email not verified',
                            deviceId, 
                            timestamp: new Date().toISOString() 
                        }
                    );
                    console.log('✅ Successfully logged EMAIL_LOGIN_BLOCKED_UNVERIFIED action');
                } catch (logError) {
                    console.error('❌ Error logging EMAIL_LOGIN_BLOCKED_UNVERIFIED action:', logError);
                }
                
                // Sign out the user after logging
                await auth.signOut();
                console.log('🔒 User signed out due to unverified email');
                
                // Show clear message to user
                setErrorMsg(`Please verify your email address before signing in. Check your inbox for a verification email from ${user.email}`);
                console.log('🔒 Error message set for unverified email');
                
                return; // Exit early
            }

            // Fetch user profile to get username and role
            const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'default-app-id';
            const userDocRef = doc(db, 'artifacts', FIREBASE_APP_ID, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            
            let username = 'unknown-user';
            let role: 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified' = 'unverified';
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                username = userData.username || user.email?.split('@')[0] || 'unknown-user';
                role = userData.role || 'unverified';
            }

            await logAction(
                user.uid,
                username,
                user.email ?? 'no-email-provided', 
                role,
                'EMAIL_LOGIN_SUCCESS',
                'success',
                { deviceId, timestamp: new Date().toISOString() }
            );
        } catch (err: any) {
            let message = 'An unknown error occurred';
            let code = '';
            if (err.message) {
                message = err.message;
            }
            if (err.code) {
                code = err.code;
                switch (code) {
                    case 'auth/user-not-found':
                        message = 'Account not found. Please check your username/email or sign up.';
                        break;
                    case 'auth/wrong-password':
                        message = 'Invalid credentials. Please check your username/email and password.';
                        break;
                    case 'auth/invalid-email':
                        message = 'The email address is not valid.';
                        break;
                    case 'auth/user-disabled':
                        message = 'This account has been disabled.';
                        break;
                    default:
                        message = 'Authentication failed. Please try again.';
                }
            }
            setErrorMsg(message);
            console.error(`Authentication Error: ${message}`);

            // For failed logins, use the original input as username for logging
            const failedUsername = isEmailFormat(emailOrUsername) 
                ? emailOrUsername.split('@')[0] 
                : emailOrUsername;
            
            await logAction(
                emailToUse, // Use resolved email as UID since we don't have actual UID for failed login
                failedUsername,
                emailToUse,
                'unverified',
                'EMAIL_LOGIN_FAILURE',
                'failure',
                { error: message, errorCode: code, deviceId, timestamp: new Date().toISOString() }
            );
        } finally {
            setIsSigningIn(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={signinStyles.backgroundGradient} 
            >
                <View style={signinStyles.container}>
                    <Stack.Screen options={{ headerShown: false }} />
                    <Text style={signinStyles.title}>Complete Sign In</Text>

                    {errorMsg ? (
                        <Text
                            style={signinStyles.errorText}
                            testID="signin-error-message"
                            accessibilityRole="alert"
                        >
                            {errorMsg}
                        </Text>
                    ) : null}

                    <TextInput
                        style={signinStyles.input}
                        placeholder="Username or Email"
                        placeholderTextColor="#ccc"
                        keyboardType="default"
                        autoCapitalize="none"
                        textContentType="username"
                        autoComplete="username"
                        value={emailOrUsername}
                        onChangeText={setEmailOrUsername}
                    />
                    <TextInput
                        style={signinStyles.input}
                        placeholder="Password"
                        placeholderTextColor="#ccc"
                        secureTextEntry
                        textContentType="password"
                        autoComplete="current-password"
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={signinStyles.button} onPress={onSubmit} disabled={isSigningIn}>
                        <Text style={signinStyles.buttonText}>
                            {isSigningIn ? 'Signing In...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    {/* Google Sign-In Option */}
                    <View style={{ marginVertical: 8 }}>
                        <Text style={signinStyles.orText}>or</Text>
                    </View>

                    {isGoogleAuthConfigured() ? (
                        <GoogleSignInButton
                            onSignInSuccess={() => {
                                console.log('Google Sign-In successful');
                                // Navigation handled by AuthContext
                            }}
                            onSignInError={(error) => {
                                setErrorMsg(error);
                            }}
                            disabled={isSigningIn}
                        />
                    ) : (
                        <GoogleSignInUnavailable />
                    )}

                    <TouchableOpacity onPress={() => router.push('/(auth)/Signup')}>
                        <Text style={signinStyles.linkText}>Don't have an account? Sign Up</Text> 
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/(auth)/Forgot-Password')}>
                        <Text style={signinStyles.linkText}>Forgot Password?</Text> 
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}