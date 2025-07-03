import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { auth } from "@/firebase/firebaseConfig";
import { useAuth } from '../../firebase/AuthContext';
import { logAction } from '../../firebase/LogService';
import AppHeader from '../../components/coreComponents/AppHeader';
import homeStyles from '../../assets/styles/protectedStyles/homeStyles';

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
        <View style={homeStyles.container}>
            <AppHeader 
                title="Diabeto Medical Platform"
                subtitle="Redirecting to your dashboard..."
                gradient={['#4c669f', '#3b5998', '#192f6a']}
                textColor="#fff"
            />
            
            <Text style={homeStyles.welcomeText}>Welcome Home!</Text>

            {user && (
                <View style={homeStyles.userInfoContainer}>
                    <Text style={homeStyles.userInfoText}>You are logged in as:</Text>
                    <Text style={homeStyles.userInfoTextBold}>Email: {user.email || 'N/A'}</Text>
                    {userProfile?.name && <Text style={homeStyles.userInfoTextBold}>Name: {userProfile.name}</Text>}
                    {userProfile?.role && <Text style={homeStyles.userInfoTextBold}>Role: {userProfile.role}</Text>}
                </View>
            )}
        </View>
    );
}

