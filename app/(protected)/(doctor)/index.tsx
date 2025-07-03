// app/(protected)/(doctor)/index.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../firebase/AuthContext';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../../components/coreComponents/AppHeader';
import { useRouter } from 'expo-router';

export default function DoctorDashboard() {
    const { user, userProfile, loadingProfile } = useAuth();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    // Since access control is now handled by the landing page, we don't need to check role here
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
        Alert.alert("Patient Management", "Patient management features coming soon!");
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
        <View style={styles.outerContainer}>
            <AppHeader 
                title={`Welcome, Dr. ${userProfile?.firstName || userProfile?.username || 'Doctor'}!`}
                subtitle="Medical Dashboard"
                gradient={['#2E8B57', '#228B22', '#006400']}
                textColor="#fff"
            />
            
            <LinearGradient
                colors={['#2E8B57', '#228B22', '#006400']} // Doctor theme colors
                style={styles.container}
            >
            
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Ionicons name="people" size={24} color="#2E8B57" />
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Active Patients</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="calendar" size={24} color="#2E8B57" />
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Today's Appointments</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="document-text" size={24} color="#2E8B57" />
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Pending Reviews</Text>
                    </View>
                </View>

                {/* Action Cards */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionCard} onPress={handlePatientManagement}>
                        <Ionicons name="people-outline" size={32} color="#fff" />
                        <Text style={styles.actionTitle}>Patient Management</Text>
                        <Text style={styles.actionDescription}>View and manage your patients</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} onPress={handleMedicalRecords}>
                        <Ionicons name="document-text-outline" size={32} color="#fff" />
                        <Text style={styles.actionTitle}>Medical Records</Text>
                        <Text style={styles.actionDescription}>Access patient medical histories</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} onPress={handleAppointments}>
                        <Ionicons name="calendar-outline" size={32} color="#fff" />
                        <Text style={styles.actionTitle}>Appointments</Text>
                        <Text style={styles.actionDescription}>Schedule and manage appointments</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} onPress={handleAnalytics}>
                        <Ionicons name="analytics-outline" size={32} color="#fff" />
                        <Text style={styles.actionTitle}>Analytics</Text>
                        <Text style={styles.actionDescription}>View practice analytics and insights</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Activity */}
                <View style={styles.activityContainer}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <View style={styles.activityCard}>
                        <Text style={styles.activityText}>No recent activity</Text>
                        <Text style={styles.activitySubtext}>Patient interactions will appear here</Text>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E8B57',
        marginTop: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 5,
    },
    actionsContainer: {
        marginBottom: 30,
    },
    actionCard: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
        marginBottom: 5,
    },
    actionDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    activityContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    activityCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    activityText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 5,
    },
    activitySubtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
    },
});
