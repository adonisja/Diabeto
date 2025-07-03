// app/(protected)/(caretaker)/invite-patient.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../../firebase/AuthContext';

import commonAppStyles from '../../../assets/styles/protectedStyles/commonAppStyles';
import invitePatientStyles from '../../../assets/styles/protectedStyles/caretakerStyles/invitePatientStyles';
import { LinearGradient } from 'expo-linear-gradient';
import InvitePatientForm from '../../../components/coreComponents/InvitePatientForm'; 

export default function InvitePatientScreen() {
    const { user, userProfile, loadingProfile } = useAuth();
    const router = useRouter();

    // Redirect if not authenticated or not a caretaker/admin
    useEffect(() => {
        if (!loadingProfile) {
            if (!user) {
                router.replace('/(auth)/Signin');
            } else if (userProfile?.role !== 'caretaker' && userProfile?.role !== 'admin') {
                Alert.alert("Access Denied", "You must be a caretaker or admin to invite patients.");
                router.replace('/(protected)/home'); // Or a more specific denied page
            }
        }
    }, [user, userProfile, loadingProfile, router]);

    const handleInvitationSuccess = (patientId: string, relationshipId: string) => {
        // You can add any post-success actions here if needed
        // For example, navigate to a list of 'my patients' or show a specific success message.
        console.log(`Invitation sent successfully for patient: ${patientId}, relationship: ${relationshipId}`);
        // router.push('/(protected)/(caretaker)/my-patients'); // Example navigation
    };

    if (loadingProfile || !user || (userProfile?.role !== 'caretaker' && userProfile?.role !== 'admin')) {
        return (
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={commonAppStyles.backgroundGradient}
            >
                <View style={commonAppStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={commonAppStyles.loadingText}>Loading...</Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={commonAppStyles.backgroundGradient}
            >
                <Stack.Screen options={{ title: 'Invite Patient', headerShown: true, headerTintColor: '#fff', headerStyle: { backgroundColor: '#3b5998' } }} />

                <ScrollView contentContainerStyle={invitePatientStyles.scrollContent}>
                    <View style={invitePatientStyles.container}>
                        <Text style={invitePatientStyles.title}>Invite a Patient</Text>

                        {/* Render the new component */}
                        <InvitePatientForm onInvitationSentSuccess={handleInvitationSuccess} />

                        <TouchableOpacity
                            style={invitePatientStyles.backButton}
                            onPress={() => router.back()}
                        >
                            <Text style={invitePatientStyles.backButtonText}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

