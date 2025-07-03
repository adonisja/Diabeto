// app/(protected)/(admin)/index.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../firebase/AuthContext';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { db } from '@/firebase/firebaseConfig';
import { doc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { logAction } from '../../../firebase/LogService';
import DoctorRequestReview from '../../../components/coreComponents/DoctorRequestReview';
import AppHeader from '../../../components/coreComponents/AppHeader';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
    const { user, userProfile, loadingProfile } = useAuth();
    const router = useRouter();
    const [targetUserId, setTargetUserId] = useState('');
    const [newRole, setNewRole] = useState<'patient' | 'caretaker' | 'doctor' | 'admin'>('patient');
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDoctorReviews, setShowDoctorReviews] = useState(false);

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

    return (
        <View style={styles.outerContainer}>
            <AppHeader 
                title="🛡️ Admin Dashboard"
                subtitle={`Welcome back, ${userProfile?.firstName || 'Administrator'}`}
                gradient={['#8B0000', '#DC143C', '#FF6347']}
                textColor="#fff"
            />
            
            <LinearGradient
                colors={['#8B0000', '#DC143C', '#FF6347']} // Admin theme colors (red gradient)
                style={styles.container}
            >
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Ionicons name="people-outline" size={30} color="#fff" />
                        <Text style={styles.statNumber}>---</Text>
                        <Text style={styles.statLabel}>Total Users</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="shield-checkmark-outline" size={30} color="#fff" />
                        <Text style={styles.statNumber}>---</Text>
                        <Text style={styles.statLabel}>Active Sessions</Text>
                    </View>
                </View>

                {/* Role Assignment Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>👥 Role Assignment</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="User ID"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={targetUserId}
                        onChangeText={setTargetUserId}
                    />

                    <Text style={styles.label}>Select Role:</Text>
                    <View style={styles.roleContainer}>
                        {(['patient', 'caretaker', 'doctor', 'admin'] as const).map(role => (
                            <TouchableOpacity
                                key={role}
                                style={[styles.roleButton, newRole === role && styles.roleButtonActive]}
                                onPress={() => setNewRole(role)}
                            >
                                <Text style={[styles.roleButtonText, newRole === role && styles.roleButtonTextActive]}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.assignButton, isUpdating && styles.assignButtonDisabled]}
                        onPress={handleAssignRole}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.assignButtonText}>Assign Role</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Admin Actions */}
                <View style={styles.actionsContainer}>
                    <Text style={styles.sectionTitle}>⚙️ Admin Actions</Text>
                    
                    <TouchableOpacity style={styles.actionButton} onPress={handleDoctorReviews}>
                        <Ionicons name="medical" size={24} color="#fff" />
                        <Text style={styles.actionButtonText}>Review Doctor Requests</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.actionButton} onPress={handleUserManagement}>
                        <Ionicons name="people" size={24} color="#fff" />
                        <Text style={styles.actionButtonText}>User Management</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={handleSystemLogs}>
                        <Ionicons name="document-text" size={24} color="#fff" />
                        <Text style={styles.actionButtonText}>System Logs</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={handleDatabaseManagement}>
                        <Ionicons name="server" size={24} color="#fff" />
                        <Text style={styles.actionButtonText}>Database Management</Text>
                    </TouchableOpacity>
                </View>

                {/* Security Notice */}
                <View style={styles.securityNotice}>
                    <Ionicons name="warning" size={20} color="#FFD700" />
                    <Text style={styles.securityText}>
                        🔒 Admin privileges active. All actions are logged and monitored.
                    </Text>
                </View>

                {/* Current User Info */}
                <View style={styles.userInfoContainer}>
                    <Text style={styles.userInfoTitle}>Current Admin User:</Text>
                    <Text style={styles.userInfoText}>ID: {user?.uid}</Text>
                    <Text style={styles.userInfoText}>Email: {user?.email}</Text>
                    <Text style={styles.userInfoText}>Role: {userProfile?.role}</Text>
                </View>

                {/* Doctor Request Review Modal */}
                <Modal
                    visible={showDoctorReviews}
                    animationType="slide"
                    presentationStyle="pageSheet"
                    onRequestClose={() => setShowDoctorReviews(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Doctor Verification Requests</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowDoctorReviews(false)}
                            >
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <DoctorRequestReview />
                    </View>
                </Modal>
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
        flexGrow: 1,
        padding: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    statCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 5,
    },
    sectionContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 10,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        marginBottom: 15,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    roleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    roleButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 5,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    roleButtonActive: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    roleButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    roleButtonTextActive: {
        color: '#8B0000',
    },
    assignButton: {
        backgroundColor: '#32CD32',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    assignButtonDisabled: {
        backgroundColor: 'rgba(50,205,50,0.5)',
    },
    assignButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    actionsContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    securityNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,215,0,0.1)',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.3)',
        marginBottom: 20,
    },
    securityText: {
        color: '#FFD700',
        fontSize: 14,
        marginLeft: 10,
        flex: 1,
    },
    userInfoContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    userInfoTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    userInfoText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 2,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#8B0000',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    closeButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 10,
    },
});