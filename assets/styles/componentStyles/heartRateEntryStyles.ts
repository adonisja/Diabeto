// assets/styles/componentStyles/heartRateEntryStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const heartRateEntryStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    
    // Header Styles
    headerGradient: {
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    headerSpacer: {
        width: 40,
    },
    
    // Content Styles
    keyboardContainer: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    
    // Welcome Card
    welcomeCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    welcomeTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2d3748',
        marginTop: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
    welcomeMessage: {
        fontSize: 16,
        color: '#4a5568',
        textAlign: 'center',
        lineHeight: 22,
    },

    // Pulse Counter Styles
    pulseCounterContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pulseCounterTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    pulseCounterInstructions: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    counterDisplay: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
    countDisplay: {
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        minWidth: 80,
    },
    countValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#e91e63',
    },
    countLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    timerDisplay: {
        alignItems: 'center',
        backgroundColor: '#fff3cd',
        borderRadius: 12,
        padding: 16,
        minWidth: 80,
    },
    timerValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#856404',
    },
    timerLabel: {
        fontSize: 12,
        color: '#856404',
        marginTop: 4,
    },
    counterControls: {
        alignItems: 'center',
    },
    startCountButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e91e63',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    startCountText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    activeCountingContainer: {
        alignItems: 'center',
        width: '100%',
    },
    pulseButton: {
        backgroundColor: '#e91e63',
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    pulseButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 8,
    },
    stopCountButton: {
        backgroundColor: '#666',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
    },
    stopCountText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    calculatedResult: {
        alignItems: 'center',
        backgroundColor: '#e8f5e8',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
    },
    calculatedLabel: {
        fontSize: 14,
        color: '#2e7d32',
        marginBottom: 4,
    },
    calculatedValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1b5e20',
    },

    // Form Section Styles
    formSection: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    inputContainer: {
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    input: {
        fontSize: 16,
        color: '#333',
        paddingVertical: 16,
        paddingHorizontal: 16,
        paddingRight: 50,
        backgroundColor: 'transparent',
        borderRadius: 12,
    },
    inputIcon: {
        position: 'absolute',
        right: 16,
        top: 18,
    },
    notesInput: {
        minHeight: 80,
        textAlignVertical: 'top',
        paddingRight: 16,
    },
    hrStatusContainer: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        alignItems: 'center',
    },
    hrStatusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },

    // Button Grid Styles
    buttonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    typeButton: {
        flex: 1,
        minWidth: (width - 80) / 2 - 6,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    selectedTypeButton: {
        backgroundColor: '#e91e63',
        borderColor: '#e91e63',
    },
    typeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
    },
    selectedTypeButtonText: {
        color: '#fff',
    },

    // Submit Button Styles
    submitButton: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        marginTop: 12,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 8,
    },
});

export default heartRateEntryStyles;
