// app/(protected)/userProfile.tsx

import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useAuth } from '../../firebase/AuthContext'; 
import { db } from "@/firebase/firebaseConfig"; 
import { doc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { logAction } from '../../firebase/LogService'; 
import { LinearGradient } from "expo-linear-gradient";
import AppHeader from '../../components/coreComponents/AppHeader';

import commonAuthStyles from '../../assets/styles/authStyles/commonAuthStyles'; 
import userProfileStyles from '../../assets/styles/protectedStyles/userProfileStyles'; 

export default function UserProfileScreen() { 
    const { user, userProfile, loading, loadingProfile } = useAuth(); 
    const router = useRouter();

    // 1. State Variables: Now using firstName and lastName
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState<'patient' | 'caretaker' | 'doctor' | 'admin'>('patient'); 
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // 2. Effect for Initializing Form Fields:
    // Populates firstName, lastName, and role from userProfile once loaded.
    useEffect(() => {
        if (userProfile && !loadingProfile) {
            setFirstName(userProfile.firstName || ''); // Initialize with userProfile.firstName
            setLastName(userProfile.lastName || '');   // Initialize with userProfile.lastName
            setRole((userProfile.role as 'patient' | 'caretaker' | 'doctor' | 'admin') || 'patient');
        }
    }, [userProfile, loadingProfile]); // Re-run when userProfile or loadingProfile changes

    // Navigation based on authentication state is handled by app/_layout.tsx (the centralized gatekeeper).

    // 3. `handleSaveProfile` Function: Logic to update user profile in Firestore
    const handleSaveProfile = async () => {
        setErrorMsg(''); // Clear previous errors
        if (!user || isSaving) { // Prevent saving if no user or already saving
            return;
        }

        // 4. Validation: Check both first and last names
        if (!firstName.trim() || !lastName.trim()) {
            setErrorMsg('First name and last name are required.');
            return;
        }

        setIsSaving(true); // Set saving state to true to disable button and show indicator
        try {
            const currentUserId = user.uid;
            const currentUserEmail = user.email ?? 'no-email-provided';

            // Construct the document reference correctly: `artifacts/{appId}/users/{userId}`
            const userDocRef = doc(collection(db, `artifacts/${process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'default-app-id'}/users`), currentUserId);
            
            // 5. Firestore Update: Send firstName and lastName
            await updateDoc(userDocRef, {
                firstName: firstName.trim(), // Send firstName
                lastName: lastName.trim(),   // Send lastName
                role: role,
                updatedAt: serverTimestamp(), // Firestore timestamp
                profileCompleted: true, // This is the flag that `app/_layout.tsx` checks
            });

            // Log the successful profile update action
            await logAction(
                currentUserId,
                userProfile?.username ?? currentUserEmail?.split('@')[0] ?? 'unknown-user',
                currentUserEmail,
                role as 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified',
                'USER_PROFILE_UPDATED',
                'success', // Added outcome for better logging
                { 
                    previousFirstName: userProfile?.firstName ?? null, 
                    newFirstName: firstName, 
                    previousLastName: userProfile?.lastName ?? null, 
                    newLastName: lastName,
                    previousRole: userProfile?.role, 
                    newRole: role 
                } // 6. LogService: Update details
            );

            Alert.alert("Success", "Your profile has been updated!");
            // Data Flow: When `profileCompleted: true` is updated in Firestore,
            // `AuthContext`'s `onSnapshot` listener detects this change.
            // `AuthContext` then updates its `userProfile` state.
            // `app/_layout.tsx` (the gatekeeper) observes the `userProfile` change.
            // Since `userProfile.profileCompleted` is now true, `app/_layout.tsx`
            // will then redirect the user to `/(protected)` (which then leads to their role-based dashboard).
            // No explicit navigation (router.push/replace) is needed here; the centralized logic handles it.

        } catch (error: any) {
            console.error("Error saving profile:", error);
            setErrorMsg(`Failed to save profile: ${error.message || 'Unknown error'}`);

            // Log the failed profile update action
            const currentUserIdForLog = user?.uid ?? 'anonymous';
            const currentUserEmailForLog = user?.email ?? 'anonymous';
            const currentUserUsernameForLog = userProfile?.username ?? currentUserEmailForLog?.split('@')[0] ?? 'unknown-user';
            await logAction(
                currentUserIdForLog,
                currentUserUsernameForLog,
                currentUserEmailForLog,
                (userProfile?.role as 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified') || 'unverified',
                'USER_PROFILE_UPDATE_FAILED',
                'failure', // Added outcome
                { 
                    error: error.message, 
                    firstName: firstName, 
                    lastName: lastName, 
                    role: role 
                } // 7. LogService: Update details for error
            );
        } finally {
            setIsSaving(false); // Reset saving state
        }
    };

    // 8. Initial Loading UI for this component:
    if (!user || loading || loadingProfile) { 
        return (
            <View style={commonAuthStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={commonAuthStyles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    // 9. Main UI for Profile Completion Form:
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={{ flex: 1 }} 
        >
        <View style={userProfileStyles.outerContainer}>
            <AppHeader 
                title="Complete Your Profile"
                subtitle="Set up your account information"
                gradient={['#4c669f', '#3b5998', '#192f6a']}
            />
            
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']} 
                style={commonAuthStyles.backgroundGradient}
            >
                
                <View style={commonAuthStyles.container}>
                    <Stack.Screen options={{ headerShown: false }} /> 

                    {errorMsg ? <Text style={commonAuthStyles.errorText}>{errorMsg}</Text> : null}

                    {/* 10. UI for First Name Input */}
                    <TextInput
                        style={commonAuthStyles.input}
                        placeholder="First Name"
                        placeholderTextColor="#ccc"
                        value={firstName} 
                        onChangeText={setFirstName} 
                    />
                    {/* 11. UI for Last Name Input */}
                    <TextInput
                        style={commonAuthStyles.input}
                        placeholder="Last Name"
                        placeholderTextColor="#ccc"
                        value={lastName} 
                        onChangeText={setLastName} 
                    />

                    <Text style={commonAuthStyles.label}>Select Your Role:</Text>
                    <View style={userProfileStyles.roleSelectionContainer}> 
                        {/* 12. Role Selection: New users can only choose patient/caretaker, admin can assign any role */}
                        {(userProfile?.role === 'admin' ? 
                            ['patient', 'caretaker', 'doctor', 'admin'] : 
                            ['patient', 'caretaker']
                        ).map(r => ( 
                            <TouchableOpacity
                                key={r} 
                                style={[userProfileStyles.roleButton, role === r && userProfileStyles.roleButtonActive]} 
                                onPress={() => setRole(r as 'patient' | 'caretaker' | 'doctor' | 'admin')} 
                            >
                                <Text style={[userProfileStyles.roleButtonText, role === r && userProfileStyles.roleButtonTextActive]}>
                                    {r.charAt(0).toUpperCase() + r.slice(1)} 
                                    {r === 'admin' && ' 🛡️'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    
                    {/* Role Selection Notice */}
                    <Text style={userProfileStyles.securityNotice}>
                        {userProfile?.role === 'admin' ? 
                            '⚠️ Admin Access: You can assign any role including admin.' :
                            'ℹ️ New users can register as Patient or Caretaker. Doctor role requires credential verification by an administrator.'
                        }
                    </Text>

                    <TouchableOpacity style={commonAuthStyles.button} onPress={handleSaveProfile} disabled={isSaving}>
                        <Text style={commonAuthStyles.buttonText}>{isSaving ? 'Saving...' : 'Save Profile'}</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
        </KeyboardAvoidingView>
    );
}

// 13. Local Styles (ensure these are either here or in your commonAuthStyles)
