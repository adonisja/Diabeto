// components/coreComponents/GlucoseMonitoringHub.tsx

import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Modal,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlucoseEntryForm from './GlucoseEntryForm';
import GlucoseReadingsViewer from './GlucoseReadingsViewer';
import CGMIntegration from './CGMIntegration';
import glucoseHubStyles from '../../assets/styles/componentStyles/glucoseHubStyles';

interface GlucoseMonitoringHubProps {
    onClose: () => void;
    userRole?: string;
}

export default function GlucoseMonitoringHub({ onClose, userRole = 'patient' }: GlucoseMonitoringHubProps) {
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [showCGMScreen, setShowCGMScreen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const handleManualEntrySuccess = () => {
        console.log('Manual glucose entry saved successfully');
        setShowManualEntry(false);
        // Could trigger a refresh or show success message
    };

    const handleCGMSuccess = () => {
        console.log('CGM data synced successfully');
        setShowCGMScreen(false);
        // Could trigger a refresh or show success message
    };

    const getRoleSpecificText = () => {
        switch (userRole) {
            case 'caretaker':
                return {
                    title: 'Patient Glucose Monitoring',
                    manualTitle: 'Manual Entry',
                    manualSubtitle: 'Log glucose reading for patient',
                    cgmTitle: 'CGM Integration',
                    cgmSubtitle: 'Sync patient\'s CGM data',
                    historyTitle: 'Patient History'
                };
            case 'doctor':
                return {
                    title: 'Patient Glucose Monitoring',
                    manualTitle: 'Manual Entry',
                    manualSubtitle: 'Log glucose reading for patient',
                    cgmTitle: 'CGM Integration',
                    cgmSubtitle: 'Review patient\'s CGM data',
                    historyTitle: 'Patient History'
                };
            default:
                return {
                    title: 'Glucose Monitoring',
                    manualTitle: 'Manual Entry',
                    manualSubtitle: 'Log your glucose reading',
                    cgmTitle: 'CGM Integration',
                    cgmSubtitle: 'Sync your CGM device',
                    historyTitle: 'Your History'
                };
        }
    };

    const text = getRoleSpecificText();

    return (
        <View style={glucoseHubStyles.container}>
            {/* Header */}
            <View style={glucoseHubStyles.header}>
                <TouchableOpacity onPress={onClose} style={glucoseHubStyles.closeButton}>
                    <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
                <Text style={glucoseHubStyles.headerTitle}>{text.title}</Text>
                <View style={glucoseHubStyles.headerSpacer} />
            </View>

            <ScrollView style={glucoseHubStyles.content} showsVerticalScrollIndicator={false}>
                {/* Introduction */}
                <View style={glucoseHubStyles.introContainer}>
                    <Ionicons name="analytics" size={48} color="#4c669f" />
                    <Text style={glucoseHubStyles.introTitle}>Choose Your Monitoring Method</Text>
                    <Text style={glucoseHubStyles.introText}>
                        Track glucose levels manually or sync with your continuous glucose monitor (CGM)
                    </Text>
                </View>

                {/* Monitoring Options */}
                <View style={glucoseHubStyles.optionsContainer}>
                    {/* Manual Entry Option */}
                    <TouchableOpacity
                        style={glucoseHubStyles.optionCard}
                        onPress={() => setShowManualEntry(true)}
                    >
                        <View style={glucoseHubStyles.optionHeader}>
                            <View style={[glucoseHubStyles.optionIcon, { backgroundColor: '#4ECDC4' }]}>
                                <Ionicons name="create" size={24} color="#fff" />
                            </View>
                            <View style={glucoseHubStyles.optionContent}>
                                <Text style={glucoseHubStyles.optionTitle}>{text.manualTitle}</Text>
                                <Text style={glucoseHubStyles.optionSubtitle}>{text.manualSubtitle}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#666" />
                        </View>
                        <Text style={glucoseHubStyles.optionDescription}>
                            Enter glucose readings manually using a traditional glucose meter
                        </Text>
                        <View style={glucoseHubStyles.optionFeatures}>
                            <View style={glucoseHubStyles.featureItem}>
                                <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                                <Text style={glucoseHubStyles.featureText}>Quick & easy entry</Text>
                            </View>
                            <View style={glucoseHubStyles.featureItem}>
                                <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                                <Text style={glucoseHubStyles.featureText}>Add notes & context</Text>
                            </View>
                            <View style={glucoseHubStyles.featureItem}>
                                <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                                <Text style={glucoseHubStyles.featureText}>Immediate feedback</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* CGM Integration Option */}
                    <TouchableOpacity
                        style={glucoseHubStyles.optionCard}
                        onPress={() => setShowCGMScreen(true)}
                    >
                        <View style={glucoseHubStyles.optionHeader}>
                            <View style={[glucoseHubStyles.optionIcon, { backgroundColor: '#FF6B6B' }]}>
                                <Ionicons name="cellular" size={24} color="#fff" />
                            </View>
                            <View style={glucoseHubStyles.optionContent}>
                                <Text style={glucoseHubStyles.optionTitle}>{text.cgmTitle}</Text>
                                <Text style={glucoseHubStyles.optionSubtitle}>{text.cgmSubtitle}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#666" />
                        </View>
                        <Text style={glucoseHubStyles.optionDescription}>
                            Connect and sync data from your continuous glucose monitor
                        </Text>
                        <View style={glucoseHubStyles.optionFeatures}>
                            <View style={glucoseHubStyles.featureItem}>
                                <Ionicons name="checkmark-circle" size={16} color="#FF6B6B" />
                                <Text style={glucoseHubStyles.featureText}>Continuous monitoring</Text>
                            </View>
                            <View style={glucoseHubStyles.featureItem}>
                                <Ionicons name="checkmark-circle" size={16} color="#FF6B6B" />
                                <Text style={glucoseHubStyles.featureText}>Automatic data sync</Text>
                            </View>
                            <View style={glucoseHubStyles.featureItem}>
                                <Ionicons name="checkmark-circle" size={16} color="#FF6B6B" />
                                <Text style={glucoseHubStyles.featureText}>Trend analysis</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* History/Analytics Option */}
                    <TouchableOpacity
                        style={glucoseHubStyles.optionCard}
                        onPress={() => setShowHistory(true)}
                    >
                        <View style={glucoseHubStyles.optionHeader}>
                            <View style={[glucoseHubStyles.optionIcon, { backgroundColor: '#FFE66D' }]}>
                                <Ionicons name="bar-chart" size={24} color="#fff" />
                            </View>
                            <View style={glucoseHubStyles.optionContent}>
                                <Text style={glucoseHubStyles.optionTitle}>{text.historyTitle}</Text>
                                <Text style={glucoseHubStyles.optionSubtitle}>View readings & trends</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#666" />
                        </View>
                        <Text style={glucoseHubStyles.optionDescription}>
                            Review historical data and identify patterns in glucose levels
                        </Text>
                        <View style={glucoseHubStyles.optionFeatures}>
                            <View style={glucoseHubStyles.featureItem}>
                                <Ionicons name="checkmark-circle" size={16} color="#FFE66D" />
                                <Text style={glucoseHubStyles.featureText}>Historical trends</Text>
                            </View>
                            <View style={glucoseHubStyles.featureItem}>
                                <Ionicons name="checkmark-circle" size={16} color="#FFE66D" />
                                <Text style={glucoseHubStyles.featureText}>Pattern recognition</Text>
                            </View>
                            <View style={glucoseHubStyles.featureItem}>
                                <Ionicons name="checkmark-circle" size={16} color="#FFE66D" />
                                <Text style={glucoseHubStyles.featureText}>Progress tracking</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Quick Stats or Tips */}
                <View style={glucoseHubStyles.tipContainer}>
                    <Ionicons name="information-circle" size={20} color="#4c669f" />
                    <Text style={glucoseHubStyles.tipText}>
                        Tip: For best results, combine manual entries with CGM data to get a complete picture of your glucose patterns.
                    </Text>
                </View>
            </ScrollView>

            {/* Manual Entry Modal */}
            <Modal
                visible={showManualEntry}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowManualEntry(false)}
            >
                <GlucoseEntryForm
                    onClose={() => setShowManualEntry(false)}
                    onSuccess={handleManualEntrySuccess}
                />
            </Modal>

            {/* CGM Screen Modal */}
            <Modal
                visible={showCGMScreen}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowCGMScreen(false)}
            >
                <CGMIntegration
                    onClose={() => setShowCGMScreen(false)}
                    onSuccess={handleCGMSuccess}
                />
            </Modal>

            {/* History Modal */}
            <Modal
                visible={showHistory}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowHistory(false)}
            >
                <GlucoseReadingsViewer
                    onClose={() => setShowHistory(false)}
                />
            </Modal>
        </View>
    );
}
