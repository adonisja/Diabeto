// app/(protected)/index.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/firebase/AuthContext';
import { useRouter } from 'expo-router';

export default function ProtectedIndex() {
    const { user, userProfile, loading, loadingProfile } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Don't navigate if still loading
        if (loading || loadingProfile) {
            return;
        }

        // If user is not authenticated, redirect to auth
        if (!user || !user.emailVerified) {
            router.replace('/(auth)');
            return;
        }

        // If profile is not complete, redirect to profile completion
        if (!userProfile?.profileCompleted) {
            router.replace('/(protected)/userProfile');
            return;
        }

        // Navigate to appropriate dashboard based on role
        const userRole = userProfile.role;
        console.log(`Landing page: Navigating user with role '${userRole}' to appropriate dashboard`);
        
        switch (userRole) {
            case 'patient':
                router.replace('/(protected)/(patient)');
                break;
            case 'caretaker':
                router.replace('/(protected)/(caretaker)');
                break;
            case 'doctor':
                router.replace('/(protected)/(doctor)');
                break;
            case 'admin':
                router.replace('/(protected)/(admin)');
                break;
            default:
                // If role is undefined or invalid, redirect to profile completion
                router.replace('/(protected)/userProfile');
                break;
        }
    }, [loading, loadingProfile, user, userProfile, router]);

    // This component serves as the landing page for /(protected)
    // It determines where the user should go based on their authentication state and role
    // The loading screen is shown while determining the correct destination
    
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={styles.gradient}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Loading your dashboard...</Text>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },
});
