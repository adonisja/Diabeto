// app/(auth)/Forgot-Password.tsx
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, Stack } from "expo-router";
import { auth } from "@/firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth"; // Import sendPasswordResetEmail
import { logAction } from '../../firebase/LogService'; // Import logAction
import { LinearGradient } from "expo-linear-gradient";
import commonAuthStyles from '../../assets/styles/authStyles/commonAuthStyles'; // Reuse common styles


export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const router = useRouter();

    const handlePasswordReset = async () => {
        setMessage(''); // Clear previous messages
        if (!email.trim()) {
            setMessage('Please enter your email address.');
            return;
        }

        setIsSending(true);
        try {
            await sendPasswordResetEmail(auth, email.trim());

            setMessage('Password reset email sent! Check your inbox.');
            Alert.alert(
                "Password Reset",
                "A password reset link has been sent to your email. Please check your inbox (and spam folder).",
                [{ text: "OK", onPress: () => router.replace('/(auth)/Signin') }]
            );

            // Log successful password reset email request
            await logAction(
                email, // Use email as actor ID
                email,
                email,
                'unverified', // Role is unknown/unauthenticated
                'PASSWORD_RESET_EMAIL_SENT',
                'success',
                {}
            );

        } catch (error: any) {
            console.error("Password Reset Error:", error);
            let errorMessage = "Failed to send reset email. Please try again.";
            let errorCode = '';

            if (error.message) {
                errorMessage = error.message;
            }
            if (error.code) {
                errorCode = error.code;
                switch (error.code) {
                    case 'auth/invalid-email':
                        errorMessage = 'The email address is not valid.';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'No user found with that email address.';
                        break;
                    // Add other Firebase specific error codes if needed
                    default:
                        errorMessage = 'Failed to send reset email. Please try again.';
                }
            }
            setMessage(errorMessage);

            // Log failed password reset email request
            await logAction(
                email, // Use email as actor ID
                email,
                email,
                'unverified',
                'PASSWORD_RESET_EMAIL_FAILED',
                'failure',
                { error: errorMessage, errorCode: errorCode }
            );

        } finally {
            setIsSending(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={commonAuthStyles.backgroundGradient}
            >
                <View style={commonAuthStyles.container}>
                    <Stack.Screen options={{ headerShown: false }} />
                    <Text style={commonAuthStyles.title}>Forgot Password</Text>

                    {message ? <Text style={commonAuthStyles.errorText}>{message}</Text> : null}

                    <TextInput
                        style={commonAuthStyles.input}
                        placeholder="Enter your email address"
                        placeholderTextColor="#ccc"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TouchableOpacity style={commonAuthStyles.button} onPress={handlePasswordReset} disabled={isSending}>
                        <Text style={commonAuthStyles.buttonText}>
                            {isSending ? 'Sending...' : 'Send Reset Email'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/(auth)/Signin')}>
                        <Text style={commonAuthStyles.linkText}>Back to Sign In</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}