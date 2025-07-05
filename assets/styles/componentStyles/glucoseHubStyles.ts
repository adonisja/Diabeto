// assets/styles/componentStyles/glucoseHubStyles.ts

import { StyleSheet } from 'react-native';

const glucoseHubStyles = StyleSheet.create({
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
    optionsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    optionCard: {
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
    optionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    optionSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    optionDescription: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        marginBottom: 16,
    },
    optionFeatures: {
        marginTop: 8,
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
    tipContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#e8f4f8',
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 30,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#b8d4da',
    },
    tipText: {
        fontSize: 14,
        color: '#2c5f66',
        marginLeft: 12,
        lineHeight: 20,
        flex: 1,
    },
    // Placeholder styles for CGM screen
    placeholderContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    placeholderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    placeholderContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    placeholderTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginTop: 20,
        marginBottom: 12,
        textAlign: 'center',
    },
    placeholderText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default glucoseHubStyles;
