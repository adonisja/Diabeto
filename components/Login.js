import React, { useState } from "react";
import { KeyboardAvoidingView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { loginStyles } from "../assets/styles/loginFormStyle";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { LinearGradient } from "expo-linear-gradient";



export default function Login() {
    const [email, setEmail] = useState(``);
    const [password, setPassword] = useState(``);
    const [errorMessage, setErrorMessage] = useState(``);
    const [isSigningIn, setIsSigningIn] = useState(false);

    const router = useRouter();

    // Handler for email and password login submission
    const onSubmit = async () => {
        setErrorMessage(``);

        if (isSigningIn) {return;}

        setIsSigningIn(true);
        try {
            await auth().signInWithEmailAndPassword(email, password);
        } catch(e) {
           setErrorMessage(`${e.message}`);
           console.error(`Authentication Error: ${e.message}`);
        } finally {
            setIsSigningIn(false);
        }
    }

    // Handler for Google Sign-in
    const handleGoogleSignIn = async () => {
        setErrorMessage(``);

        if (isSigningIn) return;

        setIsSigningIn(true)

        try {
            await GoogleSignin.hasPlayServices({ sho: true });

            // Get the user's token ID from google
            const { idToken } = await GoogleSignin.signIn();

            // Creates a Firebase credential with the Google Id Token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken)

            // Sign the user into Firebase using the Google credential
            await auth().signInWithCredential(googleCredential)

        } catch (e) {
            console.error("Google Sign-In Error:", error);
            // Handle specific Google Sign-In errors (e.g., user cancelled, network issues)
            if (error.code === 'SIGN_IN_CANCELLED') {
                setErrorMessage('Google Sign-In was cancelled.');
            } else if (error.code === 'DEVELOPER_ERROR') {
                 setErrorMessage('Google Sign-In configuration error. Check SHA-1 fingerprint and Web Client ID.');
            }
            else {
                setErrorMessage(error.message || 'An unknown Google sign-in error occurred.');
            }
        } finally {
            setIsSigningIn(false); // Reset loading state
        }
    }
    

    const handleRegisterPress = () => {
        setErrorMessage(``);
        setEmail(``);
        setPassword(``);

        router.push('/register')
    }

    return (
        <View style={loginStyles.container}>
            <KeyboardAvoidingView behavior="padding" style={loginStyles.keyboardAvoidingView} >
                {/* Title for the Login screen */}
                <Text style={loginStyles.title}>Login</Text>

                {/* Email input field */}
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

                {/* Password input field */}
                <TextInput
                    style={loginStyles.input}
                    placeholder="Please Enter Your Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="password"
                    textContentType="password"
                />

                {/* Display error message if present */}
                {errorMessage ? <Text style={loginStyles.errorText}>{errorMessage}</Text> : null}

                {/* Login button */}
                <TouchableOpacity
                    style={loginStyles.button}
                    onPress={onSubmit}
                    disabled={isSigningIn} // Disable button when login is in progress
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#007bff', '#0056b3']} // Darker blue gradient
                        style={StyleSheet.absoluteFillObject} // Fills the TouchableOpacity
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />

                    <Text style={loginStyles.buttonText}>
                        {isSigningIn ? "Logging in..." : "Login"} {/* Dynamic text for loading state */}
                    </Text>
                </TouchableOpacity>

                    

                {/* Google Sign-In Button */}
                <GoogleSigninButton
                    style={loginStyles.googleButton} 
                    size={GoogleSigninButton.Size.Wide} // Wide-button Size
                    color={GoogleSigninButton.Color.Dark} // Or Light
                    onPress={handleGoogleSignIn}
                    disabled={isSigningIn}
                />

                {/* Button to navigate to the registration page */}
                <View style={loginStyles.toggleButtonContainer}>
                    <TouchableOpacity
                        onPress={handleRegisterPress}
                        disabled={isSigningIn} // Disable navigation while login is in progress
                    >
                        <Text style={loginStyles.toggleButtonText}>
                            Don't have an account yet? Click here to Register
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Forgot Password button */}
                <View style={loginStyles.toggleButtonContainer}>
                    <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                        <Text style={loginStyles.toggleButtonText}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}