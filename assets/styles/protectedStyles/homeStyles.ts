// assets/styles/protectedStyles/homeStyles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
        padding: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00796b',
        marginBottom: 30,
        textAlign: 'center',
    },
    userInfoContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 30,
        alignItems: 'flex-start',
        width: '80%',
    },
    userInfoText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    userInfoTextBold: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
});
