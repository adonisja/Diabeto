// app/(auth)/Signup.tsx
import { Text, View, TouchableOpacity, TextInput, Platform, Dimensions, KeyboardAvoidingView, Alert, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router"; // Stack.Screen is defined in _layout.tsx, so no need to import Stack here for local use.
import { auth, db } from "@/firebase/firebaseConfig";
import signinStyles from '../../assets/styles/authStyles/signinStyle';
import { LinearGradient } from "expo-linear-gradient";
import { logAction } from '../../firebase/LogService';
import { getSimpleDeviceId } from '../../utils/deviceInfo';
import GoogleSignInButton, { GoogleSignInUnavailable } from '../../components/coreComponents/GoogleSignInButton';
import { isGoogleAuthConfigured } from '../../firebase/googleAuth';

const { width, height } = Dimensions.get("window");

// Get the app ID from environment variables
const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'default-app-id';

export default function Signup() {
    const router = useRouter();
    const [username, setUserName] = useState(``);
    const [email, setEmail] = useState(``);
    const [password, setPassword] = useState(``);
    const [confirmPassword, setConfirmPassword] = useState(``);
    const [passwordErrorMsg, setPasswordErrorMsg] = useState<string[]>([]);
    const [signupErrorMsg, setSignupErrorMsg] = useState(``);
    const [isRegistering, setIsRegistering] = useState(false);
    const [deviceId, setDeviceId] = useState<string>('unknown-device');

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

    function checkPasswordStrength(): string[] {
        const requirements = {
            minLength: 8,
            requireUpperCase: true,
            requireLowerCase: true,
            requireSpecialChar: true,
            requireNumericChar: true
        };

        const errors: string[] = [];

        if (password.length < requirements.minLength) {
            errors.push(`Passwords must be at least ${requirements.minLength} characters long!`);
        }

        if (requirements.requireUpperCase && !/[A-Z]/.test(password)) {
            errors.push(`Password must contain at least one upper case character!`);
        }

        if (requirements.requireLowerCase && !/[a-z]/.test(password)) {
            errors.push(`Password must contain at least one lower case character!`);
        }

        if (requirements.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
            errors.push(`Password must contain at least one special character (e.g., !@#$%^&*).`);
        }

        if (requirements.requireNumericChar && !/[0-9]/.test(password)) {
            errors.push(`Password must contain at least one number!`);
        }

        return errors;
    }

    // Helper function to check if username is already taken
    const isUsernameAvailable = async (username: string): Promise<boolean> => {
        try {
            const usersCollectionRef = collection(db, 'artifacts', FIREBASE_APP_ID, 'users');
            const q = query(usersCollectionRef, where('username', '==', username.toLowerCase()));
            const querySnapshot = await getDocs(q);
            return querySnapshot.empty; // true if no documents found (username available)
        } catch (error) {
            console.error('Error checking username availability:', error);
            return false; // Assume not available on error to be safe
        }
    };

    const handleSignup = async () => {
        // Clear previous errors
        setSignupErrorMsg(``);
        setPasswordErrorMsg([]);

        // Prevent multiple clicks
        if (isRegistering) { return; }

        // Check if all fields are filled in
        if (username.trim().length === 0 || email.trim().length === 0 || password.length === 0 || confirmPassword.length === 0) {
            setSignupErrorMsg(`All fields are required.`);
            return;
        }

        // Check if Password and Confirm Password matches
        if (password !== confirmPassword) {
            setPasswordErrorMsg([`Passwords do not match.`]);
            return;
        }

        // Runs the gamut of Password checks listed above and returns any errors or an empty array
        const passwordStrengthErrors = checkPasswordStrength();
        if (passwordStrengthErrors.length > 0) {
            setPasswordErrorMsg(passwordStrengthErrors);
            return;
        }

        // Check if username is available
        const usernameAvailable = await isUsernameAvailable(username.trim());
        if (!usernameAvailable) {
            setSignupErrorMsg(`Username "${username.trim()}" is already taken. Please choose a different username.`);
            return;
        }

        setIsRegistering(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
            const user = userCredential.user;

            // Create user profile document in Firestore
            const userDocRef = doc(db, 'artifacts', FIREBASE_APP_ID, 'users', user.uid);
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email || '',
                username: username.trim().toLowerCase(), // Store username in lowercase for consistent querying
                role: 'unverified', // Default role for new users
                profileCompleted: false, // Mark as incomplete for profile completion flow
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            // Log successful signup
            await logAction(
                user.uid,
                username.trim(),
                user.email ?? 'no-email-provided',
                'unverified', // Default role upon signup
                'EMAIL_SIGNUP_SUCCESS',
                'success',
                { username: username.trim(), deviceId, timestamp: new Date().toISOString() }
            );

            // Send verification email
            sendEmailVerification(user)
            Alert.alert(
                "Sign Up Successful!",
                "Your account has been created. Please check your email to verify your account.",
                [{ text: "OK", onPress: () => router.replace('/(auth)/Signin') }] // Redirect to signin after success
            );

        } catch (err: any) {
            let message = 'An unknown error occurred during registration.';
            let code = '';
            if (err.message) {
                message = err.message;
            }
            if (err.code) {
                code = err.code;
                // Map common Firebase auth codes to user-friendly messages
                switch (code) {
                    case 'auth/email-already-in-use':
                        message = 'This email address is already in use.';
                        break;
                    case 'auth/invalid-email':
                        message = 'The email address is not valid.';
                        break;
                    case 'auth/weak-password':
                        message = 'The password is too weak. Please choose a stronger password.';
                        break;
                    default:
                        message = 'Registration failed. Please try again.';
                }
            }
            setSignupErrorMsg(message);
            console.error(`Registration Error: ${message}`);
            // Log failed signup
            await logAction(
                'failed-signup-uid', // Use placeholder UID for failed attempts
                username.trim() || 'unknown-user',
                email,
                'unverified', // Role is unknown/unauthenticated at this stage
                'EMAIL_SIGNUP_FAILURE',
                'failure',
                { error: message, errorCode: code, username: username, deviceId, timestamp: new Date().toISOString() }
            );
        } finally {
            setIsRegistering(false);
        }
    };

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
                    {/* The Stack.Screen for header options is handled by app/(auth)/_layout.tsx */}
                    <Text style={signinStyles.title}>Create New Account</Text>

                    {signupErrorMsg ? <Text style={signinStyles.errorText}>{signupErrorMsg}</Text> : null}
                    {passwordErrorMsg.length > 0 && (
                        <View style={signinStyles.passwordErrorContainer}>
                            {passwordErrorMsg.map((error, index) => (
                                <Text key={index} style={signinStyles.errorText}>
                                    {error}
                                </Text>
                            ))}
                        </View>
                    )}

                    <TextInput
                        style={signinStyles.input}
                        placeholder="Username"
                        placeholderTextColor="#ccc"
                        autoCapitalize="none"
                        textContentType="username"
                        autoComplete="username"
                        value={username}
                        onChangeText={setUserName}
                    />
                    <TextInput
                        style={signinStyles.input}
                        placeholder="Email"
                        placeholderTextColor="#ccc"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        autoComplete="email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={signinStyles.input}
                        placeholder="Password"
                        placeholderTextColor="#ccc"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        textContentType="newPassword"
                        autoComplete="new-password"
                    />
                    <TextInput
                        style={signinStyles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#ccc"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        textContentType="newPassword"
                        autoComplete="new-password"
                    />

                    <TouchableOpacity style={signinStyles.button} onPress={handleSignup} disabled={isRegistering}>
                        <Text style={signinStyles.buttonText}>
                            {isRegistering ? 'Registering...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>

                    {/* Google Sign-In Option */}
                    <View style={{ marginVertical: 8 }}>
                        <Text style={signinStyles.orText}>or</Text>
                    </View>

                    {isGoogleAuthConfigured() ? (
                        <GoogleSignInButton
                            onSignInSuccess={() => {
                                console.log('Google Sign-Up successful');
                                // Navigation handled by AuthContext
                            }}
                            onSignInError={(error) => {
                                setSignupErrorMsg(error);
                            }}
                            disabled={isRegistering}
                        />
                    ) : (
                        <GoogleSignInUnavailable />
                    )}

                    <TouchableOpacity onPress={() => router.push('/(auth)/Signin')}>
                        <Text style={signinStyles.linkText}>
                            Already have an account? Sign In.
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}