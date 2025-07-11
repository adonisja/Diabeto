// app/(auth)/index.tsx

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router'; 
import { LinearGradient } from 'expo-linear-gradient'; 

import authCommonStyles from '../../assets/styles/authStyles/commonAuthStyles';
import authLandingStyles from '../../assets/styles/authStyles/authLandingStyles';

export default function AuthLandingScreen() { 
    // 1. Hook:
    const router = useRouter(); 

    // 2. UI Rendering:
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} /> 
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']} 
                style={authCommonStyles.backgroundGradient} 
            >
                <ScrollView contentContainerStyle={authLandingStyles.scrollContainer}>
                    <View style={authLandingStyles.container}>
                    {/* Optional: App Logo */}
                    {/* <Image source={AppLogo} style={authLandingStyles.logo} /> */}

                    <Text style={authLandingStyles.welcomeText}>
                        Welcome to Diabeto!
                    </Text>
                    <Text style={authLandingStyles.descriptionText}>
                        Let's get you Signed Up
                    </Text>

                    {/* 3. Navigation Buttons: */}
                    <TouchableOpacity
                        style={[authCommonStyles.button, authLandingStyles.buttonMargin]}
                        onPress={() => router.push('/(auth)/Signin')} 
                    >
                        <Text style={authCommonStyles.buttonText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={authCommonStyles.button}
                        onPress={() => router.push('/(auth)/Signup')} 
                    >
                        <Text style={authCommonStyles.buttonText}>Create New Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[authCommonStyles.button, {marginTop: 15}]} // Add top margin
                        onPress={() => router.push('/(auth)/Forgot-Password')} // Navigates to Forgot-Password.tsx
                    >
                        <Text style={authCommonStyles.buttonText}>Forgot Password</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </LinearGradient>
        </>
    );
}

