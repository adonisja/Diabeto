// app/(protected)/(patient)/insulin-logging.tsx

import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput,
    TouchableOpacity, 
    Modal,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Alert,
    ActivityIndicator,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../firebase/AuthContext';
import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import StarryBodyDiagram from '../../../components/coreComponents/StarryBodyDiagram';
import insulinLoggingScreenStyles from '../../../assets/styles/protectedStyles/patientStyles/insulinLoggingScreenStyles';

interface InsulinRecord {
    id: string;
    insulinType: 'long-acting' | 'short-acting';
    mealTiming: 'pre-meal' | 'post-meal';
    injectionSite: string;
    injectionSubSite: 'left-side' | 'right-side';
    units: number;
    notes: string;
    timestamp: any;
    userId: string;
    userEmail: string;
    firstName: string;
    lastName: string;
    entrySource: string;
    // Prescribed dosage tracking
    prescribedDosage?: number;
    isDosageAltered?: boolean;
    prescribingDoctorId?: string;
}

export default function InsulinLoggingScreen() {
    const router = useRouter();
    const { user, userProfile } = useAuth();
    
    // Form state
    const [insulinType, setInsulinType] = useState<'long-acting' | 'short-acting'>('short-acting');
    const [mealTiming, setMealTiming] = useState<'pre-meal' | 'post-meal'>('pre-meal');
    const [selectedSite, setSelectedSite] = useState<string>('');
    const [selectedSubSite, setSelectedSubSite] = useState<'left-side' | 'right-side'>('left-side');
    const [units, setUnits] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<string>('');
    
    // UI state
    const [showBodyDiagram, setShowBodyDiagram] = useState(false);
    const [recentRecords, setRecentRecords] = useState<InsulinRecord[]>([]);
    
    // Prescribed dosage tracking
    const [isDosageAltered, setIsDosageAltered] = useState(false);
    const [prescribedDosage, setPrescribedDosage] = useState<number | null>(null);

    // Get site rotation recommendation
    useEffect(() => {
        if (user?.uid) {
            getRecentRecords();
        }
    }, [user?.uid]);

    // Analyze recent records and provide recommendation
    useEffect(() => {
        if (recentRecords.length > 0) {
            const siteUsage = analyzeInjectionPatterns(recentRecords);
            const recommendedSite = getRecommendedSite(siteUsage);
            setRecommendation(recommendedSite);
        }
    }, [recentRecords]);

    // Set prescribed dosage when insulin type changes
    useEffect(() => {
        if (userProfile) {
            const prescribed = insulinType === 'short-acting' 
                ? userProfile.prescribedShortActingDosage 
                : userProfile.prescribedLongActingDosage;
            
            if (prescribed && prescribed > 0) {
                setPrescribedDosage(prescribed);
                setUnits(prescribed.toString());
                setIsDosageAltered(false);
            } else {
                setPrescribedDosage(null);
                setUnits('');
                setIsDosageAltered(false);
            }
        }
    }, [insulinType, userProfile]);

    const getRecentRecords = async () => {
        if (!user?.uid) return;

        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const q = query(
                collection(db, 'insulinRecords'),
                where('userId', '==', user.uid),
                where('timestamp', '>=', sevenDaysAgo),
                orderBy('timestamp', 'desc'),
                limit(10)
            );

            const querySnapshot = await getDocs(q);
            const records: InsulinRecord[] = [];
            
            querySnapshot.forEach((doc) => {
                records.push({ id: doc.id, ...doc.data() } as InsulinRecord);
            });

            setRecentRecords(records);
        } catch (error) {
            console.error('Error fetching recent records:', error);
        }
    };

    const analyzeInjectionPatterns = (records: InsulinRecord[]) => {
        const siteUsage: { [key: string]: number } = {};
        
        records.forEach(record => {
            const siteKey = `${record.injectionSite}-${record.injectionSubSite}`;
            siteUsage[siteKey] = (siteUsage[siteKey] || 0) + 1;
        });
        
        return siteUsage;
    };

    const getRecommendedSite = (siteUsage: { [key: string]: number }) => {
        const availableSites = ['stomach', 'left-leg', 'right-leg'];
        
        // Add arm sites for authorized users
        if (userProfile?.role && ['caretaker', 'doctor', 'admin'].includes(userProfile.role)) {
            availableSites.push('left-arm', 'right-arm');
        }
        
        // Find least used site
        let leastUsedSite = availableSites[0];
        let minUsage = Infinity;
        
        availableSites.forEach(site => {
            const leftUsage = siteUsage[`${site}-left-side`] || 0;
            const rightUsage = siteUsage[`${site}-right-side`] || 0;
            const totalUsage = leftUsage + rightUsage;
            
            if (totalUsage < minUsage) {
                minUsage = totalUsage;
                leastUsedSite = site;
            }
        });
        
        return leastUsedSite;
    };

    const handleBackPress = () => {
        router.back();
    };

    const handleSiteSelection = (siteId: string) => {
        setSelectedSite(siteId);
        setShowBodyDiagram(false);
    };

    const handleUnitsChange = (value: string) => {
        setUnits(value);
        
        // Check if dosage has been altered from prescribed amount
        if (prescribedDosage !== null) {
            const enteredUnits = parseFloat(value);
            setIsDosageAltered(!isNaN(enteredUnits) && enteredUnits !== prescribedDosage);
        }
    };

    const getSiteDisplayName = (siteId: string) => {
        const siteNames: { [key: string]: string } = {
            'stomach': '🌟 Stomach',
            'left-arm': '💫 Left Arm',
            'right-arm': '💫 Right Arm',
            'left-leg': '✨ Left Leg',
            'right-leg': '✨ Right Leg'
        };
        return siteNames[siteId] || siteId;
    };

    const validateForm = () => {
        if (!selectedSite) {
            Alert.alert('Missing Information', 'Please select an injection site using the starry body guide.');
            return false;
        }
        
        const unitsNum = parseFloat(units);
        if (!units || isNaN(unitsNum) || unitsNum < 1 || unitsNum > 100) {
            Alert.alert('Invalid Units', 'Please enter a valid number of insulin units (1-100).');
            return false;
        }
        
        // Require notes when dosage is altered from prescribed amount
        if (isDosageAltered && !notes.trim()) {
            Alert.alert(
                'Explanation Required', 
                `You've changed the dosage from the prescribed ${prescribedDosage} units to ${unitsNum} units. Please explain the reason for this change in the notes section.`
            );
            return false;
        }
        
        return true;
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

            const insulinRecord = {
                insulinType,
                mealTiming,
                injectionSite: selectedSite,
                injectionSubSite: selectedSubSite,
                units: parseFloat(units),
                notes: notes.trim(),
                timestamp: new Date(),
                userId: user?.uid,
                userEmail: user?.email,
                firstName: userProfile?.firstName || '',
                lastName: userProfile?.lastName || '',
                entrySource: `${deviceInfo} - Insulin Logging Screen`,
                // Prescribed dosage tracking
                prescribedDosage: prescribedDosage,
                isDosageAltered: isDosageAltered,
                prescribingDoctorId: userProfile?.prescribingDoctorId || null
            };

            await addDoc(collection(db, 'insulinRecords'), insulinRecord);
            
            Alert.alert(
                '🎉 Success!', 
                'Your insulin injection has been logged successfully!',
                [
                    {
                        text: 'Log Another',
                        onPress: () => {
                            // Reset form
                            setSelectedSite('');
                            setUnits('');
                            setNotes('');
                            getRecentRecords(); // Refresh recommendations
                        }
                    },
                    {
                        text: 'Done',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            console.error('Error saving insulin record:', error);
            Alert.alert('Error', 'Failed to save insulin record. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={insulinLoggingScreenStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />
            
            {/* Enhanced Header */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={insulinLoggingScreenStyles.header}
            >
                <TouchableOpacity onPress={handleBackPress} style={insulinLoggingScreenStyles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={insulinLoggingScreenStyles.headerTitle}>✨ Log Insulin Injection</Text>
                <View style={insulinLoggingScreenStyles.headerSpacer} />
            </LinearGradient>

            {/* Colorful background gradient */}
            <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                style={insulinLoggingScreenStyles.backgroundGradient}
            >
                <ScrollView 
                    style={insulinLoggingScreenStyles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                >
                    {/* Welcome Section */}
                    <View style={insulinLoggingScreenStyles.welcomeSection}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                            style={insulinLoggingScreenStyles.welcomeCard}
                        >
                            <View style={insulinLoggingScreenStyles.welcomeIcon}>
                                <Ionicons name="star" size={32} color="#667eea" />
                            </View>
                            <Text style={insulinLoggingScreenStyles.welcomeTitle}>✨ Ready to Log! 🎯</Text>
                            <Text style={insulinLoggingScreenStyles.welcomeMessage}>
                                Track your insulin injection with our magical starry body guide
                            </Text>
                        </LinearGradient>
                    </View>

                    {/* Form Section */}
                    <View style={insulinLoggingScreenStyles.formSection}>
                        
                        {/* Insulin Type Selection */}
                        <View style={insulinLoggingScreenStyles.formGroup}>
                            <Text style={insulinLoggingScreenStyles.sectionTitle}>💉 Insulin Type</Text>
                            <View style={insulinLoggingScreenStyles.buttonRow}>
                                <TouchableOpacity
                                    style={[
                                        insulinLoggingScreenStyles.selectionButton,
                                        insulinType === 'short-acting' && insulinLoggingScreenStyles.selectedButton
                                    ]}
                                    onPress={() => setInsulinType('short-acting')}
                                >
                                    <Text style={[
                                        insulinLoggingScreenStyles.selectionButtonText,
                                        insulinType === 'short-acting' && insulinLoggingScreenStyles.selectedButtonText
                                    ]}>⚡ Short-Acting</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        insulinLoggingScreenStyles.selectionButton,
                                        insulinType === 'long-acting' && insulinLoggingScreenStyles.selectedButton
                                    ]}
                                    onPress={() => setInsulinType('long-acting')}
                                >
                                    <Text style={[
                                        insulinLoggingScreenStyles.selectionButtonText,
                                        insulinType === 'long-acting' && insulinLoggingScreenStyles.selectedButtonText
                                    ]}>🕐 Long-Acting</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Meal Timing Selection */}
                        <View style={insulinLoggingScreenStyles.formGroup}>
                            <Text style={insulinLoggingScreenStyles.sectionTitle}>🍽️ Meal Timing</Text>
                            <View style={insulinLoggingScreenStyles.buttonRow}>
                                <TouchableOpacity
                                    style={[
                                        insulinLoggingScreenStyles.selectionButton,
                                        mealTiming === 'pre-meal' && insulinLoggingScreenStyles.selectedButton
                                    ]}
                                    onPress={() => setMealTiming('pre-meal')}
                                >
                                    <Text style={[
                                        insulinLoggingScreenStyles.selectionButtonText,
                                        mealTiming === 'pre-meal' && insulinLoggingScreenStyles.selectedButtonText
                                    ]}>🍴 Pre-Meal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        insulinLoggingScreenStyles.selectionButton,
                                        mealTiming === 'post-meal' && insulinLoggingScreenStyles.selectedButton
                                    ]}
                                    onPress={() => setMealTiming('post-meal')}
                                >
                                    <Text style={[
                                        insulinLoggingScreenStyles.selectionButtonText,
                                        mealTiming === 'post-meal' && insulinLoggingScreenStyles.selectedButtonText
                                    ]}>🥗 Post-Meal</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Injection Site Selection */}
                        <View style={insulinLoggingScreenStyles.formGroup}>
                            <Text style={insulinLoggingScreenStyles.sectionTitle}>🌟 Injection Site</Text>
                            {recommendation && (
                                <View style={insulinLoggingScreenStyles.recommendationCard}>
                                    <Ionicons name="star" size={16} color="#FFD700" />
                                    <Text style={insulinLoggingScreenStyles.recommendationText}>
                                        Recommended: {getSiteDisplayName(recommendation)}
                                    </Text>
                                </View>
                            )}
                            
                            <TouchableOpacity
                                style={insulinLoggingScreenStyles.siteSelectionButton}
                                onPress={() => setShowBodyDiagram(true)}
                            >
                                <LinearGradient
                                    colors={['#43e97b', '#38f9d7']}
                                    style={insulinLoggingScreenStyles.siteButtonGradient}
                                >
                                    <Ionicons name="body" size={24} color="#fff" />
                                    <Text style={insulinLoggingScreenStyles.siteButtonText}>
                                        {selectedSite ? getSiteDisplayName(selectedSite) : 'Select Injection Site'}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Site Side Selection */}
                        {selectedSite && (
                            <View style={insulinLoggingScreenStyles.formGroup}>
                                <Text style={insulinLoggingScreenStyles.sectionTitle}>↔️ Site Side</Text>
                                <View style={insulinLoggingScreenStyles.buttonRow}>
                                    <TouchableOpacity
                                        style={[
                                            insulinLoggingScreenStyles.selectionButton,
                                            selectedSubSite === 'left-side' && insulinLoggingScreenStyles.selectedButton
                                        ]}
                                        onPress={() => setSelectedSubSite('left-side')}
                                    >
                                        <Text style={[
                                            insulinLoggingScreenStyles.selectionButtonText,
                                            selectedSubSite === 'left-side' && insulinLoggingScreenStyles.selectedButtonText
                                        ]}>👈 Left Side</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            insulinLoggingScreenStyles.selectionButton,
                                            selectedSubSite === 'right-side' && insulinLoggingScreenStyles.selectedButton
                                        ]}
                                        onPress={() => setSelectedSubSite('right-side')}
                                    >
                                        <Text style={[
                                            insulinLoggingScreenStyles.selectionButtonText,
                                            selectedSubSite === 'right-side' && insulinLoggingScreenStyles.selectedButtonText
                                        ]}>👉 Right Side</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Units Input */}
                        <View style={insulinLoggingScreenStyles.formGroup}>
                            <Text style={insulinLoggingScreenStyles.sectionTitle}>💊 Units (1-100)</Text>
                            {prescribedDosage && (
                                <View style={insulinLoggingScreenStyles.prescribedDosageCard}>
                                    <Ionicons name="medical" size={16} color="#667eea" />
                                    <Text style={insulinLoggingScreenStyles.prescribedText}>
                                        Prescribed: {prescribedDosage} units
                                    </Text>
                                    {isDosageAltered && (
                                        <View style={insulinLoggingScreenStyles.alteredBadge}>
                                            <Ionicons name="warning" size={14} color="#f59e0b" />
                                            <Text style={insulinLoggingScreenStyles.alteredText}>Modified</Text>
                                        </View>
                                    )}
                                </View>
                            )}
                            <View style={insulinLoggingScreenStyles.inputContainer}>
                                <TextInput
                                    style={[
                                        insulinLoggingScreenStyles.input,
                                        isDosageAltered && insulinLoggingScreenStyles.alteredInput
                                    ]}
                                    value={units}
                                    onChangeText={handleUnitsChange}
                                    placeholder={prescribedDosage ? `Default: ${prescribedDosage} units` : "Enter insulin units"}
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    returnKeyType="next"
                                />
                                <Ionicons name="medical" size={20} color="#667eea" style={insulinLoggingScreenStyles.inputIcon} />
                            </View>
                        </View>

                        {/* Notes Input */}
                        <View style={insulinLoggingScreenStyles.formGroup}>
                            <Text style={insulinLoggingScreenStyles.sectionTitle}>
                                📝 Notes {isDosageAltered ? '(Required - Explain dosage change)' : '(Optional)'}
                            </Text>
                            {isDosageAltered && (
                                <View style={insulinLoggingScreenStyles.requirementCard}>
                                    <Ionicons name="alert-circle" size={16} color="#f59e0b" />
                                    <Text style={insulinLoggingScreenStyles.requirementText}>
                                        Please explain why you changed the dosage from {prescribedDosage} units
                                    </Text>
                                </View>
                            )}
                            <View style={insulinLoggingScreenStyles.inputContainer}>
                                <TextInput
                                    style={[
                                        insulinLoggingScreenStyles.input, 
                                        insulinLoggingScreenStyles.notesInput,
                                        isDosageAltered && insulinLoggingScreenStyles.alteredInput
                                    ]}
                                    value={notes}
                                    onChangeText={setNotes}
                                    placeholder={isDosageAltered ? "Required: Explain why you changed the dosage..." : "Add any notes about this injection..."}
                                    placeholderTextColor="#999"
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />
                                <Ionicons name="create" size={20} color="#667eea" style={insulinLoggingScreenStyles.inputIcon} />
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={insulinLoggingScreenStyles.submitButton}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={['#667eea', '#764ba2']}
                                style={insulinLoggingScreenStyles.submitGradient}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark-circle" size={24} color="#fff" />
                                        <Text style={insulinLoggingScreenStyles.submitButtonText}>Save Injection Log</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>

            {/* Starry Body Diagram Modal */}
            <Modal
                visible={showBodyDiagram}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowBodyDiagram(false)}
            >
                <StarryBodyDiagram
                    selectedSite={selectedSite}
                    onSiteSelect={handleSiteSelection}
                    userRole={userProfile?.role || 'patient'}
                    recommendedSite={recommendation}
                    onClose={() => setShowBodyDiagram(false)}
                />
            </Modal>
        </SafeAreaView>
    );
}
