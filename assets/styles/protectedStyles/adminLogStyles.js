import { StyleSheet } from "react-native";

const adminLogStyles = StyleSheet.create({
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
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  logItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  logText: {
    fontSize: 15,
    marginBottom: 4,
    color: '#34495e',
  },
  logLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default adminLogStyles