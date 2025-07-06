import { StyleSheet } from 'react-native';

export const bloodPressureViewerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'System',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'System',
  },

  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },

  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },

  filterButtonActive: {
    backgroundColor: '#E53E3E',
  },

  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'System',
  },

  filterButtonTextActive: {
    color: 'white',
  },

  statsCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    fontFamily: 'System',
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'System',
  },

  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E53E3E',
    fontFamily: 'System',
  },

  statUnit: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    fontFamily: 'System',
  },

  rangeContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  rangeText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'System',
  },

  readingsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    fontFamily: 'System',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'white',
    borderRadius: 16,
  },

  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontFamily: 'System',
  },

  readingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  readingDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'System',
  },

  readingTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontFamily: 'System',
  },

  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },

  readingValues: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  primaryValue: {
    flex: 1,
    alignItems: 'flex-start',
  },

  bpValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#E53E3E',
    fontFamily: 'System',
  },

  bpUnit: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontFamily: 'System',
  },

  pulseValue: {
    alignItems: 'center',
    paddingLeft: 20,
  },

  pulseNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2196F3',
    fontFamily: 'System',
  },

  pulseUnit: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontFamily: 'System',
  },

  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'System',
  },

  readingNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
    fontFamily: 'System',
  },
});
