// components/coreComponents/GoogleSignInButton.tsx
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useGoogleAuth, signInWithGoogle, exchangeCodeForToken, isGoogleAuthConfigured } from '../../firebase/googleAuth';
import { useRouter } from 'expo-router';

interface GoogleSignInButtonProps {
  onSignInSuccess?: () => void;
  onSignInError?: (error: string) => void;
  disabled?: boolean;
}

export default function GoogleSignInButton({ 
  onSignInSuccess, 
  onSignInError, 
  disabled = false 
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { request, response, promptAsync } = useGoogleAuth();
  const router = useRouter();

  // Handle the response from Google OAuth
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleAuthSuccess(response.params.code);
    } else if (response?.type === 'error') {
      console.error('Google OAuth error:', response.error);
      setIsLoading(false);
      onSignInError?.('Google authentication failed. Please try again.');
    } else if (response?.type === 'cancel') {
      console.log('Google OAuth cancelled by user');
      setIsLoading(false);
    }
  }, [response]);

  const handleGoogleAuthSuccess = async (code: string) => {
    try {
      // Exchange authorization code for access token
      const accessToken = await exchangeCodeForToken(code);
      
      if (!accessToken) {
        throw new Error('Failed to get access token from Google');
      }

      // Sign in with Firebase using the access token
      const result = await signInWithGoogle(accessToken);
      
      if (result.success) {
        console.log('✅ Google Sign-In successful');
        onSignInSuccess?.();
        // Navigation is handled by AuthContext
      } else {
        throw new Error(result.error || 'Google sign-in failed');
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      onSignInError?.(error.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePress = async () => {
    if (disabled || isLoading) return;

    // Check if Google auth is properly configured
    if (!isGoogleAuthConfigured()) {
      Alert.alert(
        'Configuration Error',
        'Google Sign-In is not properly configured. Please contact support.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await promptAsync();
      // Response handling is done in useEffect above
    } catch (error: any) {
      console.error('Error prompting Google auth:', error);
      setIsLoading(false);
      onSignInError?.('Failed to start Google authentication. Please try again.');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || isLoading || !request}
      style={{
        marginTop: 16,
        borderRadius: 12,
        overflow: 'hidden',
        opacity: (disabled || isLoading || !request) ? 0.6 : 1,
      }}
    >
      <LinearGradient
        colors={['#4285F4', '#34A853', '#FBBC05', '#EA4335']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 56,
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <Ionicons
              name="logo-google"
              size={24}
              color="white"
              style={{ marginRight: 12 }}
            />
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              Continue with Google
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

// Helper text component for display when Google auth is not configured
export function GoogleSignInUnavailable() {
  return (
    <View
      style={{
        marginTop: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#e0e0e0',
      }}
    >
      <Text
        style={{
          color: '#666',
          fontSize: 14,
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        Google Sign-In will be available soon
      </Text>
    </View>
  );
}
