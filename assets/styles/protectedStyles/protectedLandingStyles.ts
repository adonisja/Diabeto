import { StyleSheet } from 'react-native';

const protectedLandingStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },
});

export default protectedLandingStyles;
