// assets/styles/protectedStyles/caretakerStyles/caretakerDashboardStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#6b46c1',
    },
    backgroundGradient: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
    },
    
    // Hero Section
    heroSection: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    welcomeCard: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    welcomeEmoji: {
        fontSize: 50,
        marginBottom: 10,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    motivationalText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        fontWeight: '500',
    },

    // Actions Grid
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    alertsContainer: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 30,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    actionCard: {
        width: (screenWidth - 60) / 2,
        aspectRatio: 1,
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
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
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 12,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    cardSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
        textAlign: 'center',
        fontWeight: '500',
    },

    // Card specific styles
    glucoseCard: {},
    insulinCard: {},
    inviteCard: {},
    patientsCard: {},

    // Upgrade Section
    upgradeSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 15,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    upgradeCard: {
        backgroundColor: 'rgba(251, 191, 36, 0.15)',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(251, 191, 36, 0.3)',
    },
    upgradeCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fbbf24',
        marginTop: 10,
        textAlign: 'center',
    },
    upgradeCardText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    upgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#059669',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    upgradeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 6,
    },

    // Tips Section
    tipsSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginLeft: 12,
        lineHeight: 18,
    },

    // Bottom padding
    bottomPadding: {
        height: 40,
    },

    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#6b46c1',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
        paddingTop: 50,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    closeButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },

    // Legacy styles (for compatibility)
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    actionsContainer: {
        width: '100%',
        marginBottom: 30,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    upgradeContainer: {
        backgroundColor: 'rgba(255,215,0,0.1)',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.3)',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    upgradeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFD700',
        marginTop: 10,
        textAlign: 'center',
    },
    upgradeText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 20,
    },
});