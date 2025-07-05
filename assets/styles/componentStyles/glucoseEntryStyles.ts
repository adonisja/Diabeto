// assets/styles/componentStyles/glucoseEntryStyles.ts

import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const glucoseEntryStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8', // Softer background instead of stark white
    },
    
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    
    mainCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    
    // Input Section
    inputSection: {
        marginBottom: 32,
    },
    
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    
    inputContainer: {
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    
    valueInput: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1f2937',
        textAlign: 'center',
        padding: 0,
    },
    
    // Timing Section - Dedicated Styles for Clean 2x2 Grid
    timingSection: {
        marginBottom: 32,
    },
    
    timingSectionHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
        textAlign: 'center',
    },
    
    timingGrid: {
        marginBottom: 16,
    },
    
    timingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    
    timingGridItem: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 12,
        width: (width - 72) / 2, // Proper spacing for 2 columns
        minHeight: 70,
    },
    
    timingGridItemSelected: {
        backgroundColor: '#eff6ff',
        borderColor: '#3b82f6',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    
    timingGridEmoji: {
        fontSize: 22,
        marginBottom: 6,
    },
    
    timingGridLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6b7280',
        textAlign: 'center',
    },
    
    timingGridLabelSelected: {
        color: '#3b82f6',
    },
    
    // Random Option - Centered and Distinguished
    randomOptionContainer: {
        alignItems: 'center',
    },
    
    randomOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef3c7',
        borderWidth: 2,
        borderColor: '#f59e0b',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 24,
        width: (width - 60) * 0.7, // 70% width, centered
    },
    
    randomOptionSelected: {
        backgroundColor: '#fbbf24',
        borderColor: '#d97706',
        shadowColor: '#f59e0b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    
    randomEmoji: {
        fontSize: 20,
        marginRight: 8,
    },
    
    randomLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#92400e',
    },
    
    randomLabelSelected: {
        color: '#78350f',
    },
    
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
    },

    
    // Current Selection Display
    currentSelectionContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    
    currentSelectionLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
    },
    
    currentSelectionValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    
    // Interactive Hand Selection Button
    handSelectionButton: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    
    handSelectionButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 12,
    },
    
    handSelectionButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        flex: 1,
        textAlign: 'center',
    },
    
    // Finger Section - Interactive Hand Selection System
    fingerSection: {
        marginBottom: 32,
    },
    
    fingerSectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 8,
        textAlign: 'center',
    },
    
    fingerGrid: {
        gap: 8,
    },
    
    fingerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    
    fingerOption: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: '#f9fafb',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        width: '48%', // Two columns
        minHeight: 80,
        justifyContent: 'center',
    },
    
    fingerOptionSelected: {
        backgroundColor: '#eff6ff',
        borderColor: '#3b82f6',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    
    fingerOptionRecommended: {
        backgroundColor: '#fef3c7',
        borderColor: '#f59e0b',
        shadowColor: '#f59e0b',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
        // Enhanced glow effect
        borderWidth: 3,
        // Additional visual emphasis
        transform: [{ scale: 1.02 }],
    },
    
    fingerEmoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    
    fingerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 2,
    },
    
    fingerLabelSelected: {
        color: '#1d4ed8',
        fontWeight: '700',
    },
    
    fingerSide: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9ca3af',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },
    
    recommendationText: {
        fontSize: 14,
        color: '#f59e0b',
        fontWeight: '500',
    },
    
    // Notes Section
    notesSection: {
        marginBottom: 32,
    },
    
    notesInput: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#374151',
        backgroundColor: '#fff',
        minHeight: 80,
    },
    
    // Validation
    validationContainer: {
        marginTop: 12,
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    validationContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    
    statusIconContainer: {
        marginRight: 8,
    },
    
    statusText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    
    // Save Button
    saveButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 24,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    
    saveButtonDisabled: {
        backgroundColor: '#9ca3af',
        shadowOpacity: 0,
        elevation: 0,
    },
    
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    
    // Reference Card
    referenceCard: {
        backgroundColor: '#f0f9ff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#bae6fd',
    },
    
    referenceTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0c4a6e',
        marginBottom: 8,
    },
    
    referenceList: {
        gap: 4,
    },
    
    referenceItem: {
        fontSize: 12,
        color: '#0369a1',
        lineHeight: 16,
    },
});

export default glucoseEntryStyles;