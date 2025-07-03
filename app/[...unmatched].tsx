import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Assuming you have this installed
import commonAppStyles from '../assets/styles/protectedStyles/commonAppStyles'; // Adjust path if needed

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

      <View style={styles.container}>
        <Text style={styles.errorCode}>404</Text>
        <Text style={styles.errorMessage}>Page Not Found</Text>
        {/* Display the unmatched path to the user */}
        <Text style={styles.pathText}>The path "{fullUnmatchedPath}" does not exist.</Text>

        {/* Button to navigate back to the app's root/home page */}
        <TouchableOpacity style={commonAppStyles.button} onPress={() => router.replace('/')}>
          <Text style={commonAppStyles.buttonText}>Go to Home</Text>
        </TouchableOpacity>

        {/* Optional: Button to go back to the previous screen in the navigation history */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCode: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  errorMessage: {
    fontSize: 24,
    color: '#eee',
    marginBottom: 20,
    textAlign: 'center',
  },
  pathText: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 40,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)', // Semi-transparent white
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});