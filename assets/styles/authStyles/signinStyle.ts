import { StyleSheet } from 'react-native';

const signinStyles = StyleSheet.create({
    
    backgroundGradient: {
        flex: 1, // Crucial to make the gradient fill the entire view
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'transparent', // Make container background transparent so gradient shows through
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#aaa',
        backgroundColor: 'transparent',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        paddingHorizontal: 4,
        paddingVertical: 4,
    },
    checkboxLabel: {
        color: '#666666',
        fontSize: 14,
        flex: 1,
        fontWeight: '400'
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#fff', // Changed to white for better contrast on dark gradient
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#1a1a1a', // Ensure text color is readable
    },
    errorText: {
        color: '#ffdddd', // Lighter red for visibility on dark background
        backgroundColor: 'rgba(220, 53, 69, 0.2)', // Slightly transparent background for error
        padding: 8,
        borderRadius: 5,
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 14,
        width: '100%', // Ensure error text takes full width for better display
    },
    passwordErrorContainer: { // This is the missing style definition
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'rgba(255, 200, 0, 0.15)', // Light warning background
        borderRadius: 8,
        marginBottom: 15,
    },
    button: {
        width: '100%',
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    googleButton: {
        width: '100%',
        backgroundColor: '#dc3545',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
        marginTop: 10, // Added margin top for spacing from previous button
    },
    googleButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    appleButton: {
        width: '100%',
        height: 50,
        marginTop: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    appleButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    toggleButtonContainer: {
        marginTop: 20,
    },
    toggleButtonText: {
        color: '#007bff',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    linkText: {
        color: '#fff', // White for visibility on dark gradient
        marginTop: 15, // Space from button above
        fontSize: 16,
        justifyContent: 'center',
    },
    orText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 8,
        fontStyle: 'italic',
        opacity: 0.8,
    }
});

export default signinStyles;