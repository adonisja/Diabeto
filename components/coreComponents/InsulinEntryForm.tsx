// components/coreComponents/InsulinEntryForm.tsx

import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    ScrollView, 
    ActivityIndicator,
    Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../firebase/AuthContext';
import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import HumanBodyDiagram from './HumanBodyDiagram';
import insulinEntryStyles from '../../assets/styles/componentStyles/insulinEntryStyles';

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
}

interface InsulinEntryFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface InjectionSiteOption {
    value: string;
    label: string;
    icon: string;
    medicalNote?: string;
}

export default function InsulinEntryForm({ onClose, onSuccess }: InsulinEntryFormProps) {
    const { user, userProfile } = useAuth();
    const [insulinType, setInsulinType] = useState<'long-acting' | 'short-acting'>('short-acting');
    const [mealTiming, setMealTiming] = useState<'pre-meal' | 'post-meal'>('pre-meal');
    const [selectedSite, setSelectedSite] = useState<string>('');
    const [selectedSubSite, setSelectedSubSite] = useState<'left-side' | 'right-side'>('left-side');
    const [units, setUnits] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<string>('');
    const [recentRecords, setRecentRecords] = useState<InsulinRecord[]>([]);

    // Define injection sites based on user role
    const getInjectionSites = (): InjectionSiteOption[] => {
        const baseSites: InjectionSiteOption[] = [
            { 
                value: 'stomach', 
                label: 'Stomach/Abdomen', 
                icon: 'body',
                medicalNote: 'Fastest absorption, ideal for short-acting insulin'
            },
            { 
                value: 'left-leg', 
                label: 'Left Leg/Thigh', 
                icon: 'walk',
                medicalNote: 'Medium absorption rate'
            },
            { 
                value: 'right-leg', 
                label: 'Right Leg/Thigh', 
                icon: 'walk',
                medicalNote: 'Medium absorption rate'
            }
        ];

        // Add arm sites only for caretakers, doctors, and admins
        if (userProfile?.role && ['caretaker', 'doctor', 'admin'].includes(userProfile.role)) {
            baseSites.push(
                { 
                    value: 'left-arm', 
                    label: 'Left Arm', 
                    icon: 'hand-left',
                    medicalNote: 'Slower absorption, good for long-acting insulin'
                },
                { 
                    value: 'right-arm', 
                    label: 'Right Arm', 
                    icon: 'hand-right',
                    medicalNote: 'Slower absorption, good for long-acting insulin'
                }
            );
        }

        return baseSites;
    };

    const injectionSites = getInjectionSites();

    // Fetch recent insulin records for recommendation system
    useEffect(() => {
        if (!user) return;

        const fetchRecentRecords = async () => {
            try {
                const q = query(
                    collection(db, 'insulinRecords'),
                    where('userId', '==', user.uid),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                );

                const querySnapshot = await getDocs(q);
                const records: InsulinRecord[] = [];
                querySnapshot.forEach((doc) => {
                    records.push({
                        id: doc.id,
                        ...doc.data()
                    } as InsulinRecord);
                });

                setRecentRecords(records);
                generateRecommendation(records);
            } catch (error) {
                console.error('Error fetching recent insulin records:', error);
            }
        };

        fetchRecentRecords();
    }, [user]);

    // Generate injection site recommendation based on recent records
    const generateRecommendation = (records: InsulinRecord[]) => {
        if (records.length === 0) {
            setRecommendation('For first injection, stomach area is recommended for optimal absorption.');
            setSelectedSite('stomach');
            return;
        }

        // Count recent injections per site (last 7 days)
        const recentSites = records.filter(record => {
            const recordDate = record.timestamp.toDate();
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return recordDate >= weekAgo;
        });

        const siteCount: { [key: string]: number } = {};
        recentSites.forEach(record => {
            const siteKey = `${record.injectionSite}-${record.injectionSubSite}`;
            siteCount[siteKey] = (siteCount[siteKey] || 0) + 1;
        });

        // Find least used site
        const availableSites = injectionSites.map(site => [
            `${site.value}-left-side`,
            `${site.value}-right-side`
        ]).flat();

        let recommendedSite = '';
        let minCount = Infinity;

        availableSites.forEach(siteKey => {
            const count = siteCount[siteKey] || 0;
            if (count < minCount) {
                minCount = count;
                recommendedSite = siteKey;
            }
        });

        if (recommendedSite) {
            const [site, subSite] = recommendedSite.split('-');
            const siteLabel = injectionSites.find(s => s.value === site)?.label || site;
            const subSiteLabel = subSite === 'left' ? 'left' : 'right';
            
            setRecommendation(`Recommended: ${siteLabel} - ${subSiteLabel} side (least recently used site)`);
            setSelectedSite(site);
            setSelectedSubSite(subSite.includes('left') ? 'left-side' : 'right-side');
        } else {
            setRecommendation('Continue rotating injection sites to prevent tissue damage.');
        }
    };

    const validateForm = () => {
        if (!selectedSite) {
            Alert.alert('Missing Information', 'Please select an injection site.');
            return false;
        }

        if (!units || parseFloat(units) <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid number of insulin units.');
            return false;
        }

        if (parseFloat(units) > 100) {
            Alert.alert('Safety Check', 'Insulin units seem high. Please verify the dosage.');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const insulinRecord = {
                insulinType,
                mealTiming,
                injectionSite: selectedSite,
                injectionSubSite: selectedSubSite,
                units: parseFloat(units),
                notes: notes.trim(),
                timestamp: new Date(),
                userId: user?.uid || '',
                userEmail: user?.email || '',
                firstName: userProfile?.firstName || '',
                lastName: userProfile?.lastName || '',
                entrySource: userProfile?.role || 'patient'
            };

            await addDoc(collection(db, 'insulinRecords'), insulinRecord);
            
            Alert.alert(
                'Success',
                'Insulin record saved successfully!',
                [{ text: 'OK', onPress: onSuccess }]
            );
        } catch (error) {
            console.error('Error saving insulin record:', error);
            Alert.alert('Error', 'Failed to save insulin record. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderInsulinTypeSelector = () => (
        <View style={insulinEntryStyles.sectionContainer}>
            <Text style={insulinEntryStyles.sectionTitle}>Insulin Type</Text>
            <View style={insulinEntryStyles.optionRow}>
                <TouchableOpacity
                    style={[
                        insulinEntryStyles.optionButton,
                        insulinType === 'short-acting' && insulinEntryStyles.selectedOption
                    ]}
                    onPress={() => setInsulinType('short-acting')}
                >
                    <Ionicons 
                        name="flash" 
                        size={20} 
                        color={insulinType === 'short-acting' ? '#fff' : '#4c669f'} 
                    />
                    <Text style={[
                        insulinEntryStyles.optionText,
                        insulinType === 'short-acting' && insulinEntryStyles.selectedOptionText
                    ]}>
                        Short-Acting
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        insulinEntryStyles.optionButton,
                        insulinType === 'long-acting' && insulinEntryStyles.selectedOption
                    ]}
                    onPress={() => setInsulinType('long-acting')}
                >
                    <Ionicons 
                        name="time" 
                        size={20} 
                        color={insulinType === 'long-acting' ? '#fff' : '#4c669f'} 
                    />
                    <Text style={[
                        insulinEntryStyles.optionText,
                        insulinType === 'long-acting' && insulinEntryStyles.selectedOptionText
                    ]}>
                        Long-Acting
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderMealTimingSelector = () => (
        <View style={insulinEntryStyles.sectionContainer}>
            <Text style={insulinEntryStyles.sectionTitle}>Meal Timing</Text>
            <View style={insulinEntryStyles.optionRow}>
                <TouchableOpacity
                    style={[
                        insulinEntryStyles.optionButton,
                        mealTiming === 'pre-meal' && insulinEntryStyles.selectedOption
                    ]}
                    onPress={() => setMealTiming('pre-meal')}
                >
                    <Ionicons 
                        name="restaurant" 
                        size={20} 
                        color={mealTiming === 'pre-meal' ? '#fff' : '#4c669f'} 
                    />
                    <Text style={[
                        insulinEntryStyles.optionText,
                        mealTiming === 'pre-meal' && insulinEntryStyles.selectedOptionText
                    ]}>
                        Pre-Meal
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        insulinEntryStyles.optionButton,
                        mealTiming === 'post-meal' && insulinEntryStyles.selectedOption
                    ]}
                    onPress={() => setMealTiming('post-meal')}
                >
                    <Ionicons 
                        name="checkmark-done" 
                        size={20} 
                        color={mealTiming === 'post-meal' ? '#fff' : '#4c669f'} 
                    />
                    <Text style={[
                        insulinEntryStyles.optionText,
                        mealTiming === 'post-meal' && insulinEntryStyles.selectedOptionText
                    ]}>
                        Post-Meal
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderInjectionSiteSelector = () => {
        const getRecommendedSiteId = () => {
            if (!recommendation) return undefined;
            
            // Extract site from recommendation text
            if (recommendation.includes('stomach')) return 'stomach';
            if (recommendation.includes('Left Arm')) return 'left-arm';
            if (recommendation.includes('Right Arm')) return 'right-arm';
            if (recommendation.includes('Left Leg')) return 'left-leg';
            if (recommendation.includes('Right Leg')) return 'right-leg';
            
            return undefined;
        };

        return (
            <View>
                {/* Recommendation */}
                {recommendation && (
                    <View style={insulinEntryStyles.recommendationContainer}>
                        <Ionicons name="bulb" size={16} color="#4c669f" />
                        <Text style={insulinEntryStyles.recommendationText}>{recommendation}</Text>
                    </View>
                )}

                {/* Human Body Diagram */}
                <HumanBodyDiagram
                    selectedSite={selectedSite}
                    onSiteSelect={setSelectedSite}
                    userRole={userProfile?.role || 'patient'}
                    recommendedSite={getRecommendedSiteId()}
                />

                {/* Sub-site Selection */}
                {selectedSite && (
                    <View style={insulinEntryStyles.subSiteContainer}>
                        <Text style={insulinEntryStyles.subSiteTitle}>Side Selection</Text>
                        <View style={insulinEntryStyles.optionRow}>
                            <TouchableOpacity
                                style={[
                                    insulinEntryStyles.optionButton,
                                    selectedSubSite === 'left-side' && insulinEntryStyles.selectedOption
                                ]}
                                onPress={() => setSelectedSubSite('left-side')}
                            >
                                <Ionicons 
                                    name="arrow-back" 
                                    size={20} 
                                    color={selectedSubSite === 'left-side' ? '#fff' : '#4c669f'} 
                                />
                                <Text style={[
                                    insulinEntryStyles.optionText,
                                    selectedSubSite === 'left-side' && insulinEntryStyles.selectedOptionText
                                ]}>
                                    Left Side
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    insulinEntryStyles.optionButton,
                                    selectedSubSite === 'right-side' && insulinEntryStyles.selectedOption
                                ]}
                                onPress={() => setSelectedSubSite('right-side')}
                            >
                                <Ionicons 
                                    name="arrow-forward" 
                                    size={20} 
                                    color={selectedSubSite === 'right-side' ? '#fff' : '#4c669f'} 
                                />
                                <Text style={[
                                    insulinEntryStyles.optionText,
                                    selectedSubSite === 'right-side' && insulinEntryStyles.selectedOptionText
                                ]}>
                                    Right Side
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={insulinEntryStyles.container}>
            {/* Header */}
            <View style={insulinEntryStyles.header}>
                <TouchableOpacity onPress={onClose} style={insulinEntryStyles.closeButton}>
                    <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
                <Text style={insulinEntryStyles.headerTitle}>Log Insulin</Text>
                <View style={insulinEntryStyles.headerSpacer} />
            </View>

            <ScrollView style={insulinEntryStyles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Insulin Type */}
                {renderInsulinTypeSelector()}

                {/* Meal Timing */}
                {renderMealTimingSelector()}

                {/* Injection Site */}
                {renderInjectionSiteSelector()}

                {/* Units Input */}
                <View style={insulinEntryStyles.sectionContainer}>
                    <Text style={insulinEntryStyles.sectionTitle}>Insulin Units</Text>
                    <View style={insulinEntryStyles.inputContainer}>
                        <TextInput
                            style={insulinEntryStyles.unitsInput}
                            value={units}
                            onChangeText={setUnits}
                            placeholder="Enter units (e.g., 10)"
                            keyboardType="numeric"
                            maxLength={3}
                        />
                        <Text style={insulinEntryStyles.unitsLabel}>units</Text>
                    </View>
                </View>

                {/* Notes */}
                <View style={insulinEntryStyles.sectionContainer}>
                    <Text style={insulinEntryStyles.sectionTitle}>Notes (Optional)</Text>
                    <TextInput
                        style={insulinEntryStyles.notesInput}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Additional notes about this injection..."
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[
                        insulinEntryStyles.submitButton,
                        loading && insulinEntryStyles.disabledButton
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="save" size={20} color="#fff" />
                            <Text style={insulinEntryStyles.submitButtonText}>Save Insulin Record</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
