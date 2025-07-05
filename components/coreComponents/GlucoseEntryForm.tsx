// components/coreComponents/GlucoseEntryForm.tsx

import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    ScrollView, 
    SafeAreaView,
    ActivityIndicator,
    Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { setFingerSelectionCallback, clearFingerSelectionCallback } from '../../app/(protected)/hand-selection';
import { useAuth } from '../../firebase/AuthContext';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import glucoseEntryStyles from "../../assets/styles/componentStyles/glucoseEntryStyles"

interface GlucoseEntryFormProps {
    onClose: () => void;
    onSuccess?: () => void;
}

interface GlucoseReading {
    value: string;
    readingType: 'fasting' | 'post_meal' | 'random' | 'bedtime' | 'pre_meal';
    notes: string;
    fingerPricked: string;
}

const READING_TYPES = [
    { key: 'fasting', label: 'Fasting', icon: 'sunny-outline', emoji: '🌅', color: ['#6366f1', '#8b5cf6'] },
    { key: 'pre_meal', label: 'Before Meal', icon: 'time-outline', emoji: '🍽️', color: ['#06b6d4', '#3b82f6'] },
    { key: 'post_meal', label: 'After Meal', icon: 'restaurant-outline', emoji: '🍎', color: ['#10b981', '#059669'] },
    { key: 'bedtime', label: 'Bedtime', icon: 'moon-outline', emoji: '🌙', color: ['#8b5cf6', '#7c3aed'] },
    { key: 'random', label: 'Random', icon: 'help-circle-outline', emoji: '🎲', color: ['#f59e0b', '#d97706'] }
] as const;

const FINGER_OPTIONS = [
    // Row 1: Thumbs
    { key: 'thumb_left', label: 'Left Thumb', emoji: '👍', position: 'Thumb', side: 'left' },
    { key: 'thumb_right', label: 'Right Thumb', emoji: '👍', position: 'Thumb', side: 'right' },
    // Row 2: Index
    { key: 'index_left', label: 'Left Index', emoji: '☝️', position: 'Index', side: 'left' },
    { key: 'index_right', label: 'Right Index', emoji: '☝️', position: 'Index', side: 'right' },
    // Row 3: Middle
    { key: 'middle_left', label: 'Left Middle', emoji: '🖕', position: 'Middle', side: 'left' },
    { key: 'middle_right', label: 'Right Middle', emoji: '🖕', position: 'Middle', side: 'right' },
    // Row 4: Ring
    { key: 'ring_left', label: 'Left Ring', emoji: '💍', position: 'Ring', side: 'left' },
    { key: 'ring_right', label: 'Right Ring', emoji: '💍', position: 'Ring', side: 'right' },
    // Row 5: Pinky
    { key: 'pinky_left', label: 'Left Pinky', emoji: '🤙', position: 'Pinky', side: 'left' },
    { key: 'pinky_right', label: 'Right Pinky', emoji: '🤙', position: 'Pinky', side: 'right' }
];

const GLUCOSE_RANGES = {
    fasting: { normal: [70, 100], preDiabetic: [100, 125], diabetic: 126 },
    post_meal: { normal: [70, 140], preDiabetic: [140, 199], diabetic: 200 },
    random: { normal: [70, 140], preDiabetic: [140, 199], diabetic: 200 },
    pre_meal: { normal: [70, 100], preDiabetic: [100, 125], diabetic: 126 },
    bedtime: { normal: [70, 120], preDiabetic: [120, 160], diabetic: 160 }
};

