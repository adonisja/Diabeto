import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../firebase/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../../components/coreComponents/AppHeader';
import commonAppStyles from '../../../assets/styles/protectedStyles/commonAppStyles';
import patientDashboardStyles from '../../../assets/styles/protectedStyles/patientStyles/patientDashboardStyles';

export default function PatientDashboardScreen() {
    const { user, userProfile } = useAuth();
    const router = useRouter();

    const handleGlucoseMonitoring = () => {
        router.push('/(protected)/(patient)/glucose-monitoring');
    };

    const handleInsulinMonitoring = () => {
        router.push('/(protected)/(patient)/insulin-logging');
    };

    const handleHeartRateMonitoring = () => {
        router.push('/(protected)/(patient)/heart-rate-monitoring');
    };

    const handleBloodPressureMonitoring = () => {
        router.push('/(protected)/(patient)/blood-pressure-monitoring');
    };

    return (
        <SafeAreaView style={patientDashboardStyles.outerContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />
            
            {/* App Header with User Menu */}
            <AppHeader 
                title="Diabeto"
                gradient={['#667eea', '#764ba2', '#f093fb']}
            />
            
            {/* Animated gradient background */}
            <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                style={patientDashboardStyles.backgroundGradient}
            >
                <ScrollView 
                    style={patientDashboardStyles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Welcome Hero Section */}
                    <View style={patientDashboardStyles.heroSection}>
                        <View style={patientDashboardStyles.welcomeCard}>
                            <Text style={patientDashboardStyles.welcomeEmoji}>🌟</Text>
                            <Text style={patientDashboardStyles.welcomeText}>
                                Welcome back, {userProfile?.firstName || 'Champion'}!
                            </Text>
                            <Text style={patientDashboardStyles.motivationalText}>
                                You're doing great managing your health! 💪
                            </Text>
                        </View>
                    </View>

                    {/* Quick Actions Grid */}
                    <View style={patientDashboardStyles.actionsGrid}>
                        <TouchableOpacity
                            style={[patientDashboardStyles.actionCard, patientDashboardStyles.glucoseCard]}
                            onPress={handleGlucoseMonitoring}
                        >
                            <LinearGradient
                                colors={['#4facfe', '#00f2fe']}
                                style={patientDashboardStyles.cardGradient}
                            >
                                <Ionicons name="pulse" size={32} color="#fff" />
                                <Text style={patientDashboardStyles.cardTitle}>Glucose</Text>
                                <Text style={patientDashboardStyles.cardSubtitle}>Track & Monitor</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[patientDashboardStyles.actionCard, patientDashboardStyles.insulinCard]}
                            onPress={handleInsulinMonitoring}
                        >
                            <LinearGradient
                                colors={['#43e97b', '#38f9d7']}
                                style={patientDashboardStyles.cardGradient}
                            >
                                <Ionicons name="medical" size={32} color="#fff" />
                                <Text style={patientDashboardStyles.cardTitle}>Insulin</Text>
                                <Text style={patientDashboardStyles.cardSubtitle}>✨ Starry Guide</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[patientDashboardStyles.actionCard, patientDashboardStyles.heartRateCard]}
                            onPress={handleHeartRateMonitoring}
                        >
                            <LinearGradient
                                colors={['#ff6b6b', '#feca57']}
                                style={patientDashboardStyles.cardGradient}
                            >
                                <Ionicons name="heart" size={32} color="#fff" />
                                <Text style={patientDashboardStyles.cardTitle}>Heart Rate</Text>
                                <Text style={patientDashboardStyles.cardSubtitle}>Monitor & Track</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[patientDashboardStyles.actionCard, patientDashboardStyles.bloodPressureCard]}
                            onPress={handleBloodPressureMonitoring}
                        >
                            <LinearGradient
                                colors={['#6a82fb', '#fc5c7d']}
                                style={patientDashboardStyles.cardGradient}
                            >
                                <Ionicons name="heart-outline" size={32} color="#fff" />
                                <Text style={patientDashboardStyles.cardTitle}>Blood Pressure</Text>
                                <Text style={patientDashboardStyles.cardSubtitle}>Check & Monitor</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[patientDashboardStyles.actionCard, patientDashboardStyles.invitationsCard]}
                            onPress={() => router.push('/(protected)/(patient)/patientInvitationsScreen')}
                        >
                            <LinearGradient
                                colors={['#fa709a', '#fee140']}
                                style={patientDashboardStyles.cardGradient}
                            >
                                <Ionicons name="mail" size={32} color="#fff" />
                                <Text style={patientDashboardStyles.cardTitle}>Invitations</Text>
                                <Text style={patientDashboardStyles.cardSubtitle}>Connect & Share</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[patientDashboardStyles.actionCard, patientDashboardStyles.remindersCard]}
                            onPress={() => router.push('/(protected)/(patient)/reminders')}
                        >
                            <LinearGradient
                                colors={['#667eea', '#764ba2']}
                                style={patientDashboardStyles.cardGradient}
                            >
                                <Ionicons name="notifications" size={32} color="#fff" />
                                <Text style={patientDashboardStyles.cardTitle}>Reminders</Text>
                                <Text style={patientDashboardStyles.cardSubtitle}>Stay on Track</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Health Tips Section */}
                    <View style={patientDashboardStyles.tipsSection}>
                        <Text style={patientDashboardStyles.sectionTitle}>💡 Daily Health Tips</Text>
                        <View style={patientDashboardStyles.tipCard}>
                            <Ionicons name="water" size={20} color="#4facfe" />
                            <Text style={patientDashboardStyles.tipText}>
                                Stay hydrated! Drink plenty of water throughout the day.
                            </Text>
                        </View>
                        <View style={patientDashboardStyles.tipCard}>
                            <Ionicons name="walk" size={20} color="#43e97b" />
                            <Text style={patientDashboardStyles.tipText}>
                                A 10-minute walk after meals can help regulate blood sugar.
                            </Text>
                        </View>
                    </View>

                    {/* Bottom padding for scroll */}
                    <View style={patientDashboardStyles.bottomPadding} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}