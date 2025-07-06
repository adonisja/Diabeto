// assets/styles/componentStyles/heartRateViewerStyles.ts
import { StyleSheet } from 'react-native';

const heartRateViewerStyles = StyleSheet.create({
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

    // Stats Container
    statsContainer: {
        margin: 20,
        borderRadius: 16,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: '#fff',
        opacity: 0.9,
        textAlign: 'center',
        fontWeight: '500',
    },

    // List Container
    listContainer: {
        padding: 20,
        paddingBottom: 40,
    },

    // Reading Item Styles
    readingItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    readingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    heartRateValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333',
    },
    unit: {
        fontSize: 16,
        color: '#666',
        marginLeft: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
        marginLeft: 4,
    },

    // Reading Details
    readingDetails: {
        marginBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    typeEmoji: {
        fontSize: 16,
        marginRight: 4,
    },
    methodBadge: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 8,
    },
    methodText: {
        fontSize: 10,
        color: '#1976d2',
        fontWeight: '600',
    },

    // Notes Container
    notesContainer: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    notesText: {
        fontSize: 14,
        color: '#555',
        fontStyle: 'italic',
        lineHeight: 20,
    },

    // Empty State
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: '#e91e63',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    emptyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default heartRateViewerStyles;
