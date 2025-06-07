import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { loginStyles } from '../../assets/styles/loginFormStyle'; // Adjust path as needed

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handlePasswordReset = async () => {
        setMessage('');
        if (!email) {
            setMessage('Please enter your email address.');
            return;
        }
        setLoading(true);
        try {
            await auth().sendPasswordResetEmail(email);
            Alert.alert("Success", "Password reset email sent! Check your inbox.");
            router.replace('/'); // Go back to login after sending email
        } catch (e) {
            console.error("Password Reset Error:", e);
            setMessage(e.message || 'Failed to send password reset email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={loginStyles.container}>
            <Text style={loginStyles.title}>Forgot Password</Text>
            <TextInput
                style={loginStyles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
            />
            {message ? <Text style={loginStyles.errorText}>{message}</Text> : null}
            <TouchableOpacity
                style={loginStyles.button}
                onPress={handlePasswordReset}
                disabled={loading}
            >
                <Text style={loginStyles.buttonText}>
                    {loading ? "Sending..." : "Send Reset Email"}
                </Text>
            </TouchableOpacity>
            <View style={loginStyles.toggleButtonContainer}>
                <TouchableOpacity onPress={() => router.replace('/')}>
                    <Text style={loginStyles.toggleButtonText}>
                        Back to Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}