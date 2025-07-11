// app/(protected)/_layout.tsx

import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/firebase/AuthContext';
import { View, ActivityIndicator, Text } from 'react-native';
import protectedLayoutStyles from '../../assets/styles/protectedStyles/protectedLayoutStyles';

export default function ProtectedLayout() {
    const { user, userProfile, loading } = useAuth();

    // Show loading while auth state is being determined
    if (loading) {
        return (
            <View style={protectedLayoutStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={protectedLayoutStyles.loadingText}>Loading...</Text>
            </View>
        );
    }

    // Redirect if user is not authenticated or email not verified
    // Enhanced check for Google OAuth users
    const isEmailVerified = user?.emailVerified || 
        (userProfile?.emailVerified && userProfile?.emailVerificationMethod === 'google_oauth');
    
    if (!user || !isEmailVerified) {
        console.log('ProtectedLayout: User not authenticated or email not verified, redirecting to auth');
        return <Redirect href="/(auth)" />;
    }

    // All role-based navigation logic is handled by the landing page at index.tsx
    // This layout simply provides the Stack navigation structure
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="home" />
            <Stack.Screen name="userProfile" />
            <Stack.Screen name="medical-alert-detail" />
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="(caretaker)" />
            <Stack.Screen name="(doctor)" />
            <Stack.Screen name="(patient)" />
        </Stack>
    );
}

