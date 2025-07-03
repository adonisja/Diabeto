import { StyleSheet } from 'react-native';

const commonAuthStyles = StyleSheet.create({
    backgroundGradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    button: {
        width: '100%',
        backgroundColor: '#007bff', // Example color
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    linkText: {
        color: '#fff',
        marginTop: 15,
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#333',
    },
    label: {
        fontSize: 18,
        color: '#fff', // White text for visibility on gradient
        marginBottom: 10,
        fontWeight: 'bold',
        alignSelf: 'flex-start', // Align with input fields
        marginTop: 10, // Add some space above
    },
    roleSelectionContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    roleButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        marginHorizontal: 5,
    },
    roleButtonActive: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    roleButtonText: {
        color: 'white',
        fontSize: 16,
    },
    roleButtonTextActive: {
        fontWeight: 'bold',
    }
});

export default commonAuthStyles;