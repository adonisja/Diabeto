// app/(protected)/_layout.tsx

import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/firebase/AuthContext';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export default function ProtectedLayout() {
    const { user, loading } = useAuth();

    // Show loading while auth state is being determined
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    // Redirect if user is not authenticated or email not verified
    if (!user || !user.emailVerified) {
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
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="(caretaker)" />
            <Stack.Screen name="(doctor)" />
            <Stack.Screen name="(patient)" />
        </Stack>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
});
// If you don't have them, you'd need to create them:
// const commonAppStyles = StyleSheet.create({
//     loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
//     loadingText: { marginTop: 10, fontSize: 18, color: '#333' },
// });