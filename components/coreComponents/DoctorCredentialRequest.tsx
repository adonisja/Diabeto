// components/coreComponents/DoctorCredentialRequest.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../firebase/AuthContext';
import { db } from '@/firebase/firebaseConfig';
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
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Ionicons name="medical" size={40} color="#fff" />
                    <Text style={styles.title}>Doctor Credential Verification</Text>
                    <Text style={styles.subtitle}>
                        Submit your medical credentials for administrative review
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Required Information</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Medical License Number *"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={medicalLicenseNumber}
                        onChangeText={setMedicalLicenseNumber}
                        autoCapitalize="characters"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Medical School/University *"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={medicalSchool}
                        onChangeText={setMedicalSchool}
                        autoCapitalize="words"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Graduation Year (YYYY) *"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={graduationYear}
                        onChangeText={setGraduationYear}
                        keyboardType="numeric"
                        maxLength={4}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Years of Experience *"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={yearsExperience}
                        onChangeText={setYearsExperience}
                        keyboardType="numeric"
                        maxLength={2}
                    />

                    <Text style={styles.sectionTitle}>Additional Information</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Medical Specialization (Optional)"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={specialization}
                        onChangeText={setSpecialization}
                        autoCapitalize="words"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Hospital/Clinic Affiliation (Optional)"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={hospitalAffiliation}
                        onChangeText={setHospitalAffiliation}
                        autoCapitalize="words"
                    />

                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Additional Information or Notes (Optional)"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={additionalInfo}
                        onChangeText={setAdditionalInfo}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    <View style={styles.noticeContainer}>
                        <Ionicons name="information-circle" size={20} color="#FFD700" />
                        <Text style={styles.noticeText}>
                            Your credentials will be reviewed by our medical administrators. 
                            Please ensure all information is accurate and verifiable.
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                        onPress={handleSubmitRequest}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="send" size={20} color="#fff" />
                                <Text style={styles.submitButtonText}>Submit Request</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginTop: 5,
    },
    formContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        marginTop: 10,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 10,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        paddingTop: 15,
    },
    noticeContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255,215,0,0.1)',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.3)',
        marginBottom: 20,
    },
    noticeText: {
        color: '#FFD700',
        fontSize: 14,
        marginLeft: 10,
        flex: 1,
        lineHeight: 20,
    },
    submitButton: {
        backgroundColor: '#32CD32',
        paddingVertical: 15,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    submitButtonDisabled: {
        backgroundColor: 'rgba(50,205,50,0.5)',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
