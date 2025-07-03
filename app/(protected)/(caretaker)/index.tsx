// app/(protected)/(caretaker)/index.tsx
import { View, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../firebase/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import DoctorCredentialRequest from '../../../components/coreComponents/DoctorCredentialRequest';
import AppHeader from '../../../components/coreComponents/AppHeader';
import commonAppStyles from '../../../assets/styles/protectedStyles/commonAppStyles';
import caretakerDashboardStyles from '../../../assets/styles/protectedStyles/caretakerStyles/caretakerDashboardStyles';

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
        <View style={caretakerDashboardStyles.outerContainer}>
            <AppHeader 
                title={`Hello, ${userProfile?.firstName || user?.email || 'Caretaker'}!`}
                subtitle="Caretaker Dashboard"
                gradient={['#4c669f', '#3b5998', '#192f6a']}
            />
            
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={commonAppStyles.backgroundGradient}
            >
            
            <View style={caretakerDashboardStyles.container}>
                <View style={caretakerDashboardStyles.actionsContainer}>
                    <TouchableOpacity
                        style={caretakerDashboardStyles.actionButton}
                        onPress={() => router.push('/(protected)/(caretaker)/invite-patient')}
                    >
                        <Ionicons name="person-add" size={24} color="#fff" />
                        <Text style={caretakerDashboardStyles.actionButtonText}>Invite a Patient</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={caretakerDashboardStyles.actionButton}
                        onPress={handleViewPatients}
                    >
                        <Ionicons name="people" size={24} color="#fff" />
                        <Text style={caretakerDashboardStyles.actionButtonText}>View My Patients</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={caretakerDashboardStyles.actionButton}
                        onPress={handlePatientManagement}
                    >
                        <Ionicons name="settings" size={24} color="#fff" />
                        <Text style={caretakerDashboardStyles.actionButtonText}>Patient Management</Text>
                    </TouchableOpacity>
                </View>

                {/* Doctor Credential Request Section */}
                <View style={caretakerDashboardStyles.upgradeContainer}>
                    <Ionicons name="medical" size={30} color="#FFD700" />
                    <Text style={caretakerDashboardStyles.upgradeTitle}>Upgrade to Doctor</Text>
                    <Text style={caretakerDashboardStyles.upgradeText}>
                        Are you a licensed medical professional? Request doctor verification to access advanced medical features.
                    </Text>
                    <TouchableOpacity
                        style={caretakerDashboardStyles.upgradeButton}
                        onPress={handleDoctorRequest}
                    >
                        <Ionicons name="arrow-up-circle" size={20} color="#fff" />
                        <Text style={caretakerDashboardStyles.upgradeButtonText}>Request Doctor Access</Text>
                    </TouchableOpacity>
                </View>

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
            </View>
        </LinearGradient>
        </View>
    );
}

