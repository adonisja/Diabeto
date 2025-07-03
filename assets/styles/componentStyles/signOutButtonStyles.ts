import { StyleSheet } from 'react-native';

const signOutButtonStyles = StyleSheet.create({
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ef5350',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    floating: {
        position: 'absolute',
        zIndex: 1000,
    },
    topRight: {
        top: 60,
        right: 20,
    },
    bottomRight: {
        bottom: 40,
        right: 20,
    },
    header: {
        backgroundColor: 'rgba(239, 83, 80, 0.9)',
        borderRadius: 15,
    },
    inline: {
        backgroundColor: '#ef5350',
        marginTop: 10,
    },
    small: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    large: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 25,
    },
    signOutText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    smallText: {
        fontSize: 12,
        marginLeft: 4,
    },
    largeText: {
        fontSize: 16,
        marginLeft: 8,
    },
});

export default signOutButtonStyles;
