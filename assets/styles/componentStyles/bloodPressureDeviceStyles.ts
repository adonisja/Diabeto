import { StyleSheet } from 'react-native';

export const bloodPressureDeviceStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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

  settingsCard: {
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

  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    fontFamily: 'System',
  },

  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  settingInfo: {
    flex: 1,
    marginRight: 16,
  },

  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'System',
  },

  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontFamily: 'System',
  },

  intervalContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  intervalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    fontFamily: 'System',
  },

  intervalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  intervalButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },

  intervalButtonActive: {
    backgroundColor: '#E53E3E',
  },

  intervalButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'System',
  },

  intervalButtonTextActive: {
    color: 'white',
  },

  devicesContainer: {
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

  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'white',
    borderRadius: 16,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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

  emptyStateSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    fontFamily: 'System',
  },

  deviceCard: {
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

  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  deviceInfo: {
    flex: 1,
    marginRight: 16,
  },

  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'System',
  },

  deviceType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontFamily: 'System',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginLeft: 4,
    textTransform: 'capitalize',
    fontFamily: 'System',
  },

  deviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  batteryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontFamily: 'System',
  },

  deviceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },

  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: 'System',
  },

  connectButton: {
    backgroundColor: '#E53E3E',
  },

  syncButton: {
    backgroundColor: '#4CAF50',
  },

  disconnectButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#F44336',
  },

  helpCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },

  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F57F17',
    marginBottom: 8,
    fontFamily: 'System',
  },

  helpText: {
    fontSize: 14,
    color: '#F57F17',
    lineHeight: 20,
    fontFamily: 'System',
  },
});
