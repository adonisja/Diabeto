import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f2f5', // A slightly softer, modern background color
    },
    title: {
        fontSize: 34, // Slightly larger title for impact
        fontWeight: 'bold',
        marginBottom: 40, // More space below the title
        color: '#2c3e50', // Darker text for better contrast and modern feel
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 55, // Slightly taller input fields for better touch target
        borderColor: '#d2d6dc', // Softer, more subtle border color
        borderWidth: 1,
        borderRadius: 12, // More rounded corners for a modern look
        paddingHorizontal: 18, // Increased padding
        marginBottom: 18, // More space between input fields
        backgroundColor: '#fff',
        fontSize: 17, // Slightly larger font size in inputs
        // Subtle inner shadow for input fields to give depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    errorText: {
        color: '#e74c3c', // A more vibrant red for error messages
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 15, // Slightly larger error text
        fontWeight: '500', // A bit bolder for emphasis
    },
    // Styles for the TouchableOpacity button wrapper.
    // The gradient and primary background colors are applied via LinearGradient directly in the component.
    button: {
        width: '100%',
        padding: 16, // More padding for a bolder button
        borderRadius: 12, // Consistent rounded corners
        alignItems: 'center',
        justifyContent: 'center', // Ensure text is centered vertically
        marginBottom: 15, // Space below the button
        // Enhanced shadow for a lifted, prominent look
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // Deeper shadow
        shadowOpacity: 0.3, // More opaque shadow
        shadowRadius: 5,    // Softer shadow blur
        elevation: 8,       // Android shadow
        overflow: 'hidden', // Essential for shadow and border-radius to work well with gradients
    },
    buttonText: {
        color: '#fff',
        fontSize: 19, // Slightly larger, more prominent text
        fontWeight: 'bold',
    },
    // Styles for the GoogleSigninButton component itself.
    // Note: GoogleSigninButton has internal styling, so width/height are the primary controls here.
    googleButton: {
        width: '100%', // Match other buttons' width
        height: 55,    // Match other buttons' height
        marginBottom: 15, // Consistent spacing below the button
    },
    toggleButtonContainer: {
        marginTop: 25, // More space above the toggle links
        width: '100%',
        alignItems: 'center',
    },
    toggleButtonText: {
        color: '#3498db', // A brighter, more inviting blue for links
        fontSize: 16,
        textDecorationLine: 'underline',
        marginBottom: 10, // Add space between multiple toggle links (like Forgot Password)
    },
    keyboardAvoidingView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    }
});