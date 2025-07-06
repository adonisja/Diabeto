// app/(protected)/(caretaker)/index.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../firebase/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../../components/coreComponents/AppHeader';
import DoctorCredentialRequest from '../../../components/coreComponents/DoctorCredentialRequest';
import MedicalAlertsPanel from '../../../components/coreComponents/MedicalAlertsPanel';
import NotificationSettings from '../../../components/coreComponents/NotificationSettings';
import caretakerDashboardStyles from '../../../assets/styles/protectedStyles/caretakerStyles/caretakerDashboardStyles';

export default function CaretakerDashboardScreen() {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    const [showDoctorRequest, setShowDoctorRequest] = useState(false);
    const [showNotificationSettings, setShowNotificationSettings] = useState(false);

    const handleGlucoseMonitoring = () => {
        router.push('/(protected)/(patient)/glucose-monitoring');
    };

    const handleInsulinMonitoring = () => {
        router.push('/(protected)/(caretaker)/insulin-logging');
    };

    const handleInvitePatient = () => {
        router.push('/(protected)/(caretaker)/invite-patient');
    };

    const handleViewPatients = () => {
        Alert.alert("View Patients", "Patient viewing features coming soon!");
    };

    const handlePatientManagement = () => {
        Alert.alert("Patient Management", "Patient management features coming soon!");
    };

    const handleDoctorRequest = () => {
        setShowDoctorRequest(true);
    };

    const handleNotificationSettings = () => {
        setShowNotificationSettings(true);
    };

    const handleRequestSubmitted = () => {
        setShowDoctorRequest(false);
        Alert.alert(
            "Request Submitted", 
            "Your doctor credential verification request has been submitted successfully!"
        );
    };

    return (
        <SafeAreaView style={caretakerDashboardStyles.outerContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#6b46c1" />
            
            {/* App Header with User Menu */}
            <AppHeader 
                title="Diabeto"
                gradient={['#6b46c1', '#8b5cf6', '#a855f7']}
            />
            
            {/* Animated gradient background with caretaker colors */}
            <LinearGradient
                colors={['#6b46c1', '#8b5cf6', '#a855f7']}
                style={caretakerDashboardStyles.backgroundGradient}
            >
                <ScrollView 
                    style={caretakerDashboardStyles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Welcome Hero Section */}
                    <View style={caretakerDashboardStyles.heroSection}>
                        <View style={caretakerDashboardStyles.welcomeCard}>
                            <Text style={caretakerDashboardStyles.welcomeEmoji}>💜</Text>
                            <Text style={caretakerDashboardStyles.welcomeText}>
                                Welcome, {userProfile?.firstName || 'Caretaker'}!
                            </Text>
                            <Text style={caretakerDashboardStyles.motivationalText}>
                                Caring for others with dedication and love 🤗
                            </Text>
                        </View>
                    </View>

                    {/* Quick Actions Grid */}
                    <View style={caretakerDashboardStyles.actionsGrid}>
                        <TouchableOpacity
                            style={[caretakerDashboardStyles.actionCard, caretakerDashboardStyles.glucoseCard]}
                            onPress={handleGlucoseMonitoring}
                        >
                            <LinearGradient
                                colors={['#10b981', '#059669']}
                                style={caretakerDashboardStyles.cardGradient}
                            >
                                <Ionicons name="pulse" size={32} color="#fff" />
                                <Text style={caretakerDashboardStyles.cardTitle}>Glucose</Text>
                                <Text style={caretakerDashboardStyles.cardSubtitle}>Patient Monitoring</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[caretakerDashboardStyles.actionCard, caretakerDashboardStyles.insulinCard]}
                            onPress={handleInsulinMonitoring}
                        >
                            <LinearGradient
                                colors={['#f59e0b', '#d97706']}
                                style={caretakerDashboardStyles.cardGradient}
                            >
                                <Ionicons name="medical" size={32} color="#fff" />
                                <Text style={caretakerDashboardStyles.cardTitle}>Insulin</Text>
                                <Text style={caretakerDashboardStyles.cardSubtitle}>✨ Starry Guide</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[caretakerDashboardStyles.actionCard, caretakerDashboardStyles.inviteCard]}
                            onPress={handleInvitePatient}
                        >
                            <LinearGradient
                                colors={['#ec4899', '#be185d']}
                                style={caretakerDashboardStyles.cardGradient}
                            >
                                <Ionicons name="person-add" size={32} color="#fff" />
                                <Text style={caretakerDashboardStyles.cardTitle}>Invite</Text>
                                <Text style={caretakerDashboardStyles.cardSubtitle}>Add Patient</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[caretakerDashboardStyles.actionCard, caretakerDashboardStyles.patientsCard]}
                            onPress={handleViewPatients}
                        >
                            <LinearGradient
                                colors={['#3b82f6', '#1d4ed8']}
                                style={caretakerDashboardStyles.cardGradient}
                            >
                                <Ionicons name="people" size={32} color="#fff" />
                                <Text style={caretakerDashboardStyles.cardTitle}>Patients</Text>
                                <Text style={caretakerDashboardStyles.cardSubtitle}>View & Manage</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[caretakerDashboardStyles.actionCard]}
                            onPress={handleNotificationSettings}
                        >
                            <LinearGradient
                                colors={['#f59e0b', '#d97706']}
                                style={caretakerDashboardStyles.cardGradient}
                            >
                                <Ionicons name="notifications" size={32} color="#fff" />
                                <Text style={caretakerDashboardStyles.cardTitle}>Alerts</Text>
                                <Text style={caretakerDashboardStyles.cardSubtitle}>Notification Settings</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Doctor Upgrade Section */}
                    <View style={caretakerDashboardStyles.upgradeSection}>
                        <Text style={caretakerDashboardStyles.sectionTitle}>⚕️ Professional Upgrade</Text>
                        <View style={caretakerDashboardStyles.upgradeCard}>
                            <Ionicons name="medical" size={24} color="#fbbf24" />
                            <Text style={caretakerDashboardStyles.upgradeCardTitle}>
                                Upgrade to Doctor
                            </Text>
                            <Text style={caretakerDashboardStyles.upgradeCardText}>
                                Licensed medical professional? Get verified for advanced features.
                            </Text>
                            <TouchableOpacity
                                style={caretakerDashboardStyles.upgradeButton}
                                onPress={handleDoctorRequest}
                            >
                                <Ionicons name="arrow-up-circle" size={16} color="#fff" />
                                <Text style={caretakerDashboardStyles.upgradeButtonText}>
                                    Request Verification
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Medical Alerts Panel */}
                    <View style={caretakerDashboardStyles.alertsContainer}>
                        <MedicalAlertsPanel userRole="caretaker" />
                    </View>

                    {/* Care Tips Section */}
                    <View style={caretakerDashboardStyles.tipsSection}>
                        <Text style={caretakerDashboardStyles.sectionTitle}>💡 Caretaker Tips</Text>
                        <View style={caretakerDashboardStyles.tipCard}>
                            <Ionicons name="heart" size={20} color="#ec4899" />
                            <Text style={caretakerDashboardStyles.tipText}>
                                Regular communication helps patients feel supported and confident.
                            </Text>
                        </View>
                        <View style={caretakerDashboardStyles.tipCard}>
                            <Ionicons name="clipboard" size={20} color="#f59e0b" />
                            <Text style={caretakerDashboardStyles.tipText}>
                                Keep detailed records to help identify patterns and improvements.
                            </Text>
                        </View>
                    </View>

                    {/* Bottom padding for scroll */}
                    <View style={caretakerDashboardStyles.bottomPadding} />
                </ScrollView>
            </LinearGradient>

            {/* Doctor Credential Request Modal */}
            <Modal
                visible={showDoctorRequest}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowDoctorRequest(false)}
            >
                <View style={caretakerDashboardStyles.modalContainer}>
                    <View style={caretakerDashboardStyles.modalHeader}>
                        <TouchableOpacity
                            style={caretakerDashboardStyles.closeButton}
                            onPress={() => setShowDoctorRequest(false)}
                        >
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <DoctorCredentialRequest onRequestSubmitted={handleRequestSubmitted} />
                </View>
            </Modal>

            {/* Notification Settings Modal */}
            <Modal
                visible={showNotificationSettings}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowNotificationSettings(false)}
            >
                <NotificationSettings onClose={() => setShowNotificationSettings(false)} />
            </Modal>
        </SafeAreaView>
    );
}

