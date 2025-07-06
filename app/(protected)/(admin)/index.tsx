// app/(protected)/(admin)/index.tsx
import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    Alert, 
    TextInput, 
    ActivityIndicator, 
    Modal 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../firebase/AuthContext';
import { useRouter } from 'expo-router';
import { db } from '../../../firebase/firebaseConfig';
import { doc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { logAction } from '../../../firebase/LogService';
import DoctorRequestReview from '../../../components/coreComponents/DoctorRequestReview';
import AppHeader from '../../../components/coreComponents/AppHeader';
import SystemHealthDashboard from '../../../components/coreComponents/SystemHealthDashboard';
import adminDashboardStyles from '../../../assets/styles/protectedStyles/adminStyles/adminDashboardStyles';
import * as LogAnalytics from '../../../utils/LogAnalytics';

export default function AdminDashboard() {
    const { user, userProfile, loadingProfile } = useAuth();
    const router = useRouter();
    const [targetUserId, setTargetUserId] = useState('');
    const [newRole, setNewRole] = useState<'patient' | 'caretaker' | 'doctor' | 'admin'>('patient');
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDoctorReviews, setShowDoctorReviews] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'system' | 'management'>('overview');
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);

    // Since access control is now handled by the landing page, we don't need to check role here
    // The landing page ensures only admin users can reach this screen

    const handleUserManagement = () => {
        Alert.alert("User Management", "User management features coming soon!");
    };

    const handleSystemLogs = () => {
        Alert.alert("System Logs", "System logs viewer coming soon!");
    };

    const handleDatabaseManagement = () => {
        Alert.alert("Database Management", "Database management features coming soon!");
    };

    const handleDoctorReviews = () => {
        setShowDoctorReviews(true);
    };

    const handleAssignRole = async () => {
        if (!targetUserId.trim()) {
            Alert.alert("Error", "Please enter a User ID");
            return;
        }

        setIsUpdating(true);
        try {
            const userId = targetUserId.trim();

            // Update user role in Firestore
            const userDocRef = doc(
                collection(db, `artifacts/${process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'default-app-id'}/users`), 
                userId
            );

            await updateDoc(userDocRef, {
                role: newRole,
                updatedAt: serverTimestamp(),
                roleAssignedBy: user?.uid,
                roleAssignedAt: serverTimestamp()
            });

            // Log the role assignment
            await logAction(
                user?.uid ?? 'unknown-admin',
                userProfile?.username ?? user?.email?.split('@')[0] ?? 'unknown-admin',
                user?.email ?? 'unknown-email',
                'admin',
                'ADMIN_ROLE_ASSIGNED',
                'success',
                {
                    targetUserId: userId,
                    newRole: newRole,
                    timestamp: new Date().toISOString()
                }
            );

            Alert.alert("Success", `Role '${newRole}' assigned successfully to user: ${userId}`);
            setTargetUserId('');
            setNewRole('patient');

        } catch (error: any) {
            console.error("Error assigning role:", error);
            Alert.alert("Error", `Failed to assign role: ${error.message}`);

            // Log the failed role assignment
            await logAction(
                user?.uid ?? 'unknown-admin',
                userProfile?.username ?? user?.email?.split('@')[0] ?? 'unknown-admin',
                user?.email ?? 'unknown-email',
                'admin',
                'ADMIN_ROLE_ASSIGNMENT_FAILED',
                'failure',
                {
                    targetUserId: targetUserId,
                    newRole: newRole,
                    error: error.message,
                    timestamp: new Date().toISOString()
                }
            );
        } finally {
            setIsUpdating(false);
        }
    };

    // Fetch analytics data
    useEffect(() => {
        const fetchAnalyticsData = async () => {
            setLoadingAnalytics(true);
            try {
                // Fetch basic analytics data
                const behaviorPatterns = await LogAnalytics.analyzeUserBehavior('weekly');
                const performanceMetrics = await LogAnalytics.analyzePerformanceMetrics();
                const insights = await LogAnalytics.generateMedicalInsights();
                
                setAnalyticsData({
                    totalUsers: behaviorPatterns.length,
                    behaviorPatterns,
                    performanceMetrics,
                    insights
                });
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setLoadingAnalytics(false);
            }
        };

        if (user?.uid) {
            fetchAnalyticsData();
        }
    }, [user?.uid]);

    const renderOverviewTab = () => (
        <ScrollView contentContainerStyle={adminDashboardStyles.scrollContainer}>
            {/* Quick Stats */}
            <View style={adminDashboardStyles.statsContainer}>
                <View style={adminDashboardStyles.statCard}>
                    <Ionicons name="people-outline" size={30} color="#fff" />
                    <Text style={adminDashboardStyles.statNumber}>
                        {analyticsData?.totalUsers || '---'}
                    </Text>
                    <Text style={adminDashboardStyles.statLabel}>Total Users</Text>
                </View>
                <View style={adminDashboardStyles.statCard}>
                    <Ionicons name="shield-checkmark-outline" size={30} color="#fff" />
                    <Text style={adminDashboardStyles.statNumber}>
                        {analyticsData?.insights?.filter((i: any) => i.severity === 'critical').length || '0'}
                    </Text>
                    <Text style={adminDashboardStyles.statLabel}>Critical Alerts</Text>
                </View>
            </View>

            {/* Role Assignment Section */}
            <View style={adminDashboardStyles.sectionContainer}>
                <Text style={adminDashboardStyles.sectionTitle}>👥 Role Assignment</Text>
                
                <TextInput
                    style={adminDashboardStyles.input}
                    placeholder="User ID"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    value={targetUserId}
                    onChangeText={setTargetUserId}
                />

                <Text style={adminDashboardStyles.label}>Select Role:</Text>
                <View style={adminDashboardStyles.roleContainer}>
                    {(['patient', 'caretaker', 'doctor', 'admin'] as const).map(role => (
                        <TouchableOpacity
                            key={role}
                            style={[adminDashboardStyles.roleButton, newRole === role && adminDashboardStyles.roleButtonActive]}
                            onPress={() => setNewRole(role)}
                        >
                            <Text style={[adminDashboardStyles.roleButtonText, newRole === role && adminDashboardStyles.roleButtonTextActive]}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={[adminDashboardStyles.assignButton, isUpdating && adminDashboardStyles.assignButtonDisabled]}
                    onPress={handleAssignRole}
                    disabled={isUpdating}
                >
                    {isUpdating ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={adminDashboardStyles.assignButtonText}>Assign Role</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Admin Actions */}
            <View style={adminDashboardStyles.actionsContainer}>
                <Text style={adminDashboardStyles.sectionTitle}>⚙️ Admin Actions</Text>
                
                <TouchableOpacity style={adminDashboardStyles.actionButton} onPress={handleDoctorReviews}>
                    <Ionicons name="medical" size={24} color="#fff" />
                    <Text style={adminDashboardStyles.actionButtonText}>Review Doctor Requests</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={adminDashboardStyles.actionButton} 
                    onPress={() => setActiveTab('analytics')}
                >
                    <Ionicons name="analytics" size={24} color="#fff" />
                    <Text style={adminDashboardStyles.actionButtonText}>Advanced Analytics</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={adminDashboardStyles.actionButton} 
                    onPress={() => setActiveTab('system')}
                >
                    <Ionicons name="pulse" size={24} color="#fff" />
                    <Text style={adminDashboardStyles.actionButtonText}>System Health</Text>
                </TouchableOpacity>

                <TouchableOpacity style={adminDashboardStyles.actionButton} onPress={handleUserManagement}>
                    <Ionicons name="people" size={24} color="#fff" />
                    <Text style={adminDashboardStyles.actionButtonText}>User Management</Text>
                </TouchableOpacity>
            </View>

            {/* Security Notice */}
            <View style={adminDashboardStyles.securityNotice}>
                <Ionicons name="warning" size={20} color="#FFD700" />
                <Text style={adminDashboardStyles.securityText}>
                    🔒 Admin privileges active. All actions are logged and monitored.
                </Text>
            </View>

            {/* Current User Info */}
            <View style={adminDashboardStyles.userInfoContainer}>
                <Text style={adminDashboardStyles.userInfoTitle}>Current Admin User:</Text>
                <Text style={adminDashboardStyles.userInfoText}>ID: {user?.uid}</Text>
                <Text style={adminDashboardStyles.userInfoText}>Email: {user?.email}</Text>
                <Text style={adminDashboardStyles.userInfoText}>Role: {userProfile?.role}</Text>
            </View>
        </ScrollView>
    );

    const renderAnalyticsTab = () => (
        <ScrollView contentContainerStyle={adminDashboardStyles.scrollContainer}>
            <View style={adminDashboardStyles.sectionContainer}>
                <Text style={adminDashboardStyles.sectionTitle}>📊 Advanced Analytics & Monitoring</Text>
                
                <TouchableOpacity
                    style={adminDashboardStyles.actionButton}
                    onPress={async () => {
                        setLoadingAnalytics(true);
                        try {
                            const insights = await LogAnalytics.generateMedicalInsights();
                            const compliance = await LogAnalytics.generateComplianceScorecard();
                            const realTimeData = await LogAnalytics.getRealTimeAnalytics();
                            
                            setAnalyticsData((prev: any) => ({ 
                                ...prev, 
                                insights, 
                                compliance, 
                                realTimeData 
                            }));
                            
                            Alert.alert(
                                'Analytics Generated',
                                `Medical Insights: ${insights.length}\nCompliance Score: ${compliance.overallScore}%\nActive Users: ${realTimeData.activeUsers}`,
                                [{ text: 'OK' }]
                            );
                        } catch (error) {
                            Alert.alert('Error', 'Failed to generate analytics');
                        } finally {
                            setLoadingAnalytics(false);
                        }
                    }}
                    disabled={loadingAnalytics}
                >
                    {loadingAnalytics ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="analytics-outline" size={20} color="#fff" />
                            <Text style={adminDashboardStyles.actionButtonText}>Generate Medical Insights</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={adminDashboardStyles.actionButton}
                    onPress={async () => {
                        try {
                            const performanceMetrics = await LogAnalytics.analyzePerformanceMetrics();
                            
                            Alert.alert(
                                'Performance Analysis',
                                `Avg Load Time: ${Math.round(Object.values(performanceMetrics.screenLoadTimes).reduce((a, b) => a + b, 0) / Object.keys(performanceMetrics.screenLoadTimes).length)}ms\nUser Satisfaction: ${performanceMetrics.userSatisfactionScore}/5\nSystem Utilization: ${(performanceMetrics.systemUtilization * 100).toFixed(1)}%`,
                                [{ text: 'OK' }]
                            );
                        } catch (error) {
                            Alert.alert('Error', 'Failed to analyze performance');
                        }
                    }}
                >
                    <Ionicons name="speedometer-outline" size={20} color="#fff" />
                    <Text style={adminDashboardStyles.actionButtonText}>Analyze Performance</Text>
                </TouchableOpacity>

                {analyticsData && (
                    <View style={adminDashboardStyles.sectionContainer}>
                        <Text style={adminDashboardStyles.sectionTitle}>Latest Analytics Summary</Text>
                        <Text style={adminDashboardStyles.userInfoText}>
                            Compliance Score: {analyticsData.compliance?.overallScore || 'N/A'}%
                        </Text>
                        <Text style={adminDashboardStyles.userInfoText}>
                            Active Users: {analyticsData.realTimeData?.activeUsers || 'N/A'}
                        </Text>
                        <Text style={adminDashboardStyles.userInfoText}>
                            Critical Insights: {analyticsData.insights?.filter((i: any) => i.severity === 'critical').length || 0}
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'analytics':
                return renderAnalyticsTab();
            case 'system':
                return <SystemHealthDashboard />;
            default:
                return renderOverviewTab();
        }
    };

    return (
        <View style={adminDashboardStyles.outerContainer}>
            <AppHeader 
                title="�️ Admin Dashboard"
                subtitle={`Welcome back, ${userProfile?.firstName || 'Administrator'}`}
                gradient={['#8B0000', '#DC143C', '#FF6347']}
            />
            
            <LinearGradient
                colors={['#8B0000', '#DC143C', '#FF6347']} // Admin theme colors (red gradient)
                style={adminDashboardStyles.container}
            >
                {/* Tab Navigation */}
                <View style={adminDashboardStyles.roleContainer}>
                    <TouchableOpacity
                        style={[adminDashboardStyles.roleButton, activeTab === 'overview' && adminDashboardStyles.roleButtonActive]}
                        onPress={() => setActiveTab('overview')}
                    >
                        <Text style={[adminDashboardStyles.roleButtonText, activeTab === 'overview' && adminDashboardStyles.roleButtonTextActive]}>
                            Overview
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[adminDashboardStyles.roleButton, activeTab === 'analytics' && adminDashboardStyles.roleButtonActive]}
                        onPress={() => setActiveTab('analytics')}
                    >
                        <Text style={[adminDashboardStyles.roleButtonText, activeTab === 'analytics' && adminDashboardStyles.roleButtonTextActive]}>
                            Analytics
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[adminDashboardStyles.roleButton, activeTab === 'system' && adminDashboardStyles.roleButtonActive]}
                        onPress={() => setActiveTab('system')}
                    >
                        <Text style={[adminDashboardStyles.roleButtonText, activeTab === 'system' && adminDashboardStyles.roleButtonTextActive]}>
                            System
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                {renderTabContent()}

                {/* Doctor Request Review Modal */}
                <Modal
                    visible={showDoctorReviews}
                    animationType="slide"
                    presentationStyle="pageSheet"
                    onRequestClose={() => setShowDoctorReviews(false)}
                >
                    <View style={adminDashboardStyles.modalContainer}>
                        <View style={adminDashboardStyles.modalHeader}>
                            <Text style={adminDashboardStyles.modalTitle}>Doctor Verification Requests</Text>
                            <TouchableOpacity
                                style={adminDashboardStyles.closeButton}
                                onPress={() => setShowDoctorReviews(false)}
                            >
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <DoctorRequestReview />
                    </View>
                </Modal>
            </LinearGradient>
        </View>
    );
}