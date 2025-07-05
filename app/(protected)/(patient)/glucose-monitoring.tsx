// app/(protected)/(patient)/glucose-monitoring.tsx

import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../firebase/AuthContext';
import GlucoseEntryForm from '../../../components/coreComponents/GlucoseEntryForm';
import GlucoseReadingsViewer from '../../../components/coreComponents/GlucoseReadingsViewer';
import CGMIntegration from '../../../components/coreComponents/CGMIntegration';
import glucoseMonitoringScreenStyles from '../../../assets/styles/protectedStyles/patientStyles/glucoseMonitoringScreenStyles';

export default function GlucoseMonitoringScreen() {
    const router = useRouter();
    const { userProfile } = useAuth();
    const [activeView, setActiveView] = useState<'hub' | 'entry' | 'history' | 'cgm'>('hub');

    const handleViewChange = (view: 'hub' | 'entry' | 'history' | 'cgm') => {
        setActiveView(view);
    };

    const handleEntrySuccess = () => {
        console.log('Glucose entry saved successfully');
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
                    <GlucoseEntryForm 
                        onSuccess={handleEntrySuccess}
                        onClose={() => setActiveView('hub')}
                    />
                );
            case 'history':
                return (
                    <GlucoseReadingsViewer 
                        onClose={() => setActiveView('hub')}
                    />
                );
            case 'cgm':
                return (
                    <CGMIntegration 
                        onClose={() => setActiveView('hub')}
                    />
                );
            default:
                return renderHub();
        }
    };

    const renderHub = () => (
        <ScrollView 
            style={glucoseMonitoringScreenStyles.content} 
            showsVerticalScrollIndicator={false}
            bounces={true}
        >
            {/* Welcome Card with Vibrant Design */}
            <LinearGradient
                colors={['#ff9a9e', '#fecfef']}
                style={glucoseMonitoringScreenStyles.welcomeCard}
            >
                <View style={glucoseMonitoringScreenStyles.welcomeIcon}>
                    <Ionicons name="analytics" size={32} color="#ff6b9d" />
                </View>
                <Text style={glucoseMonitoringScreenStyles.welcomeTitle}>
                    Hello, {userProfile?.firstName || 'Champion'}! 🌟
                </Text>
                <Text style={glucoseMonitoringScreenStyles.welcomeMessage}>
                    Keep track of your glucose levels and stay healthy! Choose your monitoring method below.
                </Text>
            </LinearGradient>

            {/* Monitoring Options with Vibrant Cards */}
            <View style={glucoseMonitoringScreenStyles.optionsContainer}>
                {/* Manual Entry Option - Emerald Green */}
                <TouchableOpacity
                    style={glucoseMonitoringScreenStyles.optionCard}
                    onPress={() => handleViewChange('entry')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#43e97b', '#38f9d7']}
                        style={glucoseMonitoringScreenStyles.optionGradient}
                    >
                        <View style={glucoseMonitoringScreenStyles.optionHeader}>
                            <View style={glucoseMonitoringScreenStyles.optionIconContainer}>
                                <Ionicons name="create-outline" size={28} color="#fff" />
                            </View>
                            <View style={glucoseMonitoringScreenStyles.optionContent}>
                                <Text style={glucoseMonitoringScreenStyles.optionTitle}>✨ Quick Entry</Text>
                                <Text style={glucoseMonitoringScreenStyles.optionSubtitle}>
                                    Log your glucose reading
                                </Text>
                            </View>
                            <View style={glucoseMonitoringScreenStyles.optionArrow}>
                                <Ionicons name="chevron-forward" size={24} color="#fff" />
                            </View>
                        </View>
                        <Text style={glucoseMonitoringScreenStyles.optionDescription}>
                            🎯 Smart finger rotation • ⚡ Instant feedback • 📊 Real-time insights
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* History Viewer Option - Ocean Blue */}
                <TouchableOpacity
                    style={glucoseMonitoringScreenStyles.optionCard}
                    onPress={() => handleViewChange('history')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#4facfe', '#00f2fe']}
                        style={glucoseMonitoringScreenStyles.optionGradient}
                    >
                        <View style={glucoseMonitoringScreenStyles.optionHeader}>
                            <View style={glucoseMonitoringScreenStyles.optionIconContainer}>
                                <Ionicons name="stats-chart-outline" size={28} color="#fff" />
                            </View>
                            <View style={glucoseMonitoringScreenStyles.optionContent}>
                                <Text style={glucoseMonitoringScreenStyles.optionTitle}>📈 My History</Text>
                                <Text style={glucoseMonitoringScreenStyles.optionSubtitle}>
                                    View trends & patterns
                                </Text>
                            </View>
                            <View style={glucoseMonitoringScreenStyles.optionArrow}>
                                <Ionicons name="chevron-forward" size={24} color="#fff" />
                            </View>
                        </View>
                        <Text style={glucoseMonitoringScreenStyles.optionDescription}>
                            📅 Time-based filtering • 🎨 Visual trends • 📤 Export ready
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* CGM Integration Option - Sunset Orange */}
                <TouchableOpacity
                    style={glucoseMonitoringScreenStyles.optionCard}
                    onPress={() => handleViewChange('cgm')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#ff6b6b', '#ffa726']}
                        style={glucoseMonitoringScreenStyles.optionGradient}
                    >
                        <View style={glucoseMonitoringScreenStyles.optionHeader}>
                            <View style={glucoseMonitoringScreenStyles.optionIconContainer}>
                                <Ionicons name="cellular-outline" size={28} color="#fff" />
                            </View>
                            <View style={glucoseMonitoringScreenStyles.optionContent}>
                                <Text style={glucoseMonitoringScreenStyles.optionTitle}>🔗 CGM Sync</Text>
                                <Text style={glucoseMonitoringScreenStyles.optionSubtitle}>
                                    Connect your device
                                </Text>
                            </View>
                            <View style={glucoseMonitoringScreenStyles.optionArrow}>
                                <Ionicons name="chevron-forward" size={24} color="#fff" />
                            </View>
                        </View>
                        <Text style={glucoseMonitoringScreenStyles.optionDescription}>
                            📡 Real-time sync • 🔄 Auto-updates • 💾 Cloud backup
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Health Tips Card */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={glucoseMonitoringScreenStyles.tipsCard}
            >
                <View style={glucoseMonitoringScreenStyles.tipsHeader}>
                    <Ionicons name="bulb-outline" size={24} color="#fff" />
                    <Text style={glucoseMonitoringScreenStyles.tipsTitle}>💡 Pro Tips</Text>
                </View>
                <Text style={glucoseMonitoringScreenStyles.tipsText}>
                    • Test at consistent times daily{'\n'}
                    • Keep your meter clean and calibrated{'\n'}
                    • Log any symptoms or unusual readings{'\n'}
                    • Share patterns with your healthcare team
                </Text>
            </LinearGradient>
        </ScrollView>
    );

    return (
        <SafeAreaView style={glucoseMonitoringScreenStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#ff6b9d" />
            
            {/* Header with Dynamic Gradient */}
            <LinearGradient
                colors={['#ff6b9d', '#f093fb', '#c471f5']}
                style={glucoseMonitoringScreenStyles.headerGradient}
            >
                <View style={glucoseMonitoringScreenStyles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={glucoseMonitoringScreenStyles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={glucoseMonitoringScreenStyles.headerContent}>
                        <Text style={glucoseMonitoringScreenStyles.headerTitle}>
                            {activeView === 'hub' ? 'Glucose Monitoring' : 
                             activeView === 'entry' ? 'Log Reading' :
                             activeView === 'history' ? 'My History' : 'CGM Sync'}
                        </Text>
                        <Text style={glucoseMonitoringScreenStyles.headerSubtitle}>
                            {activeView === 'hub' ? 'Track your glucose levels with precision ✨' : 
                             activeView === 'entry' ? 'Quick and easy glucose logging 🎯' :
                             activeView === 'history' ? 'Review your glucose patterns 📈' : 'Connect your CGM device 🔗'}
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            {renderContent()}
        </SafeAreaView>
    );
}
