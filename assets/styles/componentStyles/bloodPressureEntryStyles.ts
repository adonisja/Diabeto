// assets/styles/componentStyles/bloodPressureEntryStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const bloodPressureEntryStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafb',
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    
    // Section Styles
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 16,
        paddingLeft: 4,
    },
    
    // Blood Pressure Input
    bpInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 16,
    },
    bpInputSection: {
        flex: 1,
        alignItems: 'center',
    },
    bpInputLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7f8c8d',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    bpInput: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        minWidth: 80,
        borderBottomWidth: 2,
        borderBottomColor: '#5c6ac4',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    bpSeparator: {
        paddingHorizontal: 16,
    },
    bpSeparatorText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#5c6ac4',
    },
    
    // Status Card
    statusCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    
    // Text Input
    textInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#2c3e50',
        borderWidth: 1,
        borderColor: '#ecf0f1',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    
    // Context Selection
    contextGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    contextCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        minWidth: (width - 60) / 2,
        flex: 1,
        borderWidth: 2,
        borderColor: '#ecf0f1',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    contextCardActive: {
        backgroundColor: '#5c6ac4',
        borderColor: '#5c6ac4',
    },
    contextCardText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2c3e50',
        marginTop: 8,
        textAlign: 'center',
    },
    contextCardTextActive: {
        color: '#fff',
    },
    
    // Notes Input
    notesInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#2c3e50',
        borderWidth: 1,
        borderColor: '#ecf0f1',
        minHeight: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    
    // Submit Button
    buttonContainer: {
        paddingVertical: 20,
        paddingBottom: 40,
    },
    submitButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 12,
    },
});

export default bloodPressureEntryStyles;
