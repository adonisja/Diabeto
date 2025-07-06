import { StyleSheet } from 'react-native';

export const medicalAlertsPanelStyles = StyleSheet.create({
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

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'System',
  },

  badge: {
    marginLeft: 12,
    backgroundColor: '#E53E3E',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },

  filterButtonActive: {
    backgroundColor: '#E53E3E',
    borderColor: '#E53E3E',
  },

  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'System',
  },

  filterButtonTextActive: {
    color: 'white',
  },

  alertsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
  },

  emptyStateText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    fontFamily: 'System',
  },

  emptyStateSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'System',
  },

  alertCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  alertCardUnacknowledged: {
    backgroundColor: '#FFFBF0',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },

  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  alertHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  severityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  patientInfo: {
    flex: 1,
  },

  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'System',
  },

  readingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  readingType: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    textTransform: 'capitalize',
    fontFamily: 'System',
  },

  timestamp: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'System',
  },

  alertContent: {
    marginBottom: 16,
  },

  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },

  valueLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
    fontFamily: 'System',
  },

  value: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
    fontFamily: 'System',
  },

  normalRange: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    fontFamily: 'System',
  },

  description: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
    marginBottom: 4,
    fontFamily: 'System',
  },

  context: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    fontFamily: 'System',
  },

  notes: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    fontFamily: 'System',
  },

  alertActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  acknowledgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },

  acknowledgeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27ae60',
    marginLeft: 4,
    fontFamily: 'System',
  },

  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },

  viewDetailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53E3E',
    marginRight: 4,
    fontFamily: 'System',
  },
});

export default medicalAlertsPanelStyles;
