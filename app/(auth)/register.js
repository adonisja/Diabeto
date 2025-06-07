import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { loginStyles } from '../../assets/styles/loginFormStyle'; // Adjust path as needed

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isRegistering, setIsRegistering] = useState(false); // Loading state for registration

    const router = useRouter(); // Hook to access Expo Router's navigation functions

    // Function to handle email/password registration
    const handleRegister = async () => {
        setErrorMessage(''); // Clear previous error messages
        if (isRegistering) return; // Prevent multiple attempts

        // Basic client-side validation for passwords
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }
        if (password.length < 6) { // Firebase requires a minimum password length of 6 characters
            setErrorMessage("Password must be at least 6 characters long.");
            return;
        }

        setIsRegistering(true); // Set loading state to true
        try {
            // 1. Create the user account with email and password
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user; // Get the newly created user object

            // 2. Send email verification to the newly registered user
            if (user) {
                await user.sendEmailVerification();

                // Inform the user about the verification step
                Alert.alert(
                    "Registration Successful!",
                    "A verification email has been sent to your email address. Please verify your email before logging in.",
                    [{ text: "OK" }]
                );
            } else {
                 Alert.alert("Registration Failed", "No user created after registration attempt.");
            }

            // Redirect the user to the login page after successful registration and email sent
            router.replace('/'); // Navigate to the root path, which is your login page

        } catch (e) {
            // Handle various Firebase authentication errors
            console.error("Registration Error:", e);

            if (e.code === 'auth/email-already-in-use') {
                setErrorMessage('That email address is already in use!');
            } else if (e.code === 'auth/invalid-email') {
                setErrorMessage('That email address is invalid!');
            } else if (e.code === 'auth/weak-password') {
                setErrorMessage('Password is too weak. Please choose a stronger password.');
            }
            else {
                setErrorMessage(e.message || 'An unknown registration error occurred.');
            }
        } finally {
            setIsRegistering(false); // Reset loading state
        }
    };

    // Handler for Google Sign-Up/Sign-In (logic is identical to login's Google handler)
    const handleGoogleSignUp = async () => {
        setErrorMessage("");
        if (isRegistering) { return; } // Use isRegistering to indicate loading

        setIsRegistering(true);
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const { idToken } = await GoogleSignin.signIn();

            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Firebase will automatically create a new user or link to an existing one
            // if an account with the same email already exists
            await auth().signInWithCredential(googleCredential);
            // On success, AuthContext in _layout.js will handle redirect to home
        } catch (error) {
            console.error("Google Sign-Up Error:", error);
            if (error.code === 'SIGN_IN_CANCELLED') {
                setErrorMessage('Google Sign-Up was cancelled.');
            } else if (error.code === 'DEVELOPER_ERROR') {
                 setErrorMessage('Google Sign-Up configuration error. Check SHA-1 fingerprint and Web Client ID.');
            }
            else {
                setErrorMessage(error.message || 'An unknown Google sign-up error occurred.');
            }
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <View style={loginStyles.container}>
            <Text style={loginStyles.title}>Register</Text>
            <TextInput
                style={loginStyles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
            />
            <TextInput
                style={loginStyles.input}
                placeholder="Password (min 6 characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
            />
            <TextInput
                style={loginStyles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
            />
            {errorMessage ? <Text style={loginStyles.errorText}>{errorMessage}</Text> : null}
            <TouchableOpacity
                style={loginStyles.button}
                onPress={handleRegister}
                disabled={isRegistering}
            >
                <Text style={loginStyles.buttonText}>
                    {isRegistering ? "Registering..." : "Register"}
                </Text>
            </TouchableOpacity>

            {/* Google Sign-Up Button */}
            <TouchableOpacity
                style={[loginStyles.button, loginStyles.googleButton, { marginTop: 10 }]}
                onPress={handleGoogleSignUp}
                disabled={isRegistering}
            >
                <Text style={loginStyles.buttonText}>
                    {isRegistering ? "Signing up with Google..." : "Sign up with Google"}
                </Text>
            </TouchableOpacity>

            <View style={loginStyles.toggleButtonContainer}>
                <TouchableOpacity onPress={() => router.replace('/')}>
                    <Text style={loginStyles.toggleButtonText}>
                        Already have an account? Click here to Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}