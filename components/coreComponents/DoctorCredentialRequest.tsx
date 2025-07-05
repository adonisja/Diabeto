// components/coreComponents/DoctorCredentialRequest.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert,
    StyleSheet,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../firebase/AuthContext';
import { db } from '@/firebase/firebaseConfig';
import doctorCredentialRequestStyles from '../../assets/styles/componentStyles/doctorCredentialRequestStyles';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { logAction } from '../../firebase/LogService';
import { Ionicons } from '@expo/vector-icons';

interface DoctorCredentialRequestProps {
    onRequestSubmitted?: () => void;
}

export default function DoctorCredentialRequest({ onRequestSubmitted }: DoctorCredentialRequestProps) {
    const { user, userProfile } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state
    const [medicalLicenseNumber, setMedicalLicenseNumber] = useState('');
    const [medicalSchool, setMedicalSchool] = useState('');
    const [graduationYear, setGraduationYear] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [hospitalAffiliation, setHospitalAffiliation] = useState('');
    const [yearsExperience, setYearsExperience] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');

    const handleSubmitRequest = async () => {
        // Validation
        if (!medicalLicenseNumber.trim() || !medicalSchool.trim() || !graduationYear.trim()) {
            Alert.alert('Validation Error', 'Please fill in all required fields (License Number, Medical School, Graduation Year)');
            return;
        }

        if (!/^\d{4}$/.test(graduationYear)) {
            Alert.alert('Validation Error', 'Please enter a valid 4-digit graduation year');
            return;
        }

        if (!yearsExperience.trim() || isNaN(Number(yearsExperience))) {
            Alert.alert('Validation Error', 'Please enter a valid number for years of experience');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create doctor credential request document
            const requestData = {
                userId: user?.uid,
                userEmail: user?.email,
                userName: `${userProfile?.firstName} ${userProfile?.lastName}`.trim() || 'Unknown',
                currentRole: userProfile?.role || 'caretaker',
                requestedRole: 'doctor',
                
                // Credential information
                medicalLicenseNumber: medicalLicenseNumber.trim(),
                medicalSchool: medicalSchool.trim(),
                graduationYear: graduationYear.trim(),
                specialization: specialization.trim() || null,
                hospitalAffiliation: hospitalAffiliation.trim() || null,
                yearsExperience: Number(yearsExperience),
                additionalInfo: additionalInfo.trim() || null,
                
                // Request metadata
                status: 'pending',
                submittedAt: serverTimestamp(),
                reviewedAt: null,
                reviewedBy: null,
                reviewNotes: null,
                documentsUploaded: false, // For future document upload feature
                
                // Tracking
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            // Add to Firestore
            const requestsRef = collection(
                db, 
                `artifacts/${process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'default-app-id'}/doctorRequests`
            );
            
            const docRef = await addDoc(requestsRef, requestData);

            // Log the credential request submission
            await logAction(
                user?.uid ?? 'unknown-user',
                userProfile?.username ?? user?.email?.split('@')[0] ?? 'unknown-user',
                user?.email ?? 'unknown-email',
                userProfile?.role ?? 'caretaker',
                'DOCTOR_CREDENTIAL_REQUEST_SUBMITTED',
                'success',
                {
                    requestId: docRef.id,
                    medicalLicenseNumber: medicalLicenseNumber,
                    medicalSchool: medicalSchool,
                    graduationYear: graduationYear,
                    specialization: specialization || null,
                    yearsExperience: Number(yearsExperience),
                    timestamp: new Date().toISOString()
                }
            );

            Alert.alert(
                'Request Submitted Successfully',
                'Your doctor credential verification request has been submitted. An administrator will review your credentials and contact you with the decision.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Clear form
                            setMedicalLicenseNumber('');
                            setMedicalSchool('');
                            setGraduationYear('');
                            setSpecialization('');
                            setHospitalAffiliation('');
                            setYearsExperience('');
                            setAdditionalInfo('');
                            
                            onRequestSubmitted?.();
                        }
                    }
                ]
            );

        } catch (error: any) {
            console.error('Error submitting doctor credential request:', error);
            Alert.alert('Submission Error', `Failed to submit request: ${error.message}`);

            // Log the failed request
            await logAction(
                user?.uid ?? 'unknown-user',
                userProfile?.username ?? user?.email?.split('@')[0] ?? 'unknown-user',
                user?.email ?? 'unknown-email',
                userProfile?.role ?? 'caretaker',
                'DOCTOR_CREDENTIAL_REQUEST_FAILED',
                'failure',
                {
                    error: error.message,
                    medicalLicenseNumber: medicalLicenseNumber,
                    timestamp: new Date().toISOString()
                }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <LinearGradient
            colors={['#2E8B57', '#228B22', '#006400']}
            style={doctorCredentialRequestStyles.container}
        >
            <ScrollView contentContainerStyle={doctorCredentialRequestStyles.scrollContainer}>
                <View style={doctorCredentialRequestStyles.headerContainer}>
                    <Ionicons name="medical" size={40} color="#fff" />
                    <Text style={doctorCredentialRequestStyles.title}>Doctor Credential Verification</Text>
                    <Text style={doctorCredentialRequestStyles.subtitle}>
                        Submit your medical credentials for administrative review
                    </Text>
                </View>

                <View style={doctorCredentialRequestStyles.formContainer}>
                    <Text style={doctorCredentialRequestStyles.sectionTitle}>Required Information</Text>
                    
                    <TextInput
                        style={doctorCredentialRequestStyles.input}
                        placeholder="Medical License Number *"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={medicalLicenseNumber}
                        onChangeText={setMedicalLicenseNumber}
                        autoCapitalize="characters"
                    />

                    <TextInput
                        style={doctorCredentialRequestStyles.input}
                        placeholder="Medical School/University *"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={medicalSchool}
                        onChangeText={setMedicalSchool}
                        autoCapitalize="words"
                    />

                    <TextInput
                        style={doctorCredentialRequestStyles.input}
                        placeholder="Graduation Year (YYYY) *"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={graduationYear}
                        onChangeText={setGraduationYear}
                        keyboardType="numeric"
                        maxLength={4}
                    />

                    <TextInput
                        style={doctorCredentialRequestStyles.input}
                        placeholder="Years of Experience *"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={yearsExperience}
                        onChangeText={setYearsExperience}
                        keyboardType="numeric"
                        maxLength={2}
                    />

                    <Text style={doctorCredentialRequestStyles.sectionTitle}>Additional Information</Text>

                    <TextInput
                        style={doctorCredentialRequestStyles.input}
                        placeholder="Medical Specialization (Optional)"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={specialization}
                        onChangeText={setSpecialization}
                        autoCapitalize="words"
                    />

                    <TextInput
                        style={doctorCredentialRequestStyles.input}
                        placeholder="Hospital/Clinic Affiliation (Optional)"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={hospitalAffiliation}
                        onChangeText={setHospitalAffiliation}
                        autoCapitalize="words"
                    />

                    <TextInput
                        style={[doctorCredentialRequestStyles.input, doctorCredentialRequestStyles.textArea]}
                        placeholder="Additional Information or Notes (Optional)"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={additionalInfo}
                        onChangeText={setAdditionalInfo}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    <View style={doctorCredentialRequestStyles.noticeContainer}>
                        <Ionicons name="information-circle" size={20} color="#FFD700" />
                        <Text style={doctorCredentialRequestStyles.noticeText}>
                            Your credentials will be reviewed by our medical administrators. 
                            Please ensure all information is accurate and verifiable.
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[doctorCredentialRequestStyles.submitButton, isSubmitting && doctorCredentialRequestStyles.submitButtonDisabled]}
                        onPress={handleSubmitRequest}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="send" size={20} color="#fff" />
                                <Text style={doctorCredentialRequestStyles.submitButtonText}>Submit Request</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}
