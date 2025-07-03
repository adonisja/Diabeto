import { StyleSheet } from 'react-native';

const userMenuStyles = StyleSheet.create({
    userButton: {
        position: 'relative',
    },
    floating: {
        position: 'absolute',
        zIndex: 1000,
    },
    topRight: {
        top: 50,
        right: 20,
    },
    topLeft: {
        top: 50,
        left: 20,
    },
    header: {
        // For header integration
    },
    headerRight: {
        alignSelf: 'flex-end',
    },
    headerLeft: {
        alignSelf: 'flex-start',
    },
    headerCenter: {
        alignSelf: 'center',
    },
    inline: {
        // For inline integration
    },
    avatarContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#fff',
        borderWidth: 2.5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    roleIndicator: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-start',
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
        maxWidth: 320,
        minWidth: 280,
    },
    menuRight: {
        alignSelf: 'flex-end',
        marginTop: 100,
    },
    menuLeft: {
        alignSelf: 'flex-start',
        marginTop: 100,
    },
    userInfoHeader: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    largeAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    largeAvatarText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    userDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
    },
    roleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userRole: {
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 4,
    },
    menuItems: {
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    menuItemDisabled: {
        opacity: 0.6,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIconContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    logoutText: {
        color: '#FF4757',
    },
    divider: {
        height: 1,
        backgroundColor: '#e9ecef',
        marginHorizontal: 20,
    },
    loadingSpinner: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingDots: {
        fontSize: 12,
        color: '#FF4757',
    },
    menuFooter: {
        padding: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        backgroundColor: '#f8f9fa',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    footerText: {
        fontSize: 12,
        color: '#adb5bd',
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default userMenuStyles;
