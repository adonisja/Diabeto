// components/coreComponents/SignOutButton.tsx
import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '@/firebase/firebaseConfig';
import { useAuth } from '../../firebase/AuthContext';
import { logAction } from '../../firebase/LogService';

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
        const baseStyle: any[] = [styles.signOutButton];
        
        if (style === 'floating') {
            baseStyle.push(styles.floating);
            if (position === 'top-right') baseStyle.push(styles.topRight);
            if (position === 'bottom-right') baseStyle.push(styles.bottomRight);
        } else if (style === 'header') {
            baseStyle.push(styles.header);
        } else if (style === 'inline') {
            baseStyle.push(styles.inline);
        }

        if (size === 'small') baseStyle.push(styles.small);
        if (size === 'large') baseStyle.push(styles.large);

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
        const baseStyle: any[] = [styles.signOutText];
        if (size === 'small') baseStyle.push(styles.smallText);
        if (size === 'large') baseStyle.push(styles.largeText);
        return baseStyle;
    };

    return (
        <TouchableOpacity style={getButtonStyle()} onPress={confirmLogout}>
            <Ionicons name="log-out-outline" size={getIconSize()} color="#fff" />
            {showText && <Text style={getTextStyle()}>Sign Out</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ef5350',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    floating: {
        position: 'absolute',
        zIndex: 1000,
    },
    topRight: {
        top: 60,
        right: 20,
    },
    bottomRight: {
        bottom: 40,
        right: 20,
    },
    header: {
        backgroundColor: 'rgba(239, 83, 80, 0.9)',
        borderRadius: 15,
    },
    inline: {
        backgroundColor: '#ef5350',
        marginTop: 10,
    },
    small: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    large: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 25,
    },
    signOutText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    smallText: {
        fontSize: 12,
        marginLeft: 4,
    },
    largeText: {
        fontSize: 16,
        marginLeft: 8,
    },
});
