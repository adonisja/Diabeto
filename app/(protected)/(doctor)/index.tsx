// app/(protected)/(doctor)/index.tsx
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../firebase/AuthContext';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../../components/coreComponents/AppHeader';
import MedicalAlertsPanel from '../../../components/coreComponents/MedicalAlertsPanel';
import { useRouter } from 'expo-router';
import { doctorDashboardStyles } from '../../../assets/styles/protectedStyles/doctorStyles/doctorDashboardStyles';

export default function DoctorDashboard() {
    const { user, userProfile, loadingProfile } = useAuth();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    // The landing page ensures only doctor users can reach this screen

    const handleRefresh = () => {
        setRefreshing(true);
        // Simulate refresh - replace with actual data fetching
        setTimeout(() => {
            setRefreshing(false);
            Alert.alert("Refreshed", "Dashboard data has been updated.");
        }, 1000);
    };

    const handlePatientManagement = () => {
        router.push('/(protected)/(doctor)/patient-dosages');
    };

    const handleMedicalRecords = () => {
        Alert.alert("Medical Records", "Medical records access coming soon!");
    };

    const handleAppointments = () => {
        Alert.alert("Appointments", "Appointment management coming soon!");
    };

    const handleAnalytics = () => {
        Alert.alert("Analytics", "Medical analytics dashboard coming soon!");
    };

    return (
        <View style={doctorDashboardStyles.outerContainer}>
            <AppHeader 
                title={`Welcome, Dr. ${userProfile?.firstName || userProfile?.username || 'Doctor'}!`}
                subtitle="Medical Dashboard"
                gradient={['#2E8B57', '#228B22', '#006400']}
            />
            
            <LinearGradient
                colors={['#2E8B57', '#228B22', '#006400']} // Doctor theme colors
                style={doctorDashboardStyles.container}
            >
            
            <ScrollView 
                contentContainerStyle={doctorDashboardStyles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                {/* Quick Stats */}
                <View style={doctorDashboardStyles.statsContainer}>
                    <View style={doctorDashboardStyles.statCard}>
                        <Ionicons name="people" size={24} color="#2E8B57" />
                        <Text style={doctorDashboardStyles.statNumber}>0</Text>
                        <Text style={doctorDashboardStyles.statLabel}>Active Patients</Text>
                    </View>
                    <View style={doctorDashboardStyles.statCard}>
                        <Ionicons name="calendar" size={24} color="#2E8B57" />
                        <Text style={doctorDashboardStyles.statNumber}>0</Text>
                        <Text style={doctorDashboardStyles.statLabel}>Today's Appointments</Text>
                    </View>
                    <View style={doctorDashboardStyles.statCard}>
                        <Ionicons name="document-text" size={24} color="#2E8B57" />
                        <Text style={doctorDashboardStyles.statNumber}>0</Text>
                        <Text style={doctorDashboardStyles.statLabel}>Pending Reviews</Text>
                    </View>
                </View>

                {/* Action Cards */}
                <View style={doctorDashboardStyles.actionsContainer}>
                    <TouchableOpacity style={doctorDashboardStyles.actionCard} onPress={handlePatientManagement}>
                        <Ionicons name="people-outline" size={32} color="#fff" />
                        <Text style={doctorDashboardStyles.actionTitle}>Patient Management</Text>
                        <Text style={doctorDashboardStyles.actionDescription}>View and manage your patients</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={doctorDashboardStyles.actionCard} onPress={handleMedicalRecords}>
                        <Ionicons name="document-text-outline" size={32} color="#fff" />
                        <Text style={doctorDashboardStyles.actionTitle}>Medical Records</Text>
                        <Text style={doctorDashboardStyles.actionDescription}>Access patient medical histories</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={doctorDashboardStyles.actionCard} onPress={handleAppointments}>
                        <Ionicons name="calendar-outline" size={32} color="#fff" />
                        <Text style={doctorDashboardStyles.actionTitle}>Appointments</Text>
                        <Text style={doctorDashboardStyles.actionDescription}>Schedule and manage appointments</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={doctorDashboardStyles.actionCard} onPress={handleAnalytics}>
                        <Ionicons name="analytics-outline" size={32} color="#fff" />
                        <Text style={doctorDashboardStyles.actionTitle}>Analytics</Text>
                        <Text style={doctorDashboardStyles.actionDescription}>View practice analytics and insights</Text>
                    </TouchableOpacity>
                </View>

                {/* Medical Alerts Panel */}
                <View style={doctorDashboardStyles.alertsContainer}>
                    <MedicalAlertsPanel userRole="doctor" />
                </View>

                {/* Recent Activity */}
                <View style={doctorDashboardStyles.activityContainer}>
                    <Text style={doctorDashboardStyles.sectionTitle}>Recent Activity</Text>
                    <View style={doctorDashboardStyles.activityCard}>
                        <Text style={doctorDashboardStyles.activityText}>No recent activity</Text>
                        <Text style={doctorDashboardStyles.activitySubtext}>Patient interactions will appear here</Text>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
        </View>
    );
}
