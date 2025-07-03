// assets/styles/unmatchedStyles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
