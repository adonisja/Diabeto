import { StyleSheet } from 'react-native';

const appHeaderStyles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'transparent',
    },
    gradientHeader: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    solidHeader: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 50,
    },
    titleContainer: {
        flex: 1,
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 14,
        opacity: 0.8,
    },
    menuContainer: {
        flexShrink: 0,
    },
});

export default appHeaderStyles;
