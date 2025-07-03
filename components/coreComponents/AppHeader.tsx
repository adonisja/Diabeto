// components/coreComponents/AppHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import UserMenu from './UserMenu';

interface AppHeaderProps {
    title?: string;
    subtitle?: string;
    gradient?: string[];
    showBackButton?: boolean;
    backgroundColor?: string;
    textColor?: string;
}

export default function AppHeader({
    title,
    subtitle,
    gradient,
    showBackButton = false,
    backgroundColor = '#fff',
    textColor = '#333'
}: AppHeaderProps) {
    const headerContent = (
        <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
                {title && (
                    <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
                        {title}
                    </Text>
                )}
                {subtitle && (
                    <Text style={[styles.subtitle, { color: textColor }]} numberOfLines={1}>
                        {subtitle}
                    </Text>
                )}
            </View>
            
            <View style={styles.menuContainer}>
                <UserMenu 
                    style="header" 
                    position="right" 
                    theme="auto"
                    backgroundColor={backgroundColor}
                />
            </View>
        </View>
    );

    if (gradient && gradient.length > 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <LinearGradient colors={gradient} style={styles.gradientHeader}>
                    {headerContent}
                </LinearGradient>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.solidHeader, { backgroundColor }]}>
                {headerContent}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'transparent',
    },
    gradientHeader: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    solidHeader: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 50,
    },
    titleContainer: {
        flex: 1,
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 14,
        opacity: 0.8,
    },
    menuContainer: {
        flexShrink: 0,
    },
});
