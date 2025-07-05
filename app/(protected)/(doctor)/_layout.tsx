// app/(protected)/(doctor)/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuth } from '../../../firebase/AuthContext';
import { View, ActivityIndicator, Text, Alert } from 'react-native';
import commonAppStyles from '../../../assets/styles/protectedStyles/commonAppStyles';

export default function DoctorLayout() {
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

    // This Stack defines the screens available within the (doctor) group
    return (
        <Stack>
            <Stack.Screen
                name="index" // Corresponds to app/(protected)/(doctor)/index.tsx
                options={{
                    headerShown: false, // Using custom AppHeader instead
                }}
            />
            <Stack.Screen
                name="patient-dosages" // Corresponds to app/(protected)/(doctor)/patient-dosages.tsx
                options={{
                    headerShown: false, // Using custom header in the component
                }}
            />
            {/* Future Doctor Screens will be added here as Stack.Screen components */}
            {/* Example:
            <Stack.Screen
                name="patient-management" // Corresponds to app/(protected)/(doctor)/patient-management.tsx
                options={{
                    headerTitle: 'Patient Management',
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: { backgroundColor: '#2E8B57' },
                }}
            />
            <Stack.Screen
                name="medical-records" // Corresponds to app/(protected)/(doctor)/medical-records.tsx
                options={{
                    headerTitle: 'Medical Records',
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: { backgroundColor: '#2E8B57' },
                }}
            />
            */}
        </Stack>
    );
}
