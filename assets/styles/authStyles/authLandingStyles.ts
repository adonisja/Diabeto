// assets/styles/authStyles/authLandingStyles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
        marginBottom: 50,
        lineHeight: 24,
    },
    buttonMargin: {
        marginBottom: 15,
    },
});
