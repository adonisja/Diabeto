import { StyleSheet } from 'react-native';

const notificationSettingsStyles = StyleSheet.create({
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
    fontSize: 16,
    color: '#666',
    fontFamily: 'System',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 40,
  },

  closeButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'System',
  },

  placeholder: {
    width: 40,
  },

  scrollContainer: {
    flex: 1,
  },

  section: {
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    padding: 16,
    paddingBottom: 8,
    fontFamily: 'System',
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },

  disabledRow: {
    opacity: 0.6,
  },

  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  settingContent: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
    fontFamily: 'System',
  },

  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },

  disabledText: {
    color: '#BDC3C7',
  },

  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5C6AC4',
    marginRight: 8,
    fontFamily: 'System',
  },

  enableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5C6AC4',
    margin: 16,
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },

  enableButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
    fontFamily: 'System',
  },

  infoSection: {
    margin: 16,
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },

  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    marginLeft: 12,
    fontFamily: 'System',
  },

  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
    fontFamily: 'System',
  },

  bottomPadding: {
    height: 40,
  },
});

export { notificationSettingsStyles };
export default notificationSettingsStyles;
