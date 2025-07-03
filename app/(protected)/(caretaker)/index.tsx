// app/(protected)/(caretaker)/index.tsx
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../firebase/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import DoctorCredentialRequest from '../../../components/coreComponents/DoctorCredentialRequest';
import AppHeader from '../../../components/coreComponents/AppHeader';
import commonAppStyles from '../../../assets/styles/protectedStyles/commonAppStyles';

export default function CaretakerDashboardScreen() {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    const [showDoctorRequest, setShowDoctorRequest] = useState(false);

    const handlePatientManagement = () => {
        Alert.alert("Patient Management", "Patient management features coming soon!");
    };

    const handleViewPatients = () => {
        Alert.alert("View Patients", "Patient viewing features coming soon!");
    };

    const handleDoctorRequest = () => {
        setShowDoctorRequest(true);
    };

    const handleRequestSubmitted = () => {
        setShowDoctorRequest(false);
        Alert.alert(
            "Request Submitted", 
            "Your doctor credential verification request has been submitted successfully!"
        );
    };

    return (
        <View style={styles.outerContainer}>
            <AppHeader 
                title={`Hello, ${userProfile?.firstName || user?.email || 'Caretaker'}!`}
                subtitle="Caretaker Dashboard"
                gradient={['#4c669f', '#3b5998', '#192f6a']}
                textColor="#fff"
            />
            
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={commonAppStyles.backgroundGradient}
            >
            
            <View style={styles.container}>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/(protected)/(caretaker)/invite-patient')}
                    >
                        <Ionicons name="person-add" size={24} color="#fff" />
                        <Text style={styles.actionButtonText}>Invite a Patient</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleViewPatients}
                    >
                        <Ionicons name="people" size={24} color="#fff" />
                        <Text style={styles.actionButtonText}>View My Patients</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handlePatientManagement}
                    >
                        <Ionicons name="settings" size={24} color="#fff" />
                        <Text style={styles.actionButtonText}>Patient Management</Text>
                    </TouchableOpacity>
                </View>

                {/* Doctor Credential Request Section */}
                <View style={styles.upgradeContainer}>
                    <Ionicons name="medical" size={30} color="#FFD700" />
                    <Text style={styles.upgradeTitle}>Upgrade to Doctor</Text>
                    <Text style={styles.upgradeText}>
                        Are you a licensed medical professional? Request doctor verification to access advanced medical features.
                    </Text>
                    <TouchableOpacity
                        style={styles.upgradeButton}
                        onPress={handleDoctorRequest}
                    >
                        <Ionicons name="arrow-up-circle" size={20} color="#fff" />
                        <Text style={styles.upgradeButtonText}>Request Doctor Access</Text>
                    </TouchableOpacity>
                </View>

                {/* Doctor Credential Request Modal */}
                <Modal
                    visible={showDoctorRequest}
                    animationType="slide"
                    presentationStyle="pageSheet"
                    onRequestClose={() => setShowDoctorRequest(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowDoctorRequest(false)}
                            >
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <DoctorCredentialRequest onRequestSubmitted={handleRequestSubmitted} />
                    </View>
                </Modal>
            </View>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    actionsContainer: {
        width: '100%',
        marginBottom: 30,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    upgradeContainer: {
        backgroundColor: 'rgba(255,215,0,0.1)',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.3)',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    upgradeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFD700',
        marginTop: 10,
        textAlign: 'center',
    },
    upgradeText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 20,
    },
    upgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#32CD32',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    upgradeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
        paddingTop: 50,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    closeButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
});