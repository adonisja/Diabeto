// assets/styles/commonAppStyles.js
import { StyleSheet } from 'react-native';

const commonAppStyles = StyleSheet.create({
    backgroundGradient: {
        flex: 1,
        width: '100%',
        height: '100%',
        // Ensure it covers the whole screen
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent dark overlay for loading
    },
    loadingText: {
        marginTop: 10,
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    input: {
        width: '90%',
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.1)', // Semi-transparent white background
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#fff', // White text
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)', // Light border
    },
    button: {
        width: '90%',
        height: 50,
        backgroundColor: '#00bcd4', // A teal color for actions
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10, // Space between buttons
        // Basic shadow for depth on Android and iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff', // White text for buttons
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ffdddd', // Light red for error messages
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
        width: '90%', // Ensures it takes full width within container
    },
    linkText: {
        color: '#aaddff', // A light blue for clickable text links
        fontSize: 16,
        marginTop: 15,
        textDecorationLine: 'underline',
    },
});

export default commonAppStyles;