// components/coreComponents/HeartRateEntryForm.tsx
import React, { useState, useEffect } from 'react';
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
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { logAction } from '../../firebase/LogService';
import { getSimpleDeviceId } from '../../utils/deviceInfo';
import heartRateEntryStyles from '../../assets/styles/componentStyles/heartRateEntryStyles';

interface HeartRateEntryFormProps {
    onSuccess: () => void;
    onClose: () => void;
}

export default function HeartRateEntryForm({ onSuccess, onClose }: HeartRateEntryFormProps) {
    const { user, userProfile } = useAuth();
    const [heartRate, setHeartRate] = useState('');
    const [measuredAt, setMeasuredAt] = useState('now');
    const [measurementType, setMeasurementType] = useState<'resting' | 'active' | 'post_exercise' | 'stress'>('resting');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCountingPulse, setIsCountingPulse] = useState(false);
    const [pulseCount, setPulseCount] = useState(0);
    const [countdownSeconds, setCountdownSeconds] = useState(0);

    // Pulse counting functionality
    const startPulseCount = (duration: number = 15) => {
        setIsCountingPulse(true);
        setPulseCount(0);
        setCountdownSeconds(duration);
        
        const countdown = setInterval(() => {
            setCountdownSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    setIsCountingPulse(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const stopPulseCount = () => {
        setIsCountingPulse(false);
        setCountdownSeconds(0);
        
        // Calculate heart rate based on count and duration
        const duration = isCountingPulse ? (15 - countdownSeconds) : 15;
        const calculatedHR = Math.round((pulseCount / duration) * 60);
        setHeartRate(calculatedHR.toString());
    };

    const addPulseCount = () => {
        if (isCountingPulse) {
            setPulseCount(prev => prev + 1);
        }
    };

    const validateForm = (): boolean => {
        const hrNum = parseInt(heartRate);
        
        if (!heartRate || isNaN(hrNum) || hrNum < 30 || hrNum > 220) {
            Alert.alert('Invalid Heart Rate', 'Please enter a valid heart rate between 30-220 BPM.');
            return false;
        }
        
        return true;
    };

    const getHeartRateStatus = (hr: number): { status: string; color: string; emoji: string } => {
        if (hr < 60) return { status: 'Low', color: '#2196F3', emoji: '🔵' };
        if (hr <= 100) return { status: 'Normal', color: '#4CAF50', emoji: '🟢' };
        if (hr <= 140) return { status: 'Elevated', color: '#FF9800', emoji: '🟡' };
        return { status: 'High', color: '#F44336', emoji: '🔴' };
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        setLoading(true);
        
        try {
            const deviceInfo = Platform.select({
                ios: 'iOS Device',
                android: 'Android Device',
                default: 'Unknown Device'
            });

            const deviceId = await getSimpleDeviceId();
            const hrNum = parseInt(heartRate);
            const hrStatus = getHeartRateStatus(hrNum);

            const heartRateRecord = {
                heartRate: hrNum,
                measuredAt: measuredAt === 'now' ? new Date() : new Date(measuredAt),
                measurementType,
                status: hrStatus.status.toLowerCase(),
                notes: notes.trim(),
                userId: user?.uid,
                userEmail: user?.email,
                userName: userProfile?.username || '',
                device: deviceInfo,
                deviceId,
                createdAt: new Date(),
                updatedAt: new Date(),
                // Additional metadata
                userGender: userProfile?.gender || null,
                measurementMethod: pulseCount > 0 ? 'pulse_count' : 'manual_entry',
                pulseCountData: pulseCount > 0 ? { count: pulseCount, duration: 15 } : null,
            };

            // Save to Firestore
            const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'default-app-id';
            const recordRef = doc(collection(db, 'artifacts', FIREBASE_APP_ID, 'heartRateReadings'));
            await setDoc(recordRef, heartRateRecord);

            // Log the action
            await logAction(
                user?.uid || '',
                userProfile?.username || '',
                user?.email || '',
                userProfile?.role || 'patient',
                'HEART_RATE_ENTRY_SUCCESS',
                'success',
                {
                    heartRate: hrNum,
                    status: hrStatus.status,
                    measurementType,
                    measurementMethod: heartRateRecord.measurementMethod,
                    hasNotes: !!notes.trim(),
                    deviceId,
                }
            );

            Alert.alert(
                'Heart Rate Recorded! ❤️', 
                `${hrNum} BPM (${hrStatus.status} ${hrStatus.emoji})\n\nGreat job staying on top of your cardiovascular health!`,
                [
                    {
                        text: 'View Trends',
                        onPress: () => {
                            onSuccess();
                            // Could navigate to history view
                        }
                    },
                    {
                        text: 'Add Another',
                        onPress: () => {
                            setHeartRate('');
                            setNotes('');
                            setPulseCount(0);
                        }
                    }
                ]
            );

            onSuccess();

        } catch (error: any) {
            console.error('Error saving heart rate reading:', error);
            
            await logAction(
                user?.uid || '',
                userProfile?.username || '',
                user?.email || '',
                userProfile?.role || 'patient',
                'HEART_RATE_ENTRY_ERROR',
                'failure',
                {
                    error: error.message,
                    heartRate: parseInt(heartRate),
                    measurementType,
                }
            );

            Alert.alert(
                'Error Saving Reading',
                'Failed to save your heart rate reading. Please check your connection and try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const renderPulseCounter = () => (
        <View style={heartRateEntryStyles.pulseCounterContainer}>
            <Text style={heartRateEntryStyles.pulseCounterTitle}>📱 Built-in Pulse Counter</Text>
            <Text style={heartRateEntryStyles.pulseCounterInstructions}>
                Place your finger on your wrist or neck to feel your pulse, then tap the button for each beat
            </Text>
            
            <View style={heartRateEntryStyles.counterDisplay}>
                <View style={heartRateEntryStyles.countDisplay}>
                    <Text style={heartRateEntryStyles.countValue}>{pulseCount}</Text>
                    <Text style={heartRateEntryStyles.countLabel}>beats</Text>
                </View>
                
                {countdownSeconds > 0 && (
                    <View style={heartRateEntryStyles.timerDisplay}>
                        <Text style={heartRateEntryStyles.timerValue}>{countdownSeconds}s</Text>
                        <Text style={heartRateEntryStyles.timerLabel}>remaining</Text>
                    </View>
                )}
            </View>

            <View style={heartRateEntryStyles.counterControls}>
                {!isCountingPulse ? (
                    <TouchableOpacity
                        style={heartRateEntryStyles.startCountButton}
                        onPress={() => startPulseCount(15)}
                    >
                        <Ionicons name="play" size={24} color="#fff" />
                        <Text style={heartRateEntryStyles.startCountText}>Start 15s Count</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={heartRateEntryStyles.activeCountingContainer}>
                        <TouchableOpacity
                            style={heartRateEntryStyles.pulseButton}
                            onPress={addPulseCount}
                        >
                            <Ionicons name="heart" size={32} color="#fff" />
                            <Text style={heartRateEntryStyles.pulseButtonText}>TAP FOR EACH BEAT</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={heartRateEntryStyles.stopCountButton}
                            onPress={stopPulseCount}
                        >
                            <Text style={heartRateEntryStyles.stopCountText}>Stop & Calculate</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {pulseCount > 0 && !isCountingPulse && (
                <View style={heartRateEntryStyles.calculatedResult}>
                    <Text style={heartRateEntryStyles.calculatedLabel}>Calculated Heart Rate:</Text>
                    <Text style={heartRateEntryStyles.calculatedValue}>{heartRate} BPM</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={heartRateEntryStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#e91e63" />
            
            {/* Header */}
            <LinearGradient
                colors={['#e91e63', '#f06292']}
                style={heartRateEntryStyles.headerGradient}
            >
                <View style={heartRateEntryStyles.header}>
                    <TouchableOpacity onPress={onClose} style={heartRateEntryStyles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={heartRateEntryStyles.headerTitle}>Log Heart Rate</Text>
                    <View style={heartRateEntryStyles.headerSpacer} />
                </View>
            </LinearGradient>

            <KeyboardAvoidingView 
                style={heartRateEntryStyles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView 
                    style={heartRateEntryStyles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Welcome Section */}
                    <LinearGradient
                        colors={['#ff9a9e', '#fecfef']}
                        style={heartRateEntryStyles.welcomeCard}
                    >
                        <Ionicons name="heart" size={32} color="#e91e63" />
                        <Text style={heartRateEntryStyles.welcomeTitle}>Heart Rate Entry ❤️</Text>
                        <Text style={heartRateEntryStyles.welcomeMessage}>
                            Use our built-in pulse counter or enter your reading manually
                        </Text>
                    </LinearGradient>

                    {/* Pulse Counter Section */}
                    {renderPulseCounter()}

                    {/* Manual Entry Section */}
                    <View style={heartRateEntryStyles.formSection}>
                        <Text style={heartRateEntryStyles.sectionTitle}>📝 Manual Entry</Text>
                        
                        {/* Heart Rate Input */}
                        <View style={heartRateEntryStyles.formGroup}>
                            <Text style={heartRateEntryStyles.inputLabel}>Heart Rate (BPM)</Text>
                            <View style={heartRateEntryStyles.inputContainer}>
                                <TextInput
                                    style={heartRateEntryStyles.input}
                                    value={heartRate}
                                    onChangeText={setHeartRate}
                                    placeholder="Enter heart rate (30-220)"
                                    keyboardType="numeric"
                                    maxLength={3}
                                />
                                <Ionicons name="heart" size={20} color="#e91e63" style={heartRateEntryStyles.inputIcon} />
                            </View>
                            
                            {heartRate && !isNaN(parseInt(heartRate)) && (
                                <View style={heartRateEntryStyles.hrStatusContainer}>
                                    <Text style={heartRateEntryStyles.hrStatusText}>
                                        {getHeartRateStatus(parseInt(heartRate)).emoji} {getHeartRateStatus(parseInt(heartRate)).status} Range
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Measurement Type */}
                        <View style={heartRateEntryStyles.formGroup}>
                            <Text style={heartRateEntryStyles.inputLabel}>Measurement Type</Text>
                            <View style={heartRateEntryStyles.buttonGrid}>
                                {[
                                    { value: 'resting', label: '😴 Resting', color: '#4CAF50' },
                                    { value: 'active', label: '🚶 Active', color: '#FF9800' },
                                    { value: 'post_exercise', label: '🏃 Post-Exercise', color: '#F44336' },
                                    { value: 'stress', label: '😰 Stress', color: '#9C27B0' }
                                ].map((type) => (
                                    <TouchableOpacity
                                        key={type.value}
                                        style={[
                                            heartRateEntryStyles.typeButton,
                                            measurementType === type.value && heartRateEntryStyles.selectedTypeButton,
                                            { borderColor: type.color }
                                        ]}
                                        onPress={() => setMeasurementType(type.value as any)}
                                    >
                                        <Text style={[
                                            heartRateEntryStyles.typeButtonText,
                                            measurementType === type.value && heartRateEntryStyles.selectedTypeButtonText
                                        ]}>{type.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Notes */}
                        <View style={heartRateEntryStyles.formGroup}>
                            <Text style={heartRateEntryStyles.inputLabel}>Notes (Optional)</Text>
                            <View style={heartRateEntryStyles.inputContainer}>
                                <TextInput
                                    style={[heartRateEntryStyles.input, heartRateEntryStyles.notesInput]}
                                    value={notes}
                                    onChangeText={setNotes}
                                    placeholder="Any additional notes about this reading..."
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[heartRateEntryStyles.submitButton, loading && heartRateEntryStyles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={loading || !heartRate}
                        >
                            <LinearGradient
                                colors={loading ? ['#ccc', '#999'] : ['#e91e63', '#f06292']}
                                style={heartRateEntryStyles.submitGradient}
                            >
                                {loading ? (
                                    <Text style={heartRateEntryStyles.submitButtonText}>Saving... ⏳</Text>
                                ) : (
                                    <>
                                        <Ionicons name="checkmark-circle" size={24} color="#fff" />
                                        <Text style={heartRateEntryStyles.submitButtonText}>Save Heart Rate</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
