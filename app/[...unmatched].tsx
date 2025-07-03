import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import commonAppStyles from '../assets/styles/protectedStyles/commonAppStyles';
import unmatchedStyles from '../assets/styles/unmatchedStyles';

export default function UnmatchedRouteScreen() {
  // `unmatched` will be an array of the unmatched path segments.
  // For example, if user navigates to /non-existent/page, unmatched will be ['non-existent', 'page']
  const { unmatched } = useLocalSearchParams();
  const router = useRouter();

  // Join the array segments back into a single string for display
  const fullUnmatchedPath = Array.isArray(unmatched) ? unmatched.join('/') : (unmatched || 'unknown');

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']} // Consistent gradient background
      style={commonAppStyles.backgroundGradient}
    >
      {/*
        Stack.Screen options for this specific page.
        Setting headerShown: false removes the navigation header for this 404 page.
      */}
      <Stack.Screen options={{ title: 'Page Not Found', headerShown: false }} />

      <View style={unmatchedStyles.container}>
        <Text style={unmatchedStyles.errorCode}>404</Text>
        <Text style={unmatchedStyles.errorMessage}>Page Not Found</Text>
        {/* Display the unmatched path to the user */}
        <Text style={unmatchedStyles.pathText}>The path "{fullUnmatchedPath}" does not exist.</Text>

        {/* Button to navigate back to the app's root/home page */}
        <TouchableOpacity style={commonAppStyles.button} onPress={() => router.replace('/')}>
          <Text style={commonAppStyles.buttonText}>Go to Home</Text>
        </TouchableOpacity>

        {/* Optional: Button to go back to the previous screen in the navigation history */}
        <TouchableOpacity style={unmatchedStyles.backButton} onPress={() => router.back()}>
          <Text style={unmatchedStyles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