export default function GlucoseEntryForm({ onClose, onSuccess }: GlucoseEntryFormProps) {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    const [reading, setReading] = useState<GlucoseReading>({
        value: '',
        readingType: 'random',
        notes: '',
        fingerPricked: 'index_right' // Default to right index finger
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const [recommendedFinger, setRecommendedFinger] = useState<string | null>(null);
    const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(true);
    
    // Animation for recommended finger glow
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Set up finger selection callback
    useFocusEffect(
        useCallback(() => {
            setFingerSelectionCallback(handleFingerSelection);
            return () => {
                clearFingerSelectionCallback();
            };
        }, [])
    );

    useEffect(() => {
        loadFingerRecommendation();
    }, []);

    useEffect(() => {
        // Start pulse animation when recommended finger is set
        if (recommendedFinger) {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        }
    }, [recommendedFinger]);

    const loadFingerRecommendation = async () => {
        if (!user?.uid) return;
        
        try {
            const q = query(
                collection(db, 'glucoseReadings'),
                where('userId', '==', user.uid),
                where('entrySource', '==', 'manual'),
                orderBy('timestamp', 'desc'),
                limit(5)
            );
            
            const querySnapshot = await getDocs(q);
            const recentReadings = querySnapshot.docs.map(doc => doc.data());
            
            const fingerUsage: Record<string, number> = {};
            recentReadings.forEach(reading => {
                if (reading.fingerPricked) {
                    fingerUsage[reading.fingerPricked] = (fingerUsage[reading.fingerPricked] || 0) + 1;
                }
            });
            
            const allFingers = FINGER_OPTIONS.map(f => f.key);
            const leastUsedFingers = allFingers.filter(finger => 
                (fingerUsage[finger] || 0) === Math.min(...allFingers.map(f => fingerUsage[f] || 0))
            );
            
            let recommended = leastUsedFingers[0] || 'index_right';
            
            if (recentReadings.length > 0 && recentReadings[0].fingerPricked) {
                // Prefer alternating between left and right hands
                const lastFinger = recentReadings[0].fingerPricked;
                const isLastLeft = lastFinger.includes('left');
                const oppositeFingers = leastUsedFingers.filter(finger => 
                    isLastLeft ? finger.includes('right') : finger.includes('left')
                );
                
                if (oppositeFingers.length > 0) {
                    recommended = oppositeFingers[0];
                }
            }
            
            setRecommendedFinger(recommended);
            setReading(prev => ({ ...prev, fingerPricked: recommended }));
            
        } catch (error) {
            console.error('Error loading finger recommendation:', error);
            setRecommendedFinger('index_right'); // Default to right index
        } finally {
            setIsLoadingRecommendation(false);
        }
    };

    const getGlucoseStatus = (value: number, type: string) => {
        const ranges = GLUCOSE_RANGES[type as keyof typeof GLUCOSE_RANGES];
        if (!ranges) return 'unknown';
        
        if (value < ranges.normal[0]) return 'low';
        if (value <= ranges.normal[1]) return 'normal';
        if (value <= ranges.preDiabetic[1]) return 'elevated';
        return 'high';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'low': return '#ff6b6b';
            case 'normal': return '#51cf66';
            case 'elevated': return '#ffd43b';
            case 'high': return '#ff8787';
            default: return '#868e96';
        }
    };

    const validateGlucoseValue = (value: string) => {
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue > 0 && numValue <= 600;
    };

    const getFingerDisplayName = (fingerKey: string) => {
        const finger = FINGER_OPTIONS.find(f => f.key === fingerKey);
        if (!finger) return 'Unknown finger';
        
        return `${finger.position} ${finger.side === 'left' ? 'Left' : 'Right'}`;
    };

    const handleFingerSelection = (finger: string) => {
        setReading(prev => ({ ...prev, fingerPricked: finger }));
    };

    const navigateToHandSelection = () => {
        router.push('/(protected)/hand-selection');
    };

    const handleSubmit = async () => {
        if (!validateGlucoseValue(reading.value) || !user?.uid) return;
        
        setIsSubmitting(true);
        
        try {
            const glucoseValue = parseFloat(reading.value);
            const status = getGlucoseStatus(glucoseValue, reading.readingType);
            
            const readingData = {
                userId: user.uid,
                userEmail: user.email || '',
                firstName: userProfile?.firstName || '',
                lastName: userProfile?.lastName || '',
                glucoseValue: glucoseValue,
                readingType: reading.readingType,
                notes: reading.notes.trim(),
                fingerPricked: reading.fingerPricked,
                status: status,
                entrySource: 'manual',
                timestamp: serverTimestamp(),
                deviceInfo: {
                    platform: 'mobile',
                    userAgent: 'Diabeto-App'
                }
            };

            await addDoc(collection(db, 'glucoseReadings'), readingData);
            
            Alert.alert(
                'Reading Saved! 🎉',
                `Your glucose reading of ${glucoseValue} mg/dL has been logged successfully.`,
                [
                    {
                        text: 'Great!',
                        onPress: () => {
                            if (onSuccess) onSuccess();
                            if (onClose) onClose();
                        }
                    }
                ]
            );
            
        } catch (error) {
            console.error('Error saving glucose reading:', error);
            Alert.alert(
                'Error',
                'Failed to save your reading. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderValidation = () => {
        if (!reading.value || !validateGlucoseValue(reading.value)) return null;
        
        const value = parseFloat(reading.value);
        const status = getGlucoseStatus(value, reading.readingType);
        const color = getStatusColor(status);
        
        const getStatusMessage = () => {
            switch (status) {
                case 'low': return 'Low - Consider eating something 🍎';
                case 'normal': return 'Normal range - Great job! ✨';
                case 'elevated': return 'Elevated - Monitor closely 👀';
                case 'high': return 'High - Consult healthcare provider 🏥';
                default: return '';
            }
        };

        return (
            <LinearGradient
                colors={status === 'normal' ? ['#51cf66', '#40c057'] : [color, color]}
                style={glucoseEntryStyles.validationContainer}
            >
                <View style={glucoseEntryStyles.validationContent}>
                    <View style={glucoseEntryStyles.statusIconContainer}>
                        <Ionicons 
                            name={status === 'normal' ? 'checkmark-circle' : 'alert-circle'} 
                            size={24} 
                            color="#fff" 
                        />
                    </View>
                    <Text style={glucoseEntryStyles.statusText}>
                        {getStatusMessage()}
                    </Text>
                </View>
            </LinearGradient>
        );
    };

    const currentReadingType = READING_TYPES.find(t => t.key === reading.readingType);

    return (
        <SafeAreaView style={glucoseEntryStyles.container}>
            <ScrollView 
                style={glucoseEntryStyles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Main Input Card */}
                <View style={glucoseEntryStyles.mainCard}>
                    <View style={glucoseEntryStyles.inputSection}>
                        <Text style={glucoseEntryStyles.inputLabel}>Reading (mg/dL)</Text>
                        <View style={glucoseEntryStyles.inputContainer}>
                            <TextInput
                                style={glucoseEntryStyles.valueInput}
                                value={reading.value}
                                onChangeText={(text) => {
                                    setReading(prev => ({ ...prev, value: text }));
                                    setShowValidation(text.length > 0);
                                }}
                                placeholder="Enter value"
                                placeholderTextColor="#9ca3af"
                                keyboardType="numeric"
                                maxLength={3}
                                autoFocus
                            />
                        </View>
                        {showValidation && renderValidation()}
                    </View>

                    {/* Timing Selection - True 2x2 Grid Layout */}
                    <View style={glucoseEntryStyles.timingSection}>
                        <Text style={glucoseEntryStyles.timingSectionHeader}>When did you take this reading?</Text>
                        
                        {/* 2x2 Grid for main timing options */}
                        <View style={glucoseEntryStyles.timingGrid}>
                            <View style={glucoseEntryStyles.timingRow}>
                                {READING_TYPES.slice(0, 2).map((type) => (
                                    <TouchableOpacity
                                        key={type.key}
                                        style={[
                                            glucoseEntryStyles.timingGridItem,
                                            reading.readingType === type.key && glucoseEntryStyles.timingGridItemSelected
                                        ]}
                                        onPress={() => setReading(prev => ({ ...prev, readingType: type.key }))}
                                    >
                                        <Text style={glucoseEntryStyles.timingGridEmoji}>{type.emoji}</Text>
                                        <Text style={[
                                            glucoseEntryStyles.timingGridLabel,
                                            reading.readingType === type.key && glucoseEntryStyles.timingGridLabelSelected
                                        ]}>
                                            {type.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={glucoseEntryStyles.timingRow}>
                                {READING_TYPES.slice(2, 4).map((type) => (
                                    <TouchableOpacity
                                        key={type.key}
                                        style={[
                                            glucoseEntryStyles.timingGridItem,
                                            reading.readingType === type.key && glucoseEntryStyles.timingGridItemSelected
                                        ]}
                                        onPress={() => setReading(prev => ({ ...prev, readingType: type.key }))}
                                    >
                                        <Text style={glucoseEntryStyles.timingGridEmoji}>{type.emoji}</Text>
                                        <Text style={[
                                            glucoseEntryStyles.timingGridLabel,
                                            reading.readingType === type.key && glucoseEntryStyles.timingGridLabelSelected
                                        ]}>
                                            {type.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        
                        {/* Centered Random Option */}
                        <View style={glucoseEntryStyles.randomOptionContainer}>
                            {READING_TYPES.slice(4).map((type) => (
                                <TouchableOpacity
                                    key={type.key}
                                    style={[
                                        glucoseEntryStyles.randomOption,
                                        reading.readingType === type.key && glucoseEntryStyles.randomOptionSelected
                                    ]}
                                    onPress={() => setReading(prev => ({ ...prev, readingType: type.key }))}
                                >
                                    <Text style={glucoseEntryStyles.randomEmoji}>{type.emoji}</Text>
                                    <Text style={[
                                        glucoseEntryStyles.randomLabel,
                                        reading.readingType === type.key && glucoseEntryStyles.randomLabelSelected
                                    ]}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Interactive Hand & Finger Selection */}
                    <View style={glucoseEntryStyles.fingerSection}>
                        <Text style={glucoseEntryStyles.fingerSectionHeader}>Which finger?</Text>
                        {recommendedFinger && (
                            <Text style={glucoseEntryStyles.recommendationText}>
                                💡 Recommended: {getFingerDisplayName(recommendedFinger)}
                            </Text>
                        )}
                        
                        {/* Current Selection Display */}
                        <View style={glucoseEntryStyles.currentSelectionContainer}>
                            <Text style={glucoseEntryStyles.currentSelectionLabel}>Selected Finger:</Text>
                            <Text style={glucoseEntryStyles.currentSelectionValue}>
                                {getFingerDisplayName(reading.fingerPricked)}
                            </Text>
                        </View>
                        
                        {/* Interactive Hand Selection Button */}
                        <TouchableOpacity
                            style={glucoseEntryStyles.handSelectionButton}
                            onPress={navigateToHandSelection}
                        >
                            <LinearGradient
                                colors={['#3b82f6', '#1d4ed8']}
                                style={glucoseEntryStyles.handSelectionButtonGradient}
                            >
                                <Ionicons name="hand-left" size={24} color="#ffffff" />
                                <Text style={glucoseEntryStyles.handSelectionButtonText}>
                                    Choose Different Finger
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color="#ffffff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Optional Notes */}
                    <View style={glucoseEntryStyles.notesSection}>
                        <Text style={glucoseEntryStyles.sectionLabel}>Notes (optional)</Text>
                        <TextInput
                            style={glucoseEntryStyles.notesInput}
                            value={reading.notes}
                            onChangeText={(text) => setReading(prev => ({ ...prev, notes: text }))}
                            placeholder="Any symptoms or notes..."
                            placeholderTextColor="#9ca3af"
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[
                        glucoseEntryStyles.saveButton,
                        (!reading.value || !validateGlucoseValue(reading.value) || isSubmitting) && 
                        glucoseEntryStyles.saveButtonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={!reading.value || !validateGlucoseValue(reading.value) || isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                            <Text style={glucoseEntryStyles.saveButtonText}>Save Reading</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Reference Guide */}
                <View style={glucoseEntryStyles.referenceCard}>
                    <Text style={glucoseEntryStyles.referenceTitle}>Normal Ranges</Text>
                    <View style={glucoseEntryStyles.referenceList}>
                        <Text style={glucoseEntryStyles.referenceItem}>Fasting: 70-100 mg/dL</Text>
                        <Text style={glucoseEntryStyles.referenceItem}>Before meals: 70-100 mg/dL</Text>
                        <Text style={glucoseEntryStyles.referenceItem}>After meals: 70-140 mg/dL</Text>
                        <Text style={glucoseEntryStyles.referenceItem}>Bedtime: 70-120 mg/dL</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
