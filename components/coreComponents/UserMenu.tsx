// components/coreComponents/UserMenu.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, StyleSheet, Alert, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '@/firebase/firebaseConfig';
import { useAuth } from '../../firebase/AuthContext';
import { logAction } from '../../firebase/LogService';

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
                return [styles.userButton, styles.header, styles.headerRight];
            } else if (position === 'left') {
                return [styles.userButton, styles.header, styles.headerLeft];
            } else if (position === 'center') {
                return [styles.userButton, styles.header, styles.headerCenter];
            } else {
                return [styles.userButton, styles.header];
            }
        } else if (style === 'inline') {
            return [styles.userButton, styles.inline];
        }
        return [styles.userButton];
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
                        styles.avatarContainer, 
                        { 
                            borderColor: getRoleColor(),
                            transform: [{ scale: pulseAnim }]
                        }
                    ]}
                >
                    <Text style={styles.avatarText}>{userInitials}</Text>
                </Animated.View>
                <View style={[styles.roleIndicator, { backgroundColor: getRoleColor() }]}>
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
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={closeMenu}
                >
                    <Animated.View 
                        style={[
                            styles.menuContainer,
                            position === 'left' ? styles.menuLeft : styles.menuRight,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }]
                            }
                        ]}
                    >
                        {/* User Info Header */}
                        <View style={styles.userInfoHeader}>
                            <View style={[styles.largeAvatar, { borderColor: getRoleColor() }]}>
                                <Text style={styles.largeAvatarText}>{userInitials}</Text>
                            </View>
                            <View style={styles.userDetails}>
                                <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
                                <Text style={styles.userEmail} numberOfLines={1}>{user?.email}</Text>
                                <View style={styles.roleContainer}>
                                    <Ionicons name={getRoleIcon()} size={14} color={getRoleColor()} />
                                    <Text style={[styles.userRole, { color: getRoleColor() }]}>
                                        {userProfile?.role ? userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1) : 'User'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Menu Items */}
                        <View style={styles.menuItems}>
                            <TouchableOpacity 
                                style={styles.menuItem} 
                                onPress={handleProfilePress}
                                accessibilityRole="button"
                                accessibilityLabel="Edit profile"
                                accessibilityHint="Navigate to user profile page"
                                activeOpacity={0.7}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={styles.menuIconContainer}>
                                        <Ionicons name="person-circle-outline" size={22} color="#4A90E2" />
                                    </View>
                                    <Text style={styles.menuItemText}>Edit Profile</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#666" />
                            </TouchableOpacity>

                            <View style={styles.divider} />

                            <TouchableOpacity 
                                style={[styles.menuItem, isLoggingOut && styles.menuItemDisabled]} 
                                onPress={confirmLogout}
                                disabled={isLoggingOut}
                                accessibilityRole="button"
                                accessibilityLabel={isLoggingOut ? "Signing out" : "Sign out"}
                                accessibilityHint="Sign out of the application"
                                activeOpacity={isLoggingOut ? 1 : 0.7}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={styles.menuIconContainer}>
                                        <Ionicons name="log-out-outline" size={22} color="#FF4757" />
                                    </View>
                                    <Text style={[styles.menuItemText, styles.logoutText]}>
                                        {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                                    </Text>
                                </View>
                                {isLoggingOut && (
                                    <View style={styles.loadingSpinner}>
                                        <Text style={styles.loadingDots}>{loadingDots}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Menu Footer */}
                        <View style={styles.menuFooter}>
                            <Text style={styles.footerText}>
                                Diabeto Medical Platform
                            </Text>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    userButton: {
        position: 'relative',
    },
    floating: {
        position: 'absolute',
        zIndex: 1000,
    },
    topRight: {
        top: 50,
        right: 20,
    },
    topLeft: {
        top: 50,
        left: 20,
    },
    header: {
        // For header integration
    },
    headerRight: {
        alignSelf: 'flex-end',
    },
    headerLeft: {
        alignSelf: 'flex-start',
    },
    headerCenter: {
        alignSelf: 'center',
    },
    inline: {
        // For inline integration
    },
    avatarContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#fff',
        borderWidth: 2.5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    roleIndicator: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-start',
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
        maxWidth: 320,
        minWidth: 280,
    },
    menuRight: {
        alignSelf: 'flex-end',
        marginTop: 100,
    },
    menuLeft: {
        alignSelf: 'flex-start',
        marginTop: 100,
    },
    userInfoHeader: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    largeAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    largeAvatarText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    userDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
    },
    roleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userRole: {
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 4,
    },
    menuItems: {
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    menuItemDisabled: {
        opacity: 0.6,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIconContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    logoutText: {
        color: '#FF4757',
    },
    divider: {
        height: 1,
        backgroundColor: '#e9ecef',
        marginHorizontal: 20,
    },
    loadingSpinner: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingDots: {
        fontSize: 12,
        color: '#FF4757',
    },
    menuFooter: {
        padding: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        backgroundColor: '#f8f9fa',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    footerText: {
        fontSize: 12,
        color: '#adb5bd',
        textAlign: 'center',
        fontWeight: '500',
    },
});
