// assets/styles/protectedStyles/userProfileStyles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    roleSelectionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', 
        justifyContent: 'center',
        marginBottom: 20,
        width: '100%',
    },
    roleButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 5,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    roleButtonActive: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    roleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    roleButtonTextActive: {
        color: '#192f6a', 
    },
    securityNotice: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontStyle: 'italic',
    },
});
