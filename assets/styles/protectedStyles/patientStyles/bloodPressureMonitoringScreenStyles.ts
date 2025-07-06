// assets/styles/protectedStyles/patientStyles/bloodPressureMonitoringScreenStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const bloodPressureMonitoringScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5c6ac4',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerGradient: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    
    // Welcome Card
    welcomeCard: {
        borderRadius: 20,
        padding: 25,
        marginTop: 20,
        marginBottom: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    welcomeIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    welcomeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    welcomeMessage: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    
    // Options Container
    optionsContainer: {
        marginBottom: 25,
    },
    optionCard: {
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    optionGradient: {
        padding: 20,
    },
    optionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    optionIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    optionSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
    optionArrow: {
        marginLeft: 12,
    },
    optionDescription: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.85)',
        lineHeight: 18,
        fontWeight: '500',
    },
    
    // Tips Card
    tipsCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    tipsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    tipsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 12,
    },
    tipsText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.95)',
        lineHeight: 20,
        fontWeight: '500',
    },
});

export default bloodPressureMonitoringScreenStyles;
