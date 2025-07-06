// app/(protected)/(patient)/heart-rate-monitoring.tsx
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
import { logAction } from '../../../firebase/LogService';
import HeartRateEntryForm from '../../../components/coreComponents/HeartRateEntryForm';
import HeartRateReadingsViewer from '../../../components/coreComponents/HeartRateReadingsViewer';
import HeartRateDeviceIntegration from '../../../components/coreComponents/HeartRateDeviceIntegration';
import heartRateMonitoringScreenStyles from '../../../assets/styles/protectedStyles/patientStyles/heartRateMonitoringScreenStyles';

export default function HeartRateMonitoringScreen() {
    const router = useRouter();
    const { user, userProfile } = useAuth();
    const [activeView, setActiveView] = useState<'hub' | 'entry' | 'history' | 'devices'>('hub');

    // Log screen access for medical audit trail
    React.useEffect(() => {
        const logScreenAccess = async () => {
            await logAction(
                user?.uid || '',
                userProfile?.username || '',
                user?.email || '',
                userProfile?.role || 'patient',
                'HEART_RATE_MONITORING_SCREEN_ACCESSED',
                'success',
                {
                    screenName: 'heart-rate-monitoring',
                    entrySource: 'Patient Navigation'
                }
            );
        };

        logScreenAccess();
    }, [user, userProfile]);

    const handleViewChange = async (view: 'hub' | 'entry' | 'history' | 'devices') => {
        setActiveView(view);
        
        // Log navigation within heart rate monitoring
        await logAction(
            user?.uid || '',
            userProfile?.username || '',
            user?.email || '',
            userProfile?.role || 'patient',
            'HEART_RATE_MONITORING_VIEW_CHANGED',
            'success',
            {
                previousView: activeView,
                newView: view,
                screenName: 'heart-rate-monitoring'
            }
        );
    };

    const handleEntrySuccess = () => {
        console.log('Heart rate entry saved successfully');
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
                    <HeartRateEntryForm 
                        onSuccess={handleEntrySuccess}
                        onClose={() => setActiveView('hub')}
                    />
                );
            case 'history':
                return (
                    <HeartRateReadingsViewer 
                        onClose={() => setActiveView('hub')}
                    />
                );
            case 'devices':
                return (
                    <HeartRateDeviceIntegration 
                        onClose={() => setActiveView('hub')}
                    />
                );
            default:
                return renderHub();
        }
    };

    const renderHub = () => (
        <ScrollView 
            style={heartRateMonitoringScreenStyles.content} 
            showsVerticalScrollIndicator={false}
            bounces={true}
        >
            {/* Welcome Card with Vibrant Design */}
            <LinearGradient
                colors={['#ff9a9e', '#fecfef']}
                style={heartRateMonitoringScreenStyles.welcomeCard}
            >
                <View style={heartRateMonitoringScreenStyles.welcomeIcon}>
                    <Ionicons name="heart" size={32} color="#e91e63" />
                </View>
                <Text style={heartRateMonitoringScreenStyles.welcomeTitle}>
                    Hello, {userProfile?.firstName || 'Champion'}! ❤️
                </Text>
                <Text style={heartRateMonitoringScreenStyles.welcomeMessage}>
                    Keep track of your heart rate and cardiovascular health! Choose your monitoring method below.
                </Text>
            </LinearGradient>

            {/* Monitoring Options with Vibrant Cards */}
            <View style={heartRateMonitoringScreenStyles.optionsContainer}>
                {/* Manual Entry Option - Rose Red */}
                <TouchableOpacity
                    style={heartRateMonitoringScreenStyles.optionCard}
                    onPress={() => handleViewChange('entry')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#e91e63', '#f06292']}
                        style={heartRateMonitoringScreenStyles.optionGradient}
                    >
                        <View style={heartRateMonitoringScreenStyles.optionHeader}>
                            <View style={heartRateMonitoringScreenStyles.optionIconContainer}>
                                <Ionicons name="add-circle-outline" size={28} color="#fff" />
                            </View>
                            <View style={heartRateMonitoringScreenStyles.optionContent}>
                                <Text style={heartRateMonitoringScreenStyles.optionTitle}>✨ Quick Entry</Text>
                                <Text style={heartRateMonitoringScreenStyles.optionSubtitle}>
                                    Log your heart rate reading
                                </Text>
                            </View>
                            <View style={heartRateMonitoringScreenStyles.optionArrow}>
                                <Ionicons name="chevron-forward" size={24} color="#fff" />
                            </View>
                        </View>
                        <Text style={heartRateMonitoringScreenStyles.optionDescription}>
                            📝 Manual pulse count • ⚡ Instant feedback • 📊 Real-time insights
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* History Viewer Option - Purple Pink */}
                <TouchableOpacity
                    style={heartRateMonitoringScreenStyles.optionCard}
                    onPress={() => handleViewChange('history')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#9c27b0', '#e1bee7']}
                        style={heartRateMonitoringScreenStyles.optionGradient}
                    >
                        <View style={heartRateMonitoringScreenStyles.optionHeader}>
                            <View style={heartRateMonitoringScreenStyles.optionIconContainer}>
                                <Ionicons name="stats-chart-outline" size={28} color="#fff" />
                            </View>
                            <View style={heartRateMonitoringScreenStyles.optionContent}>
                                <Text style={heartRateMonitoringScreenStyles.optionTitle}>📈 My History</Text>
                                <Text style={heartRateMonitoringScreenStyles.optionSubtitle}>
                                    View trends & patterns
                                </Text>
                            </View>
                            <View style={heartRateMonitoringScreenStyles.optionArrow}>
                                <Ionicons name="chevron-forward" size={24} color="#fff" />
                            </View>
                        </View>
                        <Text style={heartRateMonitoringScreenStyles.optionDescription}>
                            📅 Time-based filtering • 🎨 Visual trends • 📤 Export ready
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Device Integration Option - Coral Orange */}
                <TouchableOpacity
                    style={heartRateMonitoringScreenStyles.optionCard}
                    onPress={() => handleViewChange('devices')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#ff5722', '#ffab91']}
                        style={heartRateMonitoringScreenStyles.optionGradient}
                    >
                        <View style={heartRateMonitoringScreenStyles.optionHeader}>
                            <View style={heartRateMonitoringScreenStyles.optionIconContainer}>
                                <Ionicons name="watch-outline" size={28} color="#fff" />
                            </View>
                            <View style={heartRateMonitoringScreenStyles.optionContent}>
                                <Text style={heartRateMonitoringScreenStyles.optionTitle}>⌚ Device Sync</Text>
                                <Text style={heartRateMonitoringScreenStyles.optionSubtitle}>
                                    Connect your devices
                                </Text>
                            </View>
                            <View style={heartRateMonitoringScreenStyles.optionArrow}>
                                <Ionicons name="chevron-forward" size={24} color="#fff" />
                            </View>
                        </View>
                        <Text style={heartRateMonitoringScreenStyles.optionDescription}>
                            📱 Smartwatch sync • 🔄 Auto-updates • 💾 Cloud backup
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Health Tips Card */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={heartRateMonitoringScreenStyles.tipsCard}
            >
                <View style={heartRateMonitoringScreenStyles.tipsHeader}>
                    <Ionicons name="bulb-outline" size={24} color="#fff" />
                    <Text style={heartRateMonitoringScreenStyles.tipsTitle}>💡 Heart Health Tips</Text>
                </View>
                <Text style={heartRateMonitoringScreenStyles.tipsText}>
                    • Monitor at the same time daily for consistency{'\n'}
                    • Rest for 5 minutes before taking measurements{'\n'}
                    • Note activities that affect your heart rate{'\n'}
                    • Share unusual patterns with your healthcare team
                </Text>
            </LinearGradient>
        </ScrollView>
    );

    return (
        <SafeAreaView style={heartRateMonitoringScreenStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#e91e63" />
            
            {/* Header with Dynamic Gradient */}
            <LinearGradient
                colors={['#e91e63', '#f06292', '#f8bbd9']}
                style={heartRateMonitoringScreenStyles.headerGradient}
            >
                <View style={heartRateMonitoringScreenStyles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={heartRateMonitoringScreenStyles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={heartRateMonitoringScreenStyles.headerContent}>
                        <Text style={heartRateMonitoringScreenStyles.headerTitle}>
                            {activeView === 'hub' ? 'Heart Rate Monitoring' : 
                             activeView === 'entry' ? 'Log Reading' :
                             activeView === 'history' ? 'My History' : 'Device Sync'}
                        </Text>
                        <Text style={heartRateMonitoringScreenStyles.headerSubtitle}>
                            {activeView === 'hub' ? 'Track your cardiovascular health ❤️' : 
                             activeView === 'entry' ? 'Quick and easy heart rate logging 🎯' :
                             activeView === 'history' ? 'Review your heart rate patterns 📈' : 'Connect your devices ⌚'}
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            {renderContent()}
        </SafeAreaView>
    );
}
