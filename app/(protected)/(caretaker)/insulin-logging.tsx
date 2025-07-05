// app/(protected)/(caretaker)/insulin-logging.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../firebase/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import StarryBodyDiagram from '../../../components/coreComponents/StarryBodyDiagram';
import insulinLoggingScreenStyles from '../../../assets/styles/protectedStyles/caretakerStyles/insulinLoggingScreenStyles';

export default function CaretakerInsulinLoggingScreen() {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    
    const [showBodyDiagram, setShowBodyDiagram] = useState(false);
    const [selectedSite, setSelectedSite] = useState('');
    const [insulinUnits, setInsulinUnits] = useState('');
    const [insulinType, setInsulinType] = useState('short-acting');
    const [mealTiming, setMealTiming] = useState('before');
    const [notes, setNotes] = useState('');
    const [patientName, setPatientName] = useState('');

    const handleSiteSelection = (siteId: string) => {
        setSelectedSite(siteId);
        setShowBodyDiagram(false);
    };

    const handleLogInsulin = async () => {
        if (!selectedSite || !insulinUnits || !patientName.trim()) {
            Alert.alert('Missing Information', 'Please fill in all required fields including patient name and injection site.');
            return;
        }

        const units = parseFloat(insulinUnits);
        if (isNaN(units) || units <= 0 || units > 100) {
            Alert.alert('Invalid Dosage', 'Please enter a valid insulin dosage between 1 and 100 units.');
            return;
        }

        try {
            // Here you would normally save to Firestore
            // For now, just show success message
            Alert.alert(
                'Insulin Logged Successfully', 
                `Logged ${units} units of ${insulinType} insulin for ${patientName} at ${selectedSite.replace('-', ' ')}.`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Error logging insulin:', error);
            Alert.alert('Error', 'Failed to log insulin. Please try again.');
        }
    };

    const getSiteDisplayName = (siteId: string) => {
        const siteNames: { [key: string]: string } = {
            'left-arm': 'Left Arm',
            'right-arm': 'Right Arm',
            'stomach': 'Stomach',
            'left-leg': 'Left Leg',
            'right-leg': 'Right Leg'
        };
        return siteNames[siteId] || 'Unknown Site';
    };

    return (
        <SafeAreaView style={insulinLoggingScreenStyles.outerContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#f59e0b" />
            
            {/* Caretaker-themed gradient background */}
            <LinearGradient
                colors={['#f59e0b', '#d97706', '#92400e']}
                style={insulinLoggingScreenStyles.backgroundGradient}
            >
                {/* Header */}
                <View style={insulinLoggingScreenStyles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={insulinLoggingScreenStyles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={insulinLoggingScreenStyles.headerTitle}>Patient Insulin Log</Text>
                    <View style={insulinLoggingScreenStyles.headerSpacer} />
                </View>

                <ScrollView 
                    style={insulinLoggingScreenStyles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Welcome Section */}
                    <View style={insulinLoggingScreenStyles.welcomeSection}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                            style={insulinLoggingScreenStyles.welcomeCard}
                        >
                            <View style={insulinLoggingScreenStyles.welcomeIcon}>
                                <Ionicons name="heart" size={32} color="#f59e0b" />
                            </View>
                            <Text style={insulinLoggingScreenStyles.welcomeTitle}>🤝 Caring Together! 💙</Text>
                            <Text style={insulinLoggingScreenStyles.welcomeMessage}>
                                Help your loved one track their insulin injection with our guided interface
                            </Text>
                        </LinearGradient>
                    </View>

                    {/* Patient Selection Section */}
                    <View style={insulinLoggingScreenStyles.section}>
                        <Text style={insulinLoggingScreenStyles.sectionTitle}>👤 Patient Information</Text>
                        <View style={insulinLoggingScreenStyles.inputCard}>
                            <Text style={insulinLoggingScreenStyles.inputLabel}>Patient Name *</Text>
                            <TextInput
                                style={insulinLoggingScreenStyles.textInput}
                                value={patientName}
                                onChangeText={setPatientName}
                                placeholder="Enter patient's name"
                                placeholderTextColor="rgba(255,255,255,0.6)"
                            />
                        </View>
                    </View>

                    {/* Injection Site Section */}
                    <View style={insulinLoggingScreenStyles.section}>
                        <Text style={insulinLoggingScreenStyles.sectionTitle}>✨ Injection Site</Text>
                        <TouchableOpacity
                            style={insulinLoggingScreenStyles.siteSelectionCard}
                            onPress={() => setShowBodyDiagram(true)}
                        >
                            <LinearGradient
                                colors={selectedSite ? ['#10b981', '#059669'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                                style={insulinLoggingScreenStyles.siteCardGradient}
                            >
                                <Ionicons 
                                    name={selectedSite ? "star" : "body"} 
                                    size={32} 
                                    color="#fff" 
                                />
                                <Text style={insulinLoggingScreenStyles.siteCardTitle}>
                                    {selectedSite ? getSiteDisplayName(selectedSite) : 'Select Injection Site'}
                                </Text>
                                <Text style={insulinLoggingScreenStyles.siteCardSubtitle}>
                                    {selectedSite ? 'Tap to change site' : 'Open starry body guide'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Insulin Details Section */}
                    <View style={insulinLoggingScreenStyles.section}>
                        <Text style={insulinLoggingScreenStyles.sectionTitle}>💉 Insulin Details</Text>
                        
                        <View style={insulinLoggingScreenStyles.inputCard}>
                            <Text style={insulinLoggingScreenStyles.inputLabel}>Units *</Text>
                            <TextInput
                                style={insulinLoggingScreenStyles.textInput}
                                value={insulinUnits}
                                onChangeText={setInsulinUnits}
                                placeholder="Enter units (1-100)"
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={insulinLoggingScreenStyles.inputCard}>
                            <Text style={insulinLoggingScreenStyles.inputLabel}>Insulin Type</Text>
                            <View style={insulinLoggingScreenStyles.segmentedControl}>
                                <TouchableOpacity
                                    style={[
                                        insulinLoggingScreenStyles.segmentButton,
                                        insulinType === 'short-acting' && insulinLoggingScreenStyles.segmentButtonActive
                                    ]}
                                    onPress={() => setInsulinType('short-acting')}
                                >
                                    <Text style={[
                                        insulinLoggingScreenStyles.segmentButtonText,
                                        insulinType === 'short-acting' && insulinLoggingScreenStyles.segmentButtonTextActive
                                    ]}>Short-Acting</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        insulinLoggingScreenStyles.segmentButton,
                                        insulinType === 'long-acting' && insulinLoggingScreenStyles.segmentButtonActive
                                    ]}
                                    onPress={() => setInsulinType('long-acting')}
                                >
                                    <Text style={[
                                        insulinLoggingScreenStyles.segmentButtonText,
                                        insulinType === 'long-acting' && insulinLoggingScreenStyles.segmentButtonTextActive
                                    ]}>Long-Acting</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={insulinLoggingScreenStyles.inputCard}>
                            <Text style={insulinLoggingScreenStyles.inputLabel}>Meal Timing</Text>
                            <View style={insulinLoggingScreenStyles.segmentedControl}>
                                <TouchableOpacity
                                    style={[
                                        insulinLoggingScreenStyles.segmentButton,
                                        mealTiming === 'before' && insulinLoggingScreenStyles.segmentButtonActive
                                    ]}
                                    onPress={() => setMealTiming('before')}
                                >
                                    <Text style={[
                                        insulinLoggingScreenStyles.segmentButtonText,
                                        mealTiming === 'before' && insulinLoggingScreenStyles.segmentButtonTextActive
                                    ]}>Before Meal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        insulinLoggingScreenStyles.segmentButton,
                                        mealTiming === 'after' && insulinLoggingScreenStyles.segmentButtonActive
                                    ]}
                                    onPress={() => setMealTiming('after')}
                                >
                                    <Text style={[
                                        insulinLoggingScreenStyles.segmentButtonText,
                                        mealTiming === 'after' && insulinLoggingScreenStyles.segmentButtonTextActive
                                    ]}>After Meal</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={insulinLoggingScreenStyles.inputCard}>
                            <Text style={insulinLoggingScreenStyles.inputLabel}>Notes (Optional)</Text>
                            <TextInput
                                style={[insulinLoggingScreenStyles.textInput, insulinLoggingScreenStyles.notesInput]}
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="Additional notes or observations..."
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>

                    {/* Log Button */}
                    <View style={insulinLoggingScreenStyles.buttonSection}>
                        <TouchableOpacity
                            style={insulinLoggingScreenStyles.logButton}
                            onPress={handleLogInsulin}
                        >
                            <LinearGradient
                                colors={['#10b981', '#059669']}
                                style={insulinLoggingScreenStyles.logButtonGradient}
                            >
                                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                                <Text style={insulinLoggingScreenStyles.logButtonText}>Log Insulin</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom padding */}
                    <View style={insulinLoggingScreenStyles.bottomPadding} />
                </ScrollView>
            </LinearGradient>

            {/* Starry Body Diagram Modal */}
            {showBodyDiagram && (
                <StarryBodyDiagram
                    selectedSite={selectedSite}
                    onSiteSelect={handleSiteSelection}
                    userRole={userProfile?.role || 'caretaker'}
                    onClose={() => setShowBodyDiagram(false)}
                />
            )}
        </SafeAreaView>
    );
}
