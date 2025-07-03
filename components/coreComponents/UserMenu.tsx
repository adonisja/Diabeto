// components/coreComponents/UserMenu.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, StyleSheet, Alert, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '@/firebase/firebaseConfig';
import { useAuth } from '../../firebase/AuthContext';
import { logAction } from '../../firebase/LogService';
import userMenuStyles from '../../assets/styles/componentStyles/userMenuStyles';

const { width, height } = Dimensions.get('window');

interface UserMenuProps {
    style?: 'header' | 'inline';
    position?: 'right' | 'left' | 'center';
    theme?: 'light' | 'dark' | 'auto';
    backgroundColor?: string;
}

export default function UserMenu({ 
    style = 'header', 
    position = 'right',
    theme = 'auto',
    backgroundColor
}: UserMenuProps) {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [loadingDots, setLoadingDots] = useState('●');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const userName = userProfile?.firstName 
        ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim()
        : user?.email?.split('@')[0] || 'User';

    const userInitials = userProfile?.firstName 
        ? `${userProfile.firstName[0]}${userProfile.lastName?.[0] || ''}`.toUpperCase()
        : (user?.email?.[0] || 'U').toUpperCase();

    const getRoleIcon = () => {
        switch (userProfile?.role) {
            case 'admin': return 'shield';
            case 'doctor': return 'medical';
            case 'caretaker': return 'people';
            case 'patient': return 'person';
            default: return 'person-circle';
        }
    };

    const getRoleColor = () => {
        switch (userProfile?.role) {
            case 'admin': return '#FF6347';
            case 'doctor': return '#32CD32';
            case 'caretaker': return '#4169E1';
            case 'patient': return '#20B2AA';
            default: return '#666';
        }
    };

    const openMenu = () => {
        setIsMenuVisible(true);
        
        // Add a subtle pulse animation to indicate interaction
        Animated.sequence([
            Animated.timing(pulseAnim, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
        
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeMenu = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setIsMenuVisible(false);
        });
    };

    const handleProfilePress = () => {
        closeMenu();
        router.push('/(protected)/userProfile');
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        
        // Start loading animation
        let dotCount = 1;
        const dotInterval = setInterval(() => {
            dotCount = (dotCount % 3) + 1;
            setLoadingDots('●'.repeat(dotCount));
        }, 500);

        try {
            const userUid = user?.uid ?? 'unknown-uid';
            const userUsername = userProfile?.username ?? user?.email?.split('@')[0] ?? 'unknown-user';
            const userEmail = user?.email ?? 'unknown-email';
            const userRole = (userProfile?.role as 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified') || 'unverified';

            // Log the logout action BEFORE signing out
            await logAction(
                userUid,
                userUsername,
                userEmail,
                userRole,
                'USER_LOGOUT',
                'success',
                { timestamp: new Date().toISOString() }
            );

            // Sign out AFTER logging
            await auth.signOut();
            closeMenu();
            console.log("User signed out successfully.");

        } catch (error: any) {
            console.error("Error signing out:", error);
            Alert.alert("Logout Error", "Failed to log out. Please try again.");

            // Log failed logout action
            await logAction(
                user?.uid ?? 'unknown-uid',
                userProfile?.username ?? user?.email?.split('@')[0] ?? 'unknown-user',
                user?.email ?? 'unknown-email',
                (userProfile?.role as 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified') || 'unverified',
                'USER_LOGOUT_FAILED',
                'failure',
                { error: error.message, timestamp: new Date().toISOString() }
            );
        } finally {
            clearInterval(dotInterval);
            setIsLoggingOut(false);
            setLoadingDots('●');
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

    const getButtonPosition = () => {
        if (style === 'header') {
            if (position === 'right') {
                return [userMenuStyles.userButton, userMenuStyles.header, userMenuStyles.headerRight];
            } else if (position === 'left') {
                return [userMenuStyles.userButton, userMenuStyles.header, userMenuStyles.headerLeft];
            } else if (position === 'center') {
                return [userMenuStyles.userButton, userMenuStyles.header, userMenuStyles.headerCenter];
            } else {
                return [userMenuStyles.userButton, userMenuStyles.header];
            }
        } else if (style === 'inline') {
            return [userMenuStyles.userButton, userMenuStyles.inline];
        }
        return [userMenuStyles.userButton];
    };

    return (
        <>
            {/* User Avatar Button */}
            <TouchableOpacity 
                style={getButtonPosition()} 
                onPress={openMenu}
                accessibilityRole="button"
                accessibilityLabel={`User menu for ${userName}`}
                accessibilityHint="Opens user menu with profile and sign out options"
                activeOpacity={0.8}
            >
                <Animated.View 
                    style={[
                        userMenuStyles.avatarContainer, 
                        { 
                            borderColor: getRoleColor(),
                            transform: [{ scale: pulseAnim }]
                        }
                    ]}
                >
                    <Text style={userMenuStyles.avatarText}>{userInitials}</Text>
                </Animated.View>
                <View style={[userMenuStyles.roleIndicator, { backgroundColor: getRoleColor() }]}>
                    <Ionicons name={getRoleIcon()} size={12} color="#fff" />
                </View>
            </TouchableOpacity>

            {/* User Menu Modal */}
            <Modal
                visible={isMenuVisible}
                transparent
                animationType="none"
                onRequestClose={closeMenu}
            >
                <TouchableOpacity 
                    style={userMenuStyles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={closeMenu}
                >
                    <Animated.View 
                        style={[
                            userMenuStyles.menuContainer,
                            position === 'left' ? userMenuStyles.menuLeft : userMenuStyles.menuRight,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }]
                            }
                        ]}
                    >
                        {/* User Info Header */}
                        <View style={userMenuStyles.userInfoHeader}>
                            <View style={[userMenuStyles.largeAvatar, { borderColor: getRoleColor() }]}>
                                <Text style={userMenuStyles.largeAvatarText}>{userInitials}</Text>
                            </View>
                            <View style={userMenuStyles.userDetails}>
                                <Text style={userMenuStyles.userName} numberOfLines={1}>{userName}</Text>
                                <Text style={userMenuStyles.userEmail} numberOfLines={1}>{user?.email}</Text>
                                <View style={userMenuStyles.roleContainer}>
                                    <Ionicons name={getRoleIcon()} size={14} color={getRoleColor()} />
                                    <Text style={[userMenuStyles.userRole, { color: getRoleColor() }]}>
                                        {userProfile?.role ? userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1) : 'User'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Menu Items */}
                        <View style={userMenuStyles.menuItems}>
                            <TouchableOpacity 
                                style={userMenuStyles.menuItem} 
                                onPress={handleProfilePress}
                                accessibilityRole="button"
                                accessibilityLabel="Edit profile"
                                accessibilityHint="Navigate to user profile page"
                                activeOpacity={0.7}
                            >
                                <View style={userMenuStyles.menuItemLeft}>
                                    <View style={userMenuStyles.menuIconContainer}>
                                        <Ionicons name="person-circle-outline" size={22} color="#4A90E2" />
                                    </View>
                                    <Text style={userMenuStyles.menuItemText}>Edit Profile</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#666" />
                            </TouchableOpacity>

                            <View style={userMenuStyles.divider} />

                            <TouchableOpacity 
                                style={[userMenuStyles.menuItem, isLoggingOut && userMenuStyles.menuItemDisabled]} 
                                onPress={confirmLogout}
                                disabled={isLoggingOut}
                                accessibilityRole="button"
                                accessibilityLabel={isLoggingOut ? "Signing out" : "Sign out"}
                                accessibilityHint="Sign out of the application"
                                activeOpacity={isLoggingOut ? 1 : 0.7}
                            >
                                <View style={userMenuStyles.menuItemLeft}>
                                    <View style={userMenuStyles.menuIconContainer}>
                                        <Ionicons name="log-out-outline" size={22} color="#FF4757" />
                                    </View>
                                    <Text style={[userMenuStyles.menuItemText, userMenuStyles.logoutText]}>
                                        {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                                    </Text>
                                </View>
                                {isLoggingOut && (
                                    <View style={userMenuStyles.loadingSpinner}>
                                        <Text style={userMenuStyles.loadingDots}>{loadingDots}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Menu Footer */}
                        <View style={userMenuStyles.menuFooter}>
                            <Text style={userMenuStyles.footerText}>
                                Diabeto Medical Platform
                            </Text>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}


