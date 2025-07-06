// assets/styles/protectedStyles/patientStyles/patientDashboardStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#667eea',
    },
    backgroundGradient: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        paddingTop: 20, // Add top padding to create space after header
    },
    heroSection: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    welcomeCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    welcomeEmoji: {
        fontSize: 40,
        marginBottom: 10,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    motivationalText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        opacity: 0.9,
        fontWeight: '600',
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    actionCard: {
        width: (width - 50) / 2,
        height: 140,
        marginBottom: 15,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    cardGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginTop: 8,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#fff',
        opacity: 0.9,
        textAlign: 'center',
        marginTop: 4,
        fontWeight: '500',
    },
    glucoseCard: {
        // Additional styles for glucose card if needed
    },
    insulinCard: {
        // Additional styles for insulin card if needed
    },
    heartRateCard: {
        // Additional styles for heart rate card if needed
    },
    bloodPressureCard: {
        // Additional styles for blood pressure card if needed
    },
    invitationsCard: {
        // Additional styles for invitations card if needed
    },
    remindersCard: {
        // Additional styles for reminders card if needed
    },
    profileCard: {
        // Additional styles for profile card if needed
    },
    tipsSection: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    tipCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tipText: {
        fontSize: 14,
        color: '#fff',
        marginLeft: 12,
        flex: 1,
        fontWeight: '500',
        lineHeight: 20,
    },
    bottomPadding: {
        height: 50,
    },
    
    // Reminders Screen Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    saveButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    warningCard: {
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        borderRadius: 12,
        padding: 15,
        margin: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 193, 7, 0.3)',
    },
    warningText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 10,
        flex: 1,
        fontWeight: '500',
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchLabel: {
        color: '#fff',
        fontSize: 14,
        marginRight: 10,
        fontWeight: '500',
    },
    settingsGroup: {
        marginTop: 10,
    },
    timeSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        marginBottom: 10,
    },
    timeLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    timeValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        opacity: 0.9,
    },
    delaySelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        marginTop: 10,
    },
    delayLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    delayValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        opacity: 0.9,
    },
    description: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.8,
        fontStyle: 'italic',
        marginTop: 5,
    },

    addMealButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
    customMealSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    customMealInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    customMealText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    customMealTime: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        opacity: 0.9,
    },
    removeButton: {
        padding: 8,
        marginLeft: 10,
    },

    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    addButton: {
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    // Custom Meal Reminder Styles
    customMealContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    removeMealButton: {
        padding: 8,
        marginLeft: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
    },
    addMealButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        marginTop: 10,
        backgroundColor: 'rgba(79, 172, 254, 0.15)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(79, 172, 254, 0.3)',
        borderStyle: 'dashed',
    },
    addMealText: {
        color: '#4facfe',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
        padding: 25,
        margin: 20,
        maxWidth: width - 40,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    emojiContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    emojiButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedEmoji: {
        borderColor: '#4facfe',
        backgroundColor: 'rgba(79, 172, 254, 0.2)',
    },
    emojiText: {
        fontSize: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    
    // Legacy styles for backward compatibility
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    roleText: {
        fontSize: 18,
        color: '#eee',
        marginBottom: 30,
        textAlign: 'center',
    },
});
