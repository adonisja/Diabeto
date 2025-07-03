// app/(protected)/(admin)/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuth } from '../../../firebase/AuthContext';
import { View, ActivityIndicator, Text, Alert } from 'react-native';
import commonAppStyles from '../../../assets/styles/protectedStyles/commonAppStyles';

export default function AdminLayout() {
    const { user, userProfile, loadingProfile } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    // Note: Access control is now handled by the main protected layout
    // Individual screens can implement their own access control if needed
    // This prevents inappropriate alerts during routing transitions
    
    if (loadingProfile || !user) {
        return (
            <View style={commonAppStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={commonAppStyles.loadingText}>Loading...</Text>
            </View>
        );
    }

    // This Stack defines the screens available within the (admin) group
    return (
        <Stack>
            <Stack.Screen
                name="index" // Corresponds to app/(protected)/(admin)/index.tsx
                options={{
                    headerShown: false, // Using custom AppHeader instead
                }}
            />
            {/* Future Admin Screens will be added here as Stack.Screen components */}
            {/* Example:
            <Stack.Screen
                name="user-management" // Corresponds to app/(protected)/(admin)/user-management.tsx
                options={{
                    headerTitle: 'User Management',
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: { backgroundColor: '#3b5998' },
                }}
            />
            <Stack.Screen
                name="relationship-management" // Corresponds to app/(protected)/(admin)/relationship-management.tsx
                options={{
                    headerTitle: 'Relationship Management',
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: { backgroundColor: '#3b5998' },
                }}
            />
            <Stack.Screen
                name="audit-logs" // Corresponds to app/(protected)/(admin)/audit-logs.tsx
                options={{
                    headerTitle: 'Audit Logs',
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: { backgroundColor: '#3b5998' },
                }}
            />
            <Stack.Screen
                name="user-detail/[id]" // Dynamic route for user details
                options={{
                    headerTitle: 'User Details',
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: { backgroundColor: '#3b5998' },
                }}
            />
            */}
        </Stack>
    );
}