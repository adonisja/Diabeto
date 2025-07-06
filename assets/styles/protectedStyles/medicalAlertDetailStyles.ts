import { StyleSheet } from 'react-native';

export const medicalAlertDetailStyles = StyleSheet.create({
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

  scrollContainer: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'System',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'System',
  },

  severityHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },

  severityBadgeCritical: {
    backgroundColor: '#DC2626',
  },

  severityBadgeSevere: {
    backgroundColor: '#EA580C',
  },

  severityBadgeWarning: {
    backgroundColor: '#D97706',
  },

  severityBadgeMild: {
    backgroundColor: '#059669',
  },

  severityText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
    fontFamily: 'System',
  },

  alertTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'System',
  },

  alertSubtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'System',
  },

  content: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    fontFamily: 'System',
  },

  readingContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  readingValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
  },

  readingType: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'capitalize',
    fontFamily: 'System',
  },

  normalRange: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'System',
  },

  normalRangeLabel: {
    fontWeight: '500',
  },

  patientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'System',
  },

  timestamp: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },

  description: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: 'System',
  },

  contextContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  contextTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'System',
  },

  contextText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontFamily: 'System',
  },

  medicalExplanation: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },

  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
    fontFamily: 'System',
  },

  explanationText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    fontFamily: 'System',
  },

  actionsContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    fontFamily: 'System',
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  actionButtonPrimary: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },

  actionButtonSuccess: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },

  actionButtonWarning: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },

  actionIcon: {
    marginRight: 12,
  },

  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    fontFamily: 'System',
  },

  actionTextPrimary: {
    color: 'white',
  },

  actionTextSuccess: {
    color: 'white',
  },

  actionTextWarning: {
    color: 'white',
  },

  bottomPadding: {
    height: 20,
  },

  // Missing styles that were referenced in the component
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'System',
  },

  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'System',
  },

  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  overviewCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  readingInfo: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  severityLabel: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },

  severityLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
    fontFamily: 'System',
  },

  valueSection: {
    marginBottom: 16,
  },

  valueLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
    fontFamily: 'System',
  },

  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'System',
  },

  contextSection: {
    marginBottom: 16,
  },

  contextLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
    fontFamily: 'System',
  },

  contextValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'System',
  },

  notesSection: {
    marginBottom: 16,
  },

  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
    fontFamily: 'System',
  },

  notesValue: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
    fontFamily: 'System',
  },

  medicalCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  medicalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    fontFamily: 'System',
  },

  actionsSection: {
    marginBottom: 16,
  },

  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  actionBullet: {
    fontSize: 16,
    color: '#3B82F6',
    marginRight: 8,
    fontWeight: 'bold',
    fontFamily: 'System',
  },

  riskSection: {
    marginBottom: 16,
  },

  riskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
    fontFamily: 'System',
  },

  riskText: {
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 20,
    fontFamily: 'System',
  },

  followUpSection: {
    marginBottom: 16,
  },

  followUpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
    fontFamily: 'System',
  },

  followUpText: {
    fontSize: 14,
    color: '#059669',
    lineHeight: 20,
    fontFamily: 'System',
  },

  actionButtons: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  contactButton: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },

  acknowledgeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },

  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
    fontFamily: 'System',
  },
});

export default medicalAlertDetailStyles;
