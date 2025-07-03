import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { auth } from "@/firebase/firebaseConfig"; // Import auth for sign out
import { useAuth } from '../../firebase/AuthContext'; // Import useAuth to get user info
import { logAction } from '../../firebase/LogService'; // Import logAction for logging logout
import AppHeader from '../../components/coreComponents/AppHeader';

export default function HomeScreen() {
    const { user, userProfile } = useAuth(); // Get user and userProfile from context
    const router = useRouter();
    const hasRedirectedRef = useRef(false); // Track if we've already redirected

    // Role-based redirection using useRef to prevent infinite loops
    useEffect(() => {
        // Only redirect if we haven't already and user has completed profile with role
        if (!hasRedirectedRef.current && userProfile?.profileCompleted && userProfile?.role) {
            hasRedirectedRef.current = true; // Mark as redirected BEFORE navigation
            console.log(`HomeScreen: Redirecting user with role ${userProfile.role} to dashboard`);
            
            switch (userProfile.role) {
                case 'patient':
                    router.replace('/(protected)/(patient)');
                    break;
                case 'caretaker':
                    router.replace('/(protected)/(caretaker)');
                    break;
                case 'doctor':
                    router.replace('/(protected)/(doctor)');
                    break;
                case 'admin':
                    router.replace('/(protected)/(admin)');
                    break;
                default:
                    // If role is unverified or unknown, redirect to profile completion
                    router.replace('/(protected)/userProfile');
                    break;
            }
        }
    }, [userProfile?.profileCompleted, userProfile?.role]); // Removed router from dependencies

    // Reset redirect flag when user changes (for logout/login scenarios)
    useEffect(() => {
        hasRedirectedRef.current = false;
    }, [user?.uid]);

    return (
        <View style={styles.container}>
            <AppHeader 
                title="Diabeto Medical Platform"
                subtitle="Redirecting to your dashboard..."
                gradient={['#4c669f', '#3b5998', '#192f6a']}
                textColor="#fff"
            />
            
            <Text style={styles.welcomeText}>Welcome Home!</Text>

            {user && (
                <View style={styles.userInfoContainer}>
                    <Text style={styles.userInfoText}>You are logged in as:</Text>
                    <Text style={styles.userInfoTextBold}>Email: {user.email || 'N/A'}</Text>
                    {userProfile?.name && <Text style={styles.userInfoTextBold}>Name: {userProfile.name}</Text>}
                    {userProfile?.role && <Text style={styles.userInfoTextBold}>Role: {userProfile.role}</Text>}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0f7fa', // Light blue background
        padding: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00796b', // Dark teal color
        marginBottom: 30,
        textAlign: 'center',
    },
    userInfoContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 30,
        alignItems: 'flex-start',
        width: '80%',
    },
    userInfoText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    userInfoTextBold: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
});