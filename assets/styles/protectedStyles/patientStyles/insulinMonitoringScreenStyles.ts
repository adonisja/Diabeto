// assets/styles/protectedStyles/patientStyles/insulinMonitoringScreenStyles.ts

import { StyleSheet } from 'react-native';

const insulinMonitoringScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#667eea',
    },
    backgroundGradient: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginRight: 40,
    },
    headerSpacer: {
        width: 40,
    },
    scrollContainer: {
        flex: 1,
    },
    welcomeSection: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    welcomeCard: {
        borderRadius: 16,
        padding: 24,
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
        color: '#fff',
        marginBottom: 8,
    },
    welcomeMessage: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 22,
        opacity: 0.95,
    },
    quickStatsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#fff',
        marginTop: 4,
        opacity: 0.9,
    },
    actionSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    actionCard: {
        borderRadius: 16,
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    actionGradient: {
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    actionIcon: {
        marginRight: 16,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    actionDescription: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        lineHeight: 18,
    },
    tipsSection: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    tipsContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    tipText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        flex: 1,
        marginLeft: 12,
    },
});

export default insulinMonitoringScreenStyles;
