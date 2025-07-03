import { StyleSheet } from "react-native";

const requestStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    width: '90%',
  },
  input: {
    width: '90%',
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  buttonSpacer: {
    height: 15,
  },
  permissionText: {
    color: '#dc3545',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  }
});

export default requestStyles