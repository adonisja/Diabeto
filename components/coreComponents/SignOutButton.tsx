// components/coreComponents/SignOutButton.tsx
import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '@/firebase/firebaseConfig';
import { useAuth } from '../../firebase/AuthContext';
import { logAction } from '../../firebase/LogService';
import signOutButtonStyles from '../../assets/styles/componentStyles/signOutButtonStyles';

interface SignOutButtonProps {
    style?: 'floating' | 'header' | 'inline';
    position?: 'top-right' | 'bottom-right' | 'custom';
    size?: 'small' | 'medium' | 'large';
    showText?: boolean;
    customStyle?: object;
}

export default function SignOutButton({ 
    style = 'floating', 
    position = 'top-right',
    size = 'medium',
    showText = true,
    customStyle = {}
}: SignOutButtonProps) {
    const { user, userProfile } = useAuth();

    const handleLogout = async () => {
        try {
            const userUid = user?.uid ?? 'unknown-uid';
            const userUsername = userProfile?.username ?? user?.email?.split('@')[0] ?? 'unknown-user';
            const userEmail = user?.email ?? 'unknown-email';
            const userRole = userProfile?.role ?? 'unknown';

            // Log the logout action BEFORE signing out
            await logAction(
                userUid,
                userUsername,
                userEmail,
                (userRole as 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified') || 'unverified',
                'USER_LOGOUT',
                'success',
                { timestamp: new Date().toISOString() }
            );

            // Sign out AFTER logging
            await auth.signOut();
            console.log("User signed out successfully.");

        } catch (error: any) {
            console.error("Error signing out:", error);
            Alert.alert("Logout Error", "Failed to log out. Please try again.");

            // Log failed logout action (user still authenticated at this point)
            await logAction(
                user?.uid ?? 'unknown-uid',
                userProfile?.username ?? user?.email?.split('@')[0] ?? 'unknown-user',
                user?.email ?? 'unknown-email',
                (userProfile?.role as 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified') || 'unverified',
                'USER_LOGOUT_FAILED',
                'failure',
                { error: error.message, timestamp: new Date().toISOString() }
            );
        }
    };

    const confirmLogout = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: handleLogout,
                },
            ]
        );
    };

    // Determine button style based on props
    const getButtonStyle = () => {
        const baseStyle: any[] = [signOutButtonStyles.signOutButton];
        
        if (style === 'floating') {
            baseStyle.push(signOutButtonStyles.floating);
            if (position === 'top-right') baseStyle.push(signOutButtonStyles.topRight);
            if (position === 'bottom-right') baseStyle.push(signOutButtonStyles.bottomRight);
        } else if (style === 'header') {
            baseStyle.push(signOutButtonStyles.header);
        } else if (style === 'inline') {
            baseStyle.push(signOutButtonStyles.inline);
        }

        if (size === 'small') baseStyle.push(signOutButtonStyles.small);
        if (size === 'large') baseStyle.push(signOutButtonStyles.large);

        if (customStyle) baseStyle.push(customStyle);

        return baseStyle;
    };

    const getIconSize = () => {
        switch (size) {
            case 'small': return 18;
            case 'large': return 28;
            default: return 22;
        }
    };

    const getTextStyle = () => {
        const baseStyle: any[] = [signOutButtonStyles.signOutText];
        if (size === 'small') baseStyle.push(signOutButtonStyles.smallText);
        if (size === 'large') baseStyle.push(signOutButtonStyles.largeText);
        return baseStyle;
    };

    return (
        <TouchableOpacity style={getButtonStyle()} onPress={confirmLogout}>
            <Ionicons name="log-out-outline" size={getIconSize()} color="#fff" />
            {showText && <Text style={getTextStyle()}>Sign Out</Text>}
        </TouchableOpacity>
    );
}
