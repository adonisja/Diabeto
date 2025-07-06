// app/(protected)/(patient)/blood-pressure-monitoring.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../firebase/AuthContext';
import BloodPressureEntryForm from '../../../components/coreComponents/BloodPressureEntryForm';
import BloodPressureReadingsViewer from '../../../components/coreComponents/BloodPressureReadingsViewer';
import BloodPressureDeviceIntegration from '../../../components/coreComponents/BloodPressureDeviceIntegration';
import bloodPressureMonitoringScreenStyles from '../../../assets/styles/protectedStyles/patientStyles/bloodPressureMonitoringScreenStyles';

export default function BloodPressureMonitoringScreen() {
    const router = useRouter();
    const { userProfile } = useAuth();
    const [activeView, setActiveView] = useState<'hub' | 'entry' | 'history' | 'devices'>('hub');

    const handleViewChange = (view: 'hub' | 'entry' | 'history' | 'devices') => {
        setActiveView(view);
    };

    const handleEntrySuccess = () => {
        console.log('Blood pressure reading saved successfully');
        setActiveView('hub');
        // Could add success animation or refresh data
    };

    const handleBackPress = () => {
        if (activeView === 'hub') {
            router.back();
        } else {
            setActiveView('hub');
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case 'entry':
                return (
                    <BloodPressureEntryForm 
                        onSuccess={handleEntrySuccess}
                        onClose={() => setActiveView('hub')}
                    />
                );
            case 'history':
                return (
                    <BloodPressureReadingsViewer 
                        onRefresh={() => {
                            // Refresh logic can be added here
                            console.log('Refreshing blood pressure readings');
                        }}
                    />
                );
            case 'devices':
                return (
                    <BloodPressureDeviceIntegration 
                        onReadingsImported={(count: number) => {
                            console.log(`Imported ${count} readings`);
                            setActiveView('history');
                        }}
                    />
                );
            default:
                return renderHub();
        }
    };

    const renderHub = () => (
        <ScrollView 
            style={bloodPressureMonitoringScreenStyles.content} 
            showsVerticalScrollIndicator={false}
            bounces={true}
        >
            {/* Welcome Card with Vibrant Design */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={bloodPressureMonitoringScreenStyles.welcomeCard}
            >
                <View style={bloodPressureMonitoringScreenStyles.welcomeIcon}>
                    <Ionicons name="medical" size={32} color="#5c6ac4" />
                </View>
                <Text style={bloodPressureMonitoringScreenStyles.welcomeTitle}>
                    Hello, {userProfile?.firstName || 'Champion'}! 🩺
                </Text>
                <Text style={bloodPressureMonitoringScreenStyles.welcomeMessage}>
                    Monitor your blood pressure and maintain cardiovascular health! Choose your preferred method below.
                </Text>
            </LinearGradient>

            {/* Monitoring Options with Vibrant Cards */}
            <View style={bloodPressureMonitoringScreenStyles.optionsContainer}>
                {/* Manual Entry Option - Deep Blue */}
                <TouchableOpacity
                    style={bloodPressureMonitoringScreenStyles.optionCard}
                    onPress={() => handleViewChange('entry')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#5c6ac4', '#667eea']}
                        style={bloodPressureMonitoringScreenStyles.optionGradient}
                    >
                        <View style={bloodPressureMonitoringScreenStyles.optionHeader}>
                            <View style={bloodPressureMonitoringScreenStyles.optionIconContainer}>
                                <Ionicons name="add-circle-outline" size={28} color="#fff" />
                            </View>
                            <View style={bloodPressureMonitoringScreenStyles.optionContent}>
                                <Text style={bloodPressureMonitoringScreenStyles.optionTitle}>📝 Quick Entry</Text>
                                <Text style={bloodPressureMonitoringScreenStyles.optionSubtitle}>
                                    Log your BP reading
                                </Text>
                            </View>
                            <View style={bloodPressureMonitoringScreenStyles.optionArrow}>
                                <Ionicons name="chevron-forward" size={24} color="#fff" />
                            </View>
                        </View>
                        <Text style={bloodPressureMonitoringScreenStyles.optionDescription}>
                            🩺 Manual BP entry • 📊 Instant analysis • ⚡ Medical alerts
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* History Viewer Option - Purple Gradient */}
                <TouchableOpacity
                    style={bloodPressureMonitoringScreenStyles.optionCard}
                    onPress={() => handleViewChange('history')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#764ba2', '#667eea']}
                        style={bloodPressureMonitoringScreenStyles.optionGradient}
                    >
                        <View style={bloodPressureMonitoringScreenStyles.optionHeader}>
                            <View style={bloodPressureMonitoringScreenStyles.optionIconContainer}>
                                <Ionicons name="stats-chart-outline" size={28} color="#fff" />
                            </View>
                            <View style={bloodPressureMonitoringScreenStyles.optionContent}>
                                <Text style={bloodPressureMonitoringScreenStyles.optionTitle}>📈 My History</Text>
                                <Text style={bloodPressureMonitoringScreenStyles.optionSubtitle}>
                                    View trends & patterns
                                </Text>
                            </View>
                            <View style={bloodPressureMonitoringScreenStyles.optionArrow}>
                                <Ionicons name="chevron-forward" size={24} color="#fff" />
                            </View>
                        </View>
                        <Text style={bloodPressureMonitoringScreenStyles.optionDescription}>
                            📅 Time-based filtering • 🎨 Visual trends • 📤 Export ready
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Device Integration Option - Indigo Blue */}
                <TouchableOpacity
                    style={bloodPressureMonitoringScreenStyles.optionCard}
                    onPress={() => handleViewChange('devices')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#4c51bf', '#805ad5']}
                        style={bloodPressureMonitoringScreenStyles.optionGradient}
                    >
                        <View style={bloodPressureMonitoringScreenStyles.optionHeader}>
                            <View style={bloodPressureMonitoringScreenStyles.optionIconContainer}>
                                <Ionicons name="pulse-outline" size={28} color="#fff" />
                            </View>
                            <View style={bloodPressureMonitoringScreenStyles.optionContent}>
                                <Text style={bloodPressureMonitoringScreenStyles.optionTitle}>🩺 Device Sync</Text>
                                <Text style={bloodPressureMonitoringScreenStyles.optionSubtitle}>
                                    Connect your BP monitor
                                </Text>
                            </View>
                            <View style={bloodPressureMonitoringScreenStyles.optionArrow}>
                                <Ionicons name="chevron-forward" size={24} color="#fff" />
                            </View>
                        </View>
                        <Text style={bloodPressureMonitoringScreenStyles.optionDescription}>
                            📱 Digital BP monitors • 🔄 Auto-updates • 💾 Cloud backup
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Health Tips Card */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={bloodPressureMonitoringScreenStyles.tipsCard}
            >
                <View style={bloodPressureMonitoringScreenStyles.tipsHeader}>
                    <Ionicons name="bulb-outline" size={24} color="#fff" />
                    <Text style={bloodPressureMonitoringScreenStyles.tipsTitle}>💡 Blood Pressure Tips</Text>
                </View>
                <Text style={bloodPressureMonitoringScreenStyles.tipsText}>
                    • Take readings at the same time daily for consistency{'\n'}
                    • Rest for 5 minutes before taking measurements{'\n'}
                    • Avoid caffeine and exercise 30 minutes before reading{'\n'}
                    • Keep a log to identify patterns and share with your doctor
                </Text>
            </LinearGradient>
        </ScrollView>
    );

    return (
        <SafeAreaView style={bloodPressureMonitoringScreenStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#5c6ac4" />
            
            {/* Header with Dynamic Gradient */}
            <LinearGradient
                colors={['#5c6ac4', '#667eea', '#764ba2']}
                style={bloodPressureMonitoringScreenStyles.headerGradient}
            >
                <View style={bloodPressureMonitoringScreenStyles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={bloodPressureMonitoringScreenStyles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={bloodPressureMonitoringScreenStyles.headerContent}>
                        <Text style={bloodPressureMonitoringScreenStyles.headerTitle}>
                            {activeView === 'hub' ? 'Blood Pressure Monitoring' : 
                             activeView === 'entry' ? 'Log Reading' :
                             activeView === 'history' ? 'My History' : 'Device Sync'}
                        </Text>
                        <Text style={bloodPressureMonitoringScreenStyles.headerSubtitle}>
                            {activeView === 'hub' ? 'Track your cardiovascular health 🩺' : 
                             activeView === 'entry' ? 'Quick and easy BP logging 🎯' :
                             activeView === 'history' ? 'Review your blood pressure patterns 📈' : 'Connect your BP monitors 🩺'}
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            {renderContent()}
        </SafeAreaView>
    );
}
