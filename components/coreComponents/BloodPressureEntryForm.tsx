// components/coreComponents/BloodPressureEntryForm.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../firebase/AuthContext';
import { logAction } from '../../firebase/LogService';
import NotificationService from '../../firebase/NotificationService';
import bloodPressureEntryStyles from '../../assets/styles/componentStyles/bloodPressureEntryStyles';

interface BloodPressureEntryFormProps {
    onSuccess: () => void;
    onClose: () => void;
}

export default function BloodPressureEntryForm({ onSuccess, onClose }: BloodPressureEntryFormProps) {
    const { user, userProfile } = useAuth();
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [heartRate, setHeartRate] = useState('');
    const [measurementContext, setMeasurementContext] = useState<'Morning' | 'Evening' | 'After Exercise' | 'After Medication' | 'Other'>('Morning');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const measurementContextOptions = [
        { value: 'Morning', label: 'Morning', icon: 'sunny-outline', color: '#f39c12' },
        { value: 'Evening', label: 'Evening', icon: 'moon-outline', color: '#9b59b6' },
        { value: 'After Exercise', label: 'After Exercise', icon: 'fitness-outline', color: '#e74c3c' },
        { value: 'After Medication', label: 'After Medication', icon: 'medical-outline', color: '#27ae60' },
        { value: 'Other', label: 'Other', icon: 'ellipsis-horizontal-outline', color: '#95a5a6' },
    ];

    const validateBloodPressure = (sys: string, dia: string) => {
        const systolicNum = parseInt(sys);
        const diastolicNum = parseInt(dia);

        if (isNaN(systolicNum) || isNaN(diastolicNum)) {
            return { isValid: false, message: 'Please enter valid numbers for blood pressure.' };
        }

        if (systolicNum < 70 || systolicNum > 250) {
            return { isValid: false, message: 'Systolic pressure should be between 70-250 mmHg.' };
        }

        if (diastolicNum < 40 || diastolicNum > 150) {
            return { isValid: false, message: 'Diastolic pressure should be between 40-150 mmHg.' };
        }

        if (systolicNum <= diastolicNum) {
            return { isValid: false, message: 'Systolic pressure should be higher than diastolic pressure.' };
        }

        return { isValid: true, message: '' };
    };

    const getBloodPressureStatus = (sys: number, dia: number) => {
        if (sys < 90 || dia < 60) return 'Low';
        if (sys < 120 && dia < 80) return 'Normal';
        if (sys < 130 && dia < 80) return 'Elevated';
        if (sys < 140 || dia < 90) return 'Stage 1 High';
        if (sys < 180 || dia < 120) return 'Stage 2 High';
        return 'Crisis';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Low': return '#3498db';
            case 'Normal': return '#27ae60';
            case 'Elevated': return '#f39c12';
            case 'Stage 1 High': return '#e67e22';
            case 'Stage 2 High': return '#e74c3c';
            case 'Crisis': return '#8e44ad';
            default: return '#95a5a6';
        }
    };

    const getAlertSeverity = (status: string): 'mild' | 'warning' | 'severe' | 'critical' | null => {
        switch (status) {
            case 'Low': return 'warning';
            case 'Elevated': return 'mild';
            case 'Stage 1 High': return 'warning';
            case 'Stage 2 High': return 'severe';
            case 'Crisis': return 'critical';
            default: return null; // Normal doesn't need an alert
        }
    };

    const getAlertDescription = (status: string): string => {
        switch (status) {
            case 'Low': return 'Hypotension - Blood pressure is dangerously low. Monitor for dizziness, fatigue, or fainting.';
            case 'Elevated': return 'Elevated blood pressure - Higher than normal but not yet high blood pressure. Lifestyle changes recommended.';
            case 'Stage 1 High': return 'Stage 1 Hypertension - Consistently elevated blood pressure. Consider lifestyle changes and medication consultation.';
            case 'Stage 2 High': return 'Stage 2 Hypertension - High blood pressure requiring immediate medical attention and likely medication.';
            case 'Crisis': return 'Hypertensive Crisis - Emergency situation requiring immediate medical attention. Call emergency services if symptoms present.';
            default: return '';
        }
    };

    const generateMedicalAlert = async (systolicNum: number, diastolicNum: number, status: string) => {
        const severity = getAlertSeverity(status);
        if (!severity) return; // No alert needed for normal readings

        const heartRateNum = heartRate ? parseInt(heartRate) : undefined;
        let alertValue = `${systolicNum}/${diastolicNum}`;
        if (heartRateNum) {
            alertValue += ` (HR: ${heartRateNum})`;
        }

        // Log the medical alert generation
        await logAction(
            user?.uid || '',
            userProfile?.username || '',
            user?.email || '',
            userProfile?.role || 'patient',
            'MEDICAL_ALERT_GENERATED',
            'success',
            {
                alertType: 'blood_pressure',
                severity: severity,
                readingValue: alertValue,
                status: status,
                systolic: systolicNum,
                diastolic: diastolicNum,
                heartRate: heartRateNum,
                measurementContext: measurementContext,
                notes: notes.trim(),
                description: getAlertDescription(status),
                normalRange: '90-120/60-80 mmHg',
                timestamp: new Date().toISOString(),
                patientId: user?.uid,
                patientName: userProfile?.firstName || userProfile?.username || 'Unknown Patient'
            }
        );

        // In a real implementation, this would also save to Firestore
        // For now, we'll just log it for development
        console.log('Medical Alert Generated:', {
            type: 'blood_pressure',
            severity: severity,
            value: alertValue,
            description: getAlertDescription(status)
        });

        // Send push notification to caretakers
        // In a real implementation, this would query Firestore for all caretakers
        // associated with this patient and send notifications to them
        await NotificationService.sendMedicalAlertNotification(
            user?.uid || '', // In real implementation, this would be caretaker IDs
            {
                patientName: userProfile?.firstName || userProfile?.username || 'Unknown Patient',
                readingType: 'Blood Pressure',
                severity: severity,
                value: alertValue,
                description: getAlertDescription(status)
            }
        );
    };

    const handleSubmit = async () => {
        if (!systolic.trim() || !diastolic.trim()) {
            Alert.alert('Missing Information', 'Please enter both systolic and diastolic blood pressure readings.');
            return;
        }

        const validation = validateBloodPressure(systolic, diastolic);
        if (!validation.isValid) {
            Alert.alert('Invalid Reading', validation.message);
            return;
        }

        if (heartRate.trim() && (parseInt(heartRate) < 40 || parseInt(heartRate) > 200)) {
            Alert.alert('Invalid Heart Rate', 'Heart rate should be between 40-200 BPM if provided.');
            return;
        }

        setIsSubmitting(true);

        try {
            const systolicNum = parseInt(systolic);
            const diastolicNum = parseInt(diastolic);
            const status = getBloodPressureStatus(systolicNum, diastolicNum);

            // Log the blood pressure reading
            await logAction(
                user?.uid || '',
                userProfile?.username || '',
                user?.email || '',
                userProfile?.role || 'patient',
                'BLOOD_PRESSURE_ENTRY_SUCCESS',
                'success',
                {
                    systolic: systolicNum,
                    diastolic: diastolicNum,
                    heartRate: heartRate ? parseInt(heartRate) : undefined,
                    status: status,
                    measurementContext: measurementContext,
                    notes: notes.trim(),
                    entryMethod: 'manual',
                    timestamp: new Date().toISOString()
                }
            );

            // Generate medical alert if reading is abnormal
            await generateMedicalAlert(systolicNum, diastolicNum, status);

            Alert.alert(
                'Reading Saved',
                `Blood pressure: ${systolic}/${diastolic} mmHg\nStatus: ${status}`,
                [{ text: 'OK', onPress: onSuccess }]
            );

        } catch (error) {
            console.error('Error saving blood pressure reading:', error);
            Alert.alert('Error', 'Failed to save blood pressure reading. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentStatus = systolic && diastolic ? getBloodPressureStatus(parseInt(systolic), parseInt(diastolic)) : null;

    return (
        <SafeAreaView style={bloodPressureEntryStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#5c6ac4" />
            
            <KeyboardAvoidingView 
                style={bloodPressureEntryStyles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView 
                    style={bloodPressureEntryStyles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Blood Pressure Input Section */}
                    <View style={bloodPressureEntryStyles.section}>
                        <Text style={bloodPressureEntryStyles.sectionTitle}>🩺 Blood Pressure Reading</Text>
                        
                        <View style={bloodPressureEntryStyles.bpInputContainer}>
                            <View style={bloodPressureEntryStyles.bpInputSection}>
                                <Text style={bloodPressureEntryStyles.bpInputLabel}>Systolic (mmHg)</Text>
                                <TextInput
                                    style={bloodPressureEntryStyles.bpInput}
                                    value={systolic}
                                    onChangeText={setSystolic}
                                    keyboardType="numeric"
                                    placeholder="120"
                                    placeholderTextColor="#bdc3c7"
                                    maxLength={3}
                                />
                            </View>
                            
                            <View style={bloodPressureEntryStyles.bpSeparator}>
                                <Text style={bloodPressureEntryStyles.bpSeparatorText}>/</Text>
                            </View>
                            
                            <View style={bloodPressureEntryStyles.bpInputSection}>
                                <Text style={bloodPressureEntryStyles.bpInputLabel}>Diastolic (mmHg)</Text>
                                <TextInput
                                    style={bloodPressureEntryStyles.bpInput}
                                    value={diastolic}
                                    onChangeText={setDiastolic}
                                    keyboardType="numeric"
                                    placeholder="80"
                                    placeholderTextColor="#bdc3c7"
                                    maxLength={3}
                                />
                            </View>
                        </View>

                        {/* Status Display */}
                        {currentStatus && (
                            <View style={[
                                bloodPressureEntryStyles.statusCard,
                                { borderLeftColor: getStatusColor(currentStatus) }
                            ]}>
                                <Text style={[
                                    bloodPressureEntryStyles.statusText,
                                    { color: getStatusColor(currentStatus) }
                                ]}>
                                    Status: {currentStatus}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Optional Heart Rate */}
                    <View style={bloodPressureEntryStyles.section}>
                        <Text style={bloodPressureEntryStyles.sectionTitle}>💓 Heart Rate (Optional)</Text>
                        <TextInput
                            style={bloodPressureEntryStyles.textInput}
                            value={heartRate}
                            onChangeText={setHeartRate}
                            keyboardType="numeric"
                            placeholder="Enter heart rate (BPM)"
                            placeholderTextColor="#bdc3c7"
                            maxLength={3}
                        />
                    </View>

                    {/* Measurement Context */}
                    <View style={bloodPressureEntryStyles.section}>
                        <Text style={bloodPressureEntryStyles.sectionTitle}>⏰ When was this taken?</Text>
                        <View style={bloodPressureEntryStyles.contextGrid}>
                            {measurementContextOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        bloodPressureEntryStyles.contextCard,
                                        measurementContext === option.value && bloodPressureEntryStyles.contextCardActive
                                    ]}
                                    onPress={() => setMeasurementContext(option.value as any)}
                                >
                                    <Ionicons 
                                        name={option.icon as any} 
                                        size={24} 
                                        color={measurementContext === option.value ? '#fff' : option.color} 
                                    />
                                    <Text style={[
                                        bloodPressureEntryStyles.contextCardText,
                                        measurementContext === option.value && bloodPressureEntryStyles.contextCardTextActive
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Notes Section */}
                    <View style={bloodPressureEntryStyles.section}>
                        <Text style={bloodPressureEntryStyles.sectionTitle}>📝 Notes (Optional)</Text>
                        <TextInput
                            style={bloodPressureEntryStyles.notesInput}
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Any additional notes about this reading..."
                            placeholderTextColor="#bdc3c7"
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Submit Button */}
                    <View style={bloodPressureEntryStyles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                bloodPressureEntryStyles.submitButton,
                                isSubmitting && bloodPressureEntryStyles.submitButtonDisabled
                            ]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <LinearGradient
                                colors={isSubmitting ? ['#bdc3c7', '#95a5a6'] : ['#5c6ac4', '#667eea']}
                                style={bloodPressureEntryStyles.submitButtonGradient}
                            >
                                <Ionicons 
                                    name={isSubmitting ? "time-outline" : "checkmark-circle-outline"} 
                                    size={24} 
                                    color="#fff" 
                                />
                                <Text style={bloodPressureEntryStyles.submitButtonText}>
                                    {isSubmitting ? 'Saving...' : 'Save Reading'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
