// components/coreComponents/InsulinMonitoringHub.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../firebase/AuthContext';
import InsulinEntryForm from './InsulinEntryForm';
import InsulinReadingsViewer from './InsulinReadingsViewer';
import insulinHubStyles from '../../assets/styles/componentStyles/insulinHubStyles';

interface InsulinMonitoringHubProps {
    onClose: () => void;
    patientId?: string; // For caretaker/doctor access
}

export default function InsulinMonitoringHub({ onClose, patientId }: InsulinMonitoringHubProps) {
    const { userProfile } = useAuth();
    const [showEntryForm, setShowEntryForm] = useState(false);
    const [showReadingsViewer, setShowReadingsViewer] = useState(false);

    const isPatientOrCaretaker = userProfile?.role === 'patient' || userProfile?.role === 'caretaker';
    const canViewData = ['patient', 'caretaker', 'doctor', 'admin'].includes(userProfile?.role || '');

    const handleEntrySuccess = () => {
        console.log('Insulin entry saved successfully');
        setShowEntryForm(false);
        // Could add success animation or refresh data
    };

    const getWelcomeMessage = () => {
        if (patientId) {
            return `Managing insulin records for patient`;
        }
        return `Hello ${userProfile?.firstName || 'there'}! Track your insulin injections here.`;
    };

    const getHubTitle = () => {
        if (patientId) {
            return 'Patient Insulin Management';
        }
        return 'Insulin Monitoring';
    };

    const renderWelcomeSection = () => (
        <View style={insulinHubStyles.welcomeSection}>
            <View style={insulinHubStyles.welcomeIcon}>
                <Ionicons name="medical" size={32} color="#4c669f" />
            </View>
            <Text style={insulinHubStyles.welcomeTitle}>{getHubTitle()}</Text>
            <Text style={insulinHubStyles.welcomeMessage}>{getWelcomeMessage()}</Text>
        </View>
    );

    const renderActionButtons = () => (
        <View style={insulinHubStyles.actionSection}>
            {/* Log Insulin Button - Available to patients and caretakers */}
            {isPatientOrCaretaker && (
                <TouchableOpacity
                    style={insulinHubStyles.actionButton}
                    onPress={() => setShowEntryForm(true)}
                >
                    <View style={[insulinHubStyles.actionIcon, { backgroundColor: '#4c669f' }]}>
                        <Ionicons name="add-circle" size={24} color="#fff" />
                    </View>
                    <View style={insulinHubStyles.actionContent}>
                        <Text style={insulinHubStyles.actionTitle}>Log Insulin</Text>
                        <Text style={insulinHubStyles.actionDescription}>
                            Record a new insulin injection with site rotation recommendations
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
            )}

            {/* View History Button - Available to all roles */}
            {canViewData && (
                <TouchableOpacity
                    style={insulinHubStyles.actionButton}
                    onPress={() => setShowReadingsViewer(true)}
                >
                    <View style={[insulinHubStyles.actionIcon, { backgroundColor: '#FF6B6B' }]}>
                        <Ionicons name="analytics" size={24} color="#fff" />
                    </View>
                    <View style={insulinHubStyles.actionContent}>
                        <Text style={insulinHubStyles.actionTitle}>View History</Text>
                        <Text style={insulinHubStyles.actionDescription}>
                            Review insulin records and injection site patterns
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
            )}
        </View>
    );

    const renderTipsSection = () => (
        <View style={insulinHubStyles.tipsSection}>
            <Text style={insulinHubStyles.tipsTitle}>💡 Injection Tips</Text>
            <View style={insulinHubStyles.tipsList}>
                <View style={insulinHubStyles.tipItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4c669f" />
                    <Text style={insulinHubStyles.tipText}>
                        Rotate injection sites to prevent lipodystrophy
                    </Text>
                </View>
                <View style={insulinHubStyles.tipItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4c669f" />
                    <Text style={insulinHubStyles.tipText}>
                        Allow insulin to reach room temperature before injection
                    </Text>
                </View>
                <View style={insulinHubStyles.tipItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4c669f" />
                    <Text style={insulinHubStyles.tipText}>
                        Use our recommendation system for optimal site rotation
                    </Text>
                </View>
                {userProfile?.role === 'patient' && (
                    <View style={insulinHubStyles.tipItem}>
                        <Ionicons name="information-circle" size={16} color="#FF6B6B" />
                        <Text style={insulinHubStyles.tipText}>
                            Arm injection sites are managed by your caretaker for safety
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <View style={insulinHubStyles.container}>
            {/* Header */}
            <View style={insulinHubStyles.header}>
                <TouchableOpacity onPress={onClose} style={insulinHubStyles.closeButton}>
                    <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
                <Text style={insulinHubStyles.headerTitle}>Insulin Monitoring</Text>
                <View style={insulinHubStyles.headerSpacer} />
            </View>

            {/* Content */}
            <View style={insulinHubStyles.content}>
                {renderWelcomeSection()}
                {renderActionButtons()}
                {renderTipsSection()}
            </View>

            {/* Entry Form Modal */}
            <Modal
                visible={showEntryForm}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowEntryForm(false)}
            >
                <InsulinEntryForm
                    onClose={() => setShowEntryForm(false)}
                    onSuccess={handleEntrySuccess}
                />
            </Modal>

            {/* Readings Viewer Modal */}
            <Modal
                visible={showReadingsViewer}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowReadingsViewer(false)}
            >
                <InsulinReadingsViewer
                    onClose={() => setShowReadingsViewer(false)}
                    patientId={patientId}
                />
            </Modal>
        </View>
    );
}
