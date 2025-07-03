
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../firebase/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../../../components/coreComponents/AppHeader';
import commonAppStyles from '../../../assets/styles/protectedStyles/commonAppStyles';

export default function PatientDashboardScreen() {
    const { user, userProfile } = useAuth();
    const router = useRouter();

    return (
        <View style={styles.outerContainer}>
            <AppHeader 
                title={`Hello, ${userProfile?.firstName || user?.email || 'Patient'}!`}
                subtitle="You are logged in as a Patient."
                gradient={['#4c669f', '#3b5998', '#192f6a']}
                textColor="#fff"
            />
            
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={commonAppStyles.backgroundGradient}
            >
            
            <View style={styles.container}>
                <TouchableOpacity
                    style={commonAppStyles.button}
                    onPress={() => router.push('/(protected)/(patient)/patientInvitationsScreen' as any)}
                >
                    <Text style={commonAppStyles.buttonText}>View Invitations</Text>
                </TouchableOpacity>

                {/* Add more patient-specific navigation buttons here */}
                {/*
                <TouchableOpacity style={commonAppStyles.button}>
                    <Text style={commonAppStyles.buttonText}>Log Blood Glucose</Text>
                </TouchableOpacity>
                */}
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
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    roleText: {
        fontSize: 18,
        color: '#eee',
        marginBottom: 30,
        textAlign: 'center',
    },
});