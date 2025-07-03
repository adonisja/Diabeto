// components/coreComponents/AppHeader.tsx
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import UserMenu from './UserMenu';
import appHeaderStyles from '../../assets/styles/componentStyles/appHeaderStyles';

interface AppHeaderProps {
    title?: string;
    subtitle?: string;
    gradient?: string[];
    showBackButton?: boolean;
    backgroundColor?: string;
    titleStyle?: object;
    subtitleStyle?: object;
}

export default function AppHeader({
    title = 'Diabeto',
    subtitle,
    gradient,
    backgroundColor = '#fff',
    titleStyle,
    subtitleStyle,
}: AppHeaderProps) {
    // Determine text color based on background or gradient
    const textColor = gradient ? '#ffffff' : '#000000';
    
    const headerContent = (
        <View style={appHeaderStyles.headerContainer}>
            <View style={appHeaderStyles.titleContainer}>
                {title && (
                    <Text style={[appHeaderStyles.title, { color: textColor }, titleStyle]} numberOfLines={1}>
                        {title}
                    </Text>
                )}
                {subtitle && (
                    <Text style={[appHeaderStyles.subtitle, { color: textColor }, subtitleStyle]} numberOfLines={1}>
                        {subtitle}
                    </Text>
                )}
            </View>
            
            <View style={appHeaderStyles.menuContainer}>
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
            <SafeAreaView style={appHeaderStyles.safeArea}>
                <LinearGradient colors={gradient} style={appHeaderStyles.gradientHeader}>
                    {headerContent}
                </LinearGradient>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={appHeaderStyles.safeArea}>
            <View style={[appHeaderStyles.solidHeader, { backgroundColor }]}>
                {headerContent}
            </View>
        </SafeAreaView>
    );
}
