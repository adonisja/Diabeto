// assets/styles/protectedStyles/patientStyles/patientDashboardStyles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    roleText: {
        fontSize: 18,
        color: '#eee',
        marginBottom: 30,
        textAlign: 'center',
    },
});
