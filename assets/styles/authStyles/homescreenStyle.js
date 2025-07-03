import { StyleSheet } from 'react-native';

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#6c757d',
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#dc3545', // Red for logout
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonGroup: {
    marginTop: 30,
    width: '80%',
    alignItems: 'center',
  },
  nestedButton: {
    width: '100%', // Make nested buttons take full width of group
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#007bff', // Blue for other actions
    borderRadius: 8,
    marginBottom: 10, // Space between buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  nestedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default homeStyles;