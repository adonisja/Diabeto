// assets/styles/componentStyles/cgmStyles.ts

import { StyleSheet } from 'react-native';

const cgmStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    closeButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerSpacer: {
        width: 34,
    },
    content: {
        flex: 1,
    },
    introContainer: {
        alignItems: 'center',
        padding: 30,
        paddingBottom: 20,
    },
    introTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    introText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    quickActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    syncButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4c669f',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 15,
        justifyContent: 'center',
    },
    syncButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    autoSyncContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    autoSyncLabel: {
        fontSize: 16,
        color: '#333',
        marginRight: 10,
    },
    devicesContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    deviceCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    deviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    deviceIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    deviceInfo: {
        flex: 1,
    },
    deviceName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    deviceBrand: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    connectedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    connectedText: {
        fontSize: 14,
        color: '#4ECDC4',
        fontWeight: '600',
        marginLeft: 4,
    },
    connectButton: {
        backgroundColor: '#4c669f',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    connectedButton: {
        backgroundColor: '#4ECDC4',
    },
    connectButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    deviceDescription: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        marginBottom: 16,
    },
    featuresContainer: {
        marginBottom: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    lastSync: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 8,
    },
    helpContainer: {
        backgroundColor: '#e8f4f8',
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 30,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#b8d4da',
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c5f66',
        marginBottom: 8,
    },
    helpText: {
        fontSize: 14,
        color: '#2c5f66',
        lineHeight: 20,
    },
});

export default cgmStyles;
