// app/(protected)/(patient)/PatientInvitationsScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../../firebase/AuthContext'; // Path relative to app/(protected)/(patient)/
import { db } from '../../../firebase/firebaseConfig'; // Path relative to app/(protected)/(patient)/
import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp, DocumentData } from 'firebase/firestore';
import { logAction } from '../../../firebase/LogService'; // Path relative to app/(protected)/(patient)/
import { LinearGradient } from 'expo-linear-gradient';

import commonAppStyles from '../../../assets/styles/protectedStyles/commonAppStyles'; // Path relative to app/(protected)/(patient)/
import invitationStyles from '../../../assets/styles/protectedStyles/invitationStyles' // Path relative to app/(protected)/(patient)/


// Define the shape of an invitation document
interface Invitation {
    id: string; // Document ID from Firestore
    caretakerId: string;
    patientId: string;
    caretakerEmail: string;
    patientEmail: string;
    status: 'pending' | 'accepted' | 'rejected';
    invitedAt: any; // Firebase Timestamp or Date
    // acceptedAt?: any; // Add these fields if you intend to store them and read them for other purposes
    // rejectedAt?: any;
    // updatedAt?: any;
}

export default function PatientInvitationsScreen() {
    const { user, userProfile, loading, loadingProfile } = useAuth(); // Added 'loading'
    const router = useRouter();

    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [isLoadingInvitations, setIsLoadingInvitations] = useState<boolean>(true); // Renamed for clarity
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null); // To track which invitation is being processed
    const [errorMsg, setErrorMsg] = useState<string>('');

    // 1. Redirection/Access Control (Simplified per Centralized Strategy)
    // This screen assumes app/_layout.tsx and app/(protected)/_layout.tsx have already handled
    // authentication and profile completion. This check is a strong fallback.
    useEffect(() => {
        // If user data is still loading or user is not a patient/admin, show immediate loading,
        // the RootLayout will redirect them if they shouldn't be here.
        if (loading || loadingProfile) return;

        // If user somehow gets here without being authenticated (should be rare with root layout)
        if (!user) {
            console.warn('PatientInvitationsScreen: User not authenticated, redirecting (fallback).');
            router.replace('/(auth)'); // Redirect to auth landing
            return;
        }

        // If user is authenticated but not a patient or admin (should be rare with protected layout)
        if (userProfile?.role !== 'patient' && userProfile?.role !== 'admin') {
            console.warn(`PatientInvitationsScreen: Access denied for role: ${userProfile?.role}`);
            Alert.alert("Access Denied", "You do not have permission to view this page.");
            router.replace('/(protected)'); // Redirect to the general protected area, ProtectedLayout will route correctly
            return;
        }

    }, [user, userProfile, loading, loadingProfile, router]);


    // 2. Fetch and Listen for Real-Time Invitation Updates
    // This useEffect now explicitly depends on 'user' being available.
    useEffect(() => {
        if (!user || userProfile?.role === 'unverified') { // Also handle unverified role if it's the case
            setIsLoadingInvitations(false);
            return;
        }

        setErrorMsg(''); // Clear previous errors

        const q = query(
            collection(db, 'relationships'), // 'relationships' collection for invitations
            where('patientId', '==', user.uid), // Filter by current patient's UID
            where('status', '==', 'pending') // Only fetch pending invitations
        );

        // Sets up a real-time listener for the query results.
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedInvitations: Invitation[] = [];
            snapshot.forEach(doc => {
                const data = doc.data() as DocumentData; // Cast to DocumentData to access fields
                fetchedInvitations.push({
                    id: doc.id, // Document ID
                    caretakerId: data.caretakerId,
                    patientId: data.patientId,
                    caretakerEmail: data.caretakerEmail,
                    patientEmail: data.patientEmail,
                    status: data.status,
                    invitedAt: data.invitedAt, // Firestore Timestamp
                });
            });
            setInvitations(fetchedInvitations); // Update state with fetched invitations
            setIsLoadingInvitations(false); // Set loading to false once data is loaded
        }, (error) => {
            console.error("Error fetching invitations:", error);
            setErrorMsg("Failed to load invitations. Please try again.");
            setIsLoadingInvitations(false); // Stop loading even on error
            Alert.alert("Error", "Failed to load invitations. " + error.message); // Provide error message in alert
            
            logAction(
                user.uid,
                userProfile?.username || user.email?.split('@')[0] || 'unknown-user',
                user.email || 'N/A',
                (userProfile?.role as 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified') || 'patient',
                'FETCH_PATIENT_INVITATIONS_FAILED',
                'failure',
                { error: error.message }
            );
        });

        // Cleanup function: This is crucial to prevent memory leaks and unnecessary listeners.
        // It runs when the component unmounts or when the 'user' dependency changes.
        return () => unsubscribe();
    }, [user, userProfile]); // Re-run when user or userProfile (specifically role) changes

    // 3. Function to Update Invitation Status (Accept/Reject)
    const updateInvitationStatus = async (invitationId: string, newStatus: 'accepted' | 'rejected') => {
        if (!user || actionLoadingId === invitationId) return; // Prevent multiple clicks on the same item

        setActionLoadingId(invitationId); // Indicate that this specific invitation is being processed
        setErrorMsg(''); // Clear previous errors

        try {
            const invitationRef = doc(db, 'relationships', invitationId); // Reference to the specific invitation document
            const updateData: { status: string; acceptedAt?: any; rejectedAt?: any; updatedAt: any } = {
                status: newStatus,
                updatedAt: serverTimestamp(), // Update timestamp on server
            };

            if (newStatus === 'accepted') {
                updateData.acceptedAt = serverTimestamp(); // Add acceptedAt timestamp
            } else if (newStatus === 'rejected') {
                updateData.rejectedAt = serverTimestamp(); // Add rejectedAt timestamp
            }

            await updateDoc(invitationRef, updateData); // Perform the Firestore update

            Alert.alert(
                'Success',
                `Invitation ${newStatus} successfully!` // Dynamic success message
            );
            
            // Log the action: PATIENT_INVITATION_ACCEPTED or PATIENT_INVITATION_REJECTED
            await logAction(
                user.uid,
                userProfile?.username || user.email?.split('@')[0] || 'unknown-user',
                user.email || 'N/A',
                (userProfile?.role as 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified') || 'patient',
                `PATIENT_INVITATION_${newStatus.toUpperCase()}`,
                'success', // Outcome
                { 
                    invitationId: invitationId, 
                    newStatus: newStatus,
                    caretakerId: invitations.find(inv => inv.id === invitationId)?.caretakerId || 'N/A' 
                } // Log relevant details
            );

        } catch (error: any) {
            console.error(`Error updating invitation to ${newStatus}:`, error);
            setErrorMsg(`Failed to ${newStatus === 'accepted' ? 'accept' : 'reject'} invitation.`);
            Alert.alert('Error', `Failed to update invitation: ${error.message}`);

            // Log the failure
            await logAction(
                user.uid,
                userProfile?.username || user.email?.split('@')[0] || 'unknown-user',
                user.email || 'N/A',
                (userProfile?.role as 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified') || 'patient',
                `PATIENT_INVITATION_FAILED_TO_${newStatus.toUpperCase()}`,
                'failure',
                { invitationId: invitationId, error: error.message, newStatus: newStatus }
            );
        } finally {
            setActionLoadingId(null); // Reset action loading state
        }
    };

    // 4. Render Item Function for FlatList
    const renderInvitationItem = ({ item }: { item: Invitation }) => (
        <View style={invitationStyles.invitationCard}>
            <Text style={invitationStyles.cardText}>
                <Text style={invitationStyles.cardLabel}>Caretaker:</Text> {item.caretakerEmail}
            </Text>
            {/* Display invitedAt date, safely checking if it's a Firestore Timestamp and converting */}
            {item.invitedAt && typeof item.invitedAt.toDate === 'function' && ( 
                <Text style={invitationStyles.cardText}>
                    <Text style={invitationStyles.cardLabel}>Invited On:</Text> {item.invitedAt.toDate().toLocaleDateString()}
                </Text>
            )}
            <View style={invitationStyles.buttonContainer}>
                <TouchableOpacity
                    style={[commonAppStyles.button, invitationStyles.acceptButton]}
                    onPress={() => updateInvitationStatus(item.id, 'accepted')}
                    // Disable if any action is loading OR if this specific item is loading
                    disabled={actionLoadingId === item.id} 
                >
                    <Text style={commonAppStyles.buttonText}>
                        {actionLoadingId === item.id ? 'Processing...' : 'Accept'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[commonAppStyles.button, invitationStyles.rejectButton]}
                    onPress={() => updateInvitationStatus(item.id, 'rejected')}
                    // Disable if any action is loading OR if this specific item is loading
                    disabled={actionLoadingId === item.id}
                >
                    <Text style={commonAppStyles.buttonText}>
                        {actionLoadingId === item.id ? 'Processing...' : 'Reject'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // 5. Consolidated Main Loading/Error State:
    // This is the primary render gate for the component.
    // It covers initial data loading, user authentication, and role validation.
    // Data Flow: `user`, `userProfile`, `loading`, `loadingProfile` from `useAuth`
    // and `isLoadingInvitations` from local state.
    if (!user || loading || loadingProfile || isLoadingInvitations || (userProfile?.role !== 'patient' && userProfile?.role !== 'admin')) {
        // If user is not authenticated (should be handled by root layout, but fallback)
        // Or if main auth/profile data is loading
        // Or if invitations themselves are loading
        // Or if user's role is not patient/admin
        return (
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={commonAppStyles.backgroundGradient}
            >
                <View style={commonAppStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={commonAppStyles.loadingText}>
                        {(!user || loading || loadingProfile) ? "Checking access..." : "Loading invitations..."}
                    </Text>
                </View>
            </LinearGradient>
        );
    }

    // 6. Main Content Rendering:
    // This block is rendered only when all necessary data is loaded and conditions are met.
    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={commonAppStyles.backgroundGradient}
        >
            <Stack.Screen options={{ title: 'My Invitations', headerShown: true, headerTintColor: '#fff', headerStyle: { backgroundColor: '#3b5998' } }} />

            <View style={invitationStyles.container}>
                <Text style={invitationStyles.title}>Pending Invitations</Text>

                {errorMsg ? <Text style={commonAppStyles.errorText}>{errorMsg}</Text> : null}

                {invitations.length === 0 ? (
                    <View style={invitationStyles.emptyContainer}>
                        <Text style={invitationStyles.emptyText}>No pending invitations found.</Text>
                        <TouchableOpacity style={invitationStyles.backButton} onPress={() => router.back()}>
                            <Text style={invitationStyles.backButtonText}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={invitations}
                        keyExtractor={(item) => item.id}
                        renderItem={renderInvitationItem}
                        contentContainerStyle={invitationStyles.listContentContainer}
                    />
                )}
            </View>
        </LinearGradient>
    );
}