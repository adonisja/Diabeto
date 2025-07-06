// assets/styles/protectedStyles/patientStyles/heartRateMonitoringScreenStyles.ts
import { StyleSheet } from 'react-native';

const heartRateMonitoringScreenStyles = StyleSheet.create({
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
        marginRight: 15,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginRight: 40,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
        textAlign: 'center',
        marginRight: 40,
    },
    
    // Content Styles
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    
    // Welcome Card with Enhanced Design
    welcomeCard: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    welcomeIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: 8,
        textAlign: 'center',
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    welcomeMessage: {
        fontSize: 16,
        color: '#4a5568',
        textAlign: 'center',
        lineHeight: 22,
        textShadowColor: 'rgba(255, 255, 255, 0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    
    // Options Container
    optionsContainer: {
        gap: 16,
        marginBottom: 24,
    },
    
    // Option Cards with Enhanced Design
    optionCard: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    optionGradient: {
        padding: 20,
        minHeight: 120,
    },
    optionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    optionIconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 10,
        marginRight: 12,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    optionSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
    optionArrow: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        padding: 6,
    },
    optionDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 18,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },

    // Tips Card
    tipsCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    tipsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    tipsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginLeft: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    tipsText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.95)',
        lineHeight: 20,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },

    // Legacy styles for backward compatibility
    welcomeIconContainer: {
        backgroundColor: '#f0f3ff',
        borderRadius: 25,
        padding: 15,
        marginBottom: 15,
    },
    welcomeText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    manualEntryCard: {},
    deviceCard: {},
    historyCard: {},
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.95)',
        marginLeft: 8,
        fontWeight: '500',
    },
    tipContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderLeftWidth: 4,
        borderLeftColor: '#e91e63',
    },
    tipIconContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        padding: 10,
        marginRight: 15,
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    tipText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    quickStatsContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    quickStatsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#e91e63',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default heartRateMonitoringScreenStyles;
