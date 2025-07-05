// app/(protected)/(doctor)/patient-dosages.tsx

import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    SafeAreaView, 
    Alert,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../firebase/AuthContext';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import { doctorDashboardStyles } from '../../../assets/styles/protectedStyles/doctorStyles/doctorDashboardStyles';

interface Patient {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    prescribedShortActingDosage?: number;
    prescribedLongActingDosage?: number;
    prescribingDoctorId?: string;
}

export default function PatientDosagesScreen() {
    const router = useRouter();
    const { user, userProfile } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            // In a real app, you'd have a way to associate patients with doctors
            // For now, let's get all patient profiles
            const q = query(
                collection(db, 'userProfiles'),
                where('role', '==', 'patient')
            );
            
            const querySnapshot = await getDocs(q);
            const patientsData: Patient[] = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                patientsData.push({
                    uid: doc.id,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    prescribedShortActingDosage: data.prescribedShortActingDosage || 0,
                    prescribedLongActingDosage: data.prescribedLongActingDosage || 0,
                    prescribingDoctorId: data.prescribingDoctorId || ''
                });
            });
            
            setPatients(patientsData);
        } catch (error) {
            console.error('Error fetching patients:', error);
            Alert.alert('Error', 'Failed to fetch patient list.');
        } finally {
            setLoading(false);
        }
    };

    const updatePatientDosage = async (patientId: string, shortActing: string, longActing: string) => {
        const shortActingNum = parseFloat(shortActing);
        const longActingNum = parseFloat(longActing);
        
        if (isNaN(shortActingNum) || isNaN(longActingNum) || shortActingNum < 0 || longActingNum < 0) {
            Alert.alert('Invalid Dosage', 'Please enter valid dosage amounts (numbers only).');
            return;
        }

        if (shortActingNum > 100 || longActingNum > 100) {
            Alert.alert('Invalid Dosage', 'Dosage amounts cannot exceed 100 units.');
            return;
        }

        try {
            setSaving(patientId);
            
            const patientRef = doc(db, 'userProfiles', patientId);
            await updateDoc(patientRef, {
                prescribedShortActingDosage: shortActingNum,
                prescribedLongActingDosage: longActingNum,
                prescribingDoctorId: user?.uid,
                dosageUpdatedAt: serverTimestamp()
            });

            // Update local state
            setPatients(prev => prev.map(patient => 
                patient.uid === patientId 
                    ? { ...patient, prescribedShortActingDosage: shortActingNum, prescribedLongActingDosage: longActingNum }
                    : patient
            ));

            Alert.alert('Success', 'Patient dosages updated successfully.');
        } catch (error) {
            console.error('Error updating dosages:', error);
            Alert.alert('Error', 'Failed to update patient dosages.');
        } finally {
            setSaving(null);
        }
    };

    return (
        <SafeAreaView style={doctorDashboardStyles.outerContainer}>
            <LinearGradient
                colors={['#2E8B57', '#228B22', '#006400']}
                style={doctorDashboardStyles.header}
            >
                <TouchableOpacity onPress={() => router.back()} style={doctorDashboardStyles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={doctorDashboardStyles.headerTitle}>Patient Dosage Management</Text>
                <View style={doctorDashboardStyles.headerSpacer} />
            </LinearGradient>

            <LinearGradient
                colors={['#2E8B57', '#228B22', '#006400']}
                style={doctorDashboardStyles.backgroundGradient}
            >
                {loading ? (
                    <View style={doctorDashboardStyles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={doctorDashboardStyles.loadingText}>Loading patients...</Text>
                    </View>
                ) : (
                    <ScrollView style={doctorDashboardStyles.scrollContainer}>
                        <View style={doctorDashboardStyles.section}>
                            <Text style={doctorDashboardStyles.sectionTitle}>💊 Prescribe Insulin Dosages</Text>
                            <Text style={doctorDashboardStyles.sectionSubtitle}>
                                Set default dosages for your patients. They can override with justification notes.
                            </Text>
                        </View>

                        {patients.map((patient) => (
                            <PatientDosageCard
                                key={patient.uid}
                                patient={patient}
                                onUpdateDosage={updatePatientDosage}
                                saving={saving === patient.uid}
                            />
                        ))}

                        {patients.length === 0 && (
                            <View style={doctorDashboardStyles.emptyState}>
                                <Ionicons name="people-outline" size={64} color="rgba(255,255,255,0.5)" />
                                <Text style={doctorDashboardStyles.emptyText}>No patients found</Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </LinearGradient>
        </SafeAreaView>
    );
}

interface PatientDosageCardProps {
    patient: Patient;
    onUpdateDosage: (patientId: string, shortActing: string, longActing: string) => void;
    saving: boolean;
}

function PatientDosageCard({ patient, onUpdateDosage, saving }: PatientDosageCardProps) {
    const [shortActingDosage, setShortActingDosage] = useState(patient.prescribedShortActingDosage?.toString() || '0');
    const [longActingDosage, setLongActingDosage] = useState(patient.prescribedLongActingDosage?.toString() || '0');

    const handleSave = () => {
        onUpdateDosage(patient.uid, shortActingDosage, longActingDosage);
    };

    return (
        <View style={doctorDashboardStyles.patientCard}>
            <View style={doctorDashboardStyles.patientHeader}>
                <View>
                    <Text style={doctorDashboardStyles.patientName}>
                        {patient.firstName} {patient.lastName}
                    </Text>
                    <Text style={doctorDashboardStyles.patientEmail}>{patient.email}</Text>
                </View>
                <Ionicons name="person-circle" size={40} color="rgba(255,255,255,0.7)" />
            </View>

            <View style={doctorDashboardStyles.dosageRow}>
                <View style={doctorDashboardStyles.dosageInput}>
                    <Text style={doctorDashboardStyles.dosageLabel}>⚡ Short-Acting (units)</Text>
                    <TextInput
                        style={doctorDashboardStyles.dosageTextInput}
                        value={shortActingDosage}
                        onChangeText={setShortActingDosage}
                        placeholder="0"
                        keyboardType="numeric"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                    />
                </View>

                <View style={doctorDashboardStyles.dosageInput}>
                    <Text style={doctorDashboardStyles.dosageLabel}>🕐 Long-Acting (units)</Text>
                    <TextInput
                        style={doctorDashboardStyles.dosageTextInput}
                        value={longActingDosage}
                        onChangeText={setLongActingDosage}
                        placeholder="0"
                        keyboardType="numeric"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                    />
                </View>
            </View>

            <TouchableOpacity
                style={doctorDashboardStyles.saveButton}
                onPress={handleSave}
                disabled={saving}
            >
                {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                        <Text style={doctorDashboardStyles.saveButtonText}>Update Dosages</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
}
