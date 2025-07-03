// components/coreComponents/InvitePatientForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../firebase/AuthContext';
import { db } from '@/firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { logAction } from '@/firebase/LogService';
import commonAppStyles from '../../assets/styles/protectedStyles/commonAppStyles';

interface InvitePatientFormProps {
    onInvitationSentSuccess: (patientId: string, relationshipId: string) => void;
    // You could also add an onError callback if you want the parent to handle errors differently
    // onInvitationError?: (error: string) => void;
}

export default function InvitePatientForm({ onInvitationSentSuccess }: InvitePatientFormProps) {
    const { user, userProfile } = useAuth(); // Assuming userProfile is available through AuthContext
    const [patientEmail, setPatientEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const handleSendInvitation = async () => {
        setErrorMsg(''); // Clear previous errors
        if (!user || !userProfile || isLoading) {
            return;
        }

        if (!patientEmail.trim()) {
            setErrorMsg('Please enter the patient\'s email address.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(patientEmail.trim())) {
            setErrorMsg('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);

        try {
            // Check if patient email already exists in users collection
            const usersQuery = query(
                collection(db, 'users'), 
                where('email', '==', patientEmail.trim().toLowerCase())
            );
            const querySnapshot = await getDocs(usersQuery);
            
            let patientId = null;
            if (!querySnapshot.empty) {
                // Patient exists, get their ID
                patientId = querySnapshot.docs[0].id;
            }

            // Create invitation record in Firestore
            const invitationData = {
                caretakerUid: user.uid,
                caretakerEmail: user.email,
                caretakerName: userProfile.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : user.email,
                patientEmail: patientEmail.trim().toLowerCase(),
                patientUid: patientId, // null if patient doesn't exist yet
                status: 'pending',
                createdAt: serverTimestamp(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                type: 'patient_invitation'
            };

            const docRef = await addDoc(collection(db, 'invitations'), invitationData);
            
            Alert.alert(
                'Invitation Sent!', 
                `Your invitation has been sent to ${patientEmail.trim()}. The patient will be notified and can accept the invitation within 7 days.`
            );
            
            setPatientEmail(''); // Clear input on success

            // Log successful invitation
            await logAction(
                user.uid,
                userProfile.username || user.email?.split('@')[0] || 'unknown-user',
                user.email || 'unknown-email',
                userProfile.role as 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified',
                'CARETAKER_INVITATION_SENT',
                'success',
                { 
                    invitedPatientEmail: patientEmail.trim(),
                    invitationId: docRef.id,
                    patientExists: !!patientId,
                    patientUid: patientId
                }
            );

            // Notify parent component
            onInvitationSentSuccess(patientId || 'pending', docRef.id);

        } catch (error: any) {
            console.error("Error sending invitation:", error);
            setErrorMsg(`An unexpected error occurred: ${error.message}`);
            Alert.alert('Error', `Failed to send invitation: ${error.message}`);

            // Log failed invitation
            await logAction(
                user.uid,
                userProfile?.username || user.email?.split('@')[0] || 'unknown-user',
                user.email || 'unknown-email',
                userProfile?.role as 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified' || 'caretaker',
                'CARETAKER_INVITATION_FAILED',
                'failure',
                { 
                    invitedPatientEmail: patientEmail.trim(),
                    error: error.message 
                }
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Enter the email of the patient you wish to connect with.</Text>

            {errorMsg ? <Text style={commonAppStyles.errorText}>{errorMsg}</Text> : null}

            <TextInput
                style={commonAppStyles.input}
                placeholder="Patient's Email"
                placeholderTextColor="#ccc"
                keyboardType="email-address"
                autoCapitalize="none"
                value={patientEmail}
                onChangeText={setPatientEmail}
            />

            <TouchableOpacity
                style={commonAppStyles.button}
                onPress={handleSendInvitation}
                disabled={isLoading}
            >
                <Text style={commonAppStyles.buttonText}>
                    {isLoading ? 'Sending Invitation...' : 'Send Invitation'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20, // Add padding specific to the form content
    },
    subtitle: {
        fontSize: 16,
        color: '#eee',
        marginBottom: 30,
        textAlign: 'center',
    },
});