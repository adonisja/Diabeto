import { StyleSheet } from 'react-native';

const doctorCredentialRequestStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginTop: 5,
    },
    formContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        marginTop: 10,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 10,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        paddingTop: 15,
    },
    noticeContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255,215,0,0.1)',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.3)',
        marginBottom: 20,
    },
    noticeText: {
        color: '#FFD700',
        fontSize: 14,
        marginLeft: 10,
        flex: 1,
        lineHeight: 20,
    },
    submitButton: {
        backgroundColor: '#32CD32',
        paddingVertical: 15,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    submitButtonDisabled: {
        backgroundColor: 'rgba(50,205,50,0.5)',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default doctorCredentialRequestStyles;
