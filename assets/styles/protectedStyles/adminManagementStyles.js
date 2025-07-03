import { StyleSheet } from "react-native";

const adminStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f4f8', // Light blue-grey background
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2c3e50',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#34495e',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  patientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  patientText: {
    fontSize: 16,
    color: '#444',
    flexShrink: 1, // Allow text to shrink
    marginRight: 10,
  },
  roleButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  roleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 10,
  },
  requestItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 10,
  },
  requestText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#444',
  },
  requestButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  approveButton: {
    backgroundColor: '#28a745',
  },
  denyButton: {
    backgroundColor: '#dc3545',
  },
  removeButton: {
    backgroundColor: '#dc3545',
  },
  caretakerManagementSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#34495e',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fcfcfc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  approvedCaretakerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e9eff4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  approvedCaretakerText: {
    fontSize: 15,
    color: '#34495e',
  },
});

export default adminStyles