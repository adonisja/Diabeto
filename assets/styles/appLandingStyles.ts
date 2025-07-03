// assets/styles/appLandingStyles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    descriptionText: {
        fontSize: 18,
        color: '#eee',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    statusContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 30,
        alignItems: 'center',
        minHeight: 60,
        justifyContent: 'center',
    },
    statusText: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 5,
        textAlign: 'center',
    },
    activityIndicator: {
        marginBottom: 10,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    warningText: {
        fontSize: 14,
        color: '#ffeb3b',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    debugContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 5,
        padding: 10,
        marginTop: 20,
        maxWidth: '90%',
    },
    debugText: {
        fontSize: 12,
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 2,
    },
});
