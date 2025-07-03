import { StyleSheet } from "react-native";

const invitationStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    listContentContainer: {
        paddingBottom: 20, // Add some padding at the bottom of the list
    },
    invitationCard: {
        backgroundColor: 'rgba(255,255,255,0.15)', // Slightly visible card background
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        width: 350, // Fixed width for cards, adjust as needed
        maxWidth: '95%', // Max width relative to container
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    cardText: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 5,
    },
    cardLabel: {
        fontWeight: 'bold',
        color: '#e0e0e0', // Slightly different color for labels
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    acceptButton: {
        backgroundColor: '#4CAF50', // Green for accept
        width: '48%', // Take half width
        marginHorizontal: '1%',
        height: 45, // Slightly smaller buttons than commonAppStyles.button
    },
    rejectButton: {
        backgroundColor: '#F44336', // Red for reject
        width: '48%', // Take half width
        marginHorizontal: '1%',
        height: 45,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
        color: '#eee',
        textAlign: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)', // Semi-transparent white
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default invitationStyles;