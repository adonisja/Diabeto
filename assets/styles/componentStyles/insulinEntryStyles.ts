// assets/styles/componentStyles/insulinEntryStyles.ts

import { StyleSheet } from 'react-native';

const insulinEntryStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    closeButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerSpacer: {
        width: 40,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 16, // Reduced padding for more diagram space
    },
    sectionContainer: {
        marginVertical: 12, // Reduced margin for more diagram space
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    optionRow: {
        flexDirection: 'row',
        gap: 10,
    },
    optionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4c669f',
        backgroundColor: '#fff',
        gap: 8,
    },
    selectedOption: {
        backgroundColor: '#4c669f',
        borderColor: '#4c669f',
    },
    optionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4c669f',
    },
    selectedOptionText: {
        color: '#fff',
    },
    recommendationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#e7f3ff',
        borderRadius: 8,
        marginBottom: 15,
        gap: 8,
    },
    recommendationText: {
        fontSize: 14,
        color: '#4c669f',
        flex: 1,
    },
    siteGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    siteOption: {
        width: '47%',
        padding: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
        minHeight: 120,
    },
    selectedSite: {
        backgroundColor: '#4c669f',
        borderColor: '#4c669f',
    },
    siteLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginTop: 8,
    },
    selectedSiteText: {
        color: '#fff',
    },
    medicalNote: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
        lineHeight: 14,
    },
    selectedMedicalNote: {
        color: '#e6f3ff',
    },
    subSiteContainer: {
        marginTop: 15,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    subSiteTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    unitsInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    unitsLabel: {
        fontSize: 14,
        color: '#666',
        marginLeft: 10,
    },
    notesInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 14,
        color: '#333',
        minHeight: 80,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4c669f',
        paddingVertical: 15,
        borderRadius: 8,
        marginVertical: 20,
        gap: 10,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default insulinEntryStyles;
