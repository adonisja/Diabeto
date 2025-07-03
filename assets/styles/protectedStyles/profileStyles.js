import { StyleSheet } from "react-native";

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8', // Light blue-grey background
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50', // Dark text
    marginBottom: 30,
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#34495e',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  buttonGroup: {
    marginTop: 30,
    width: '80%',
  },
});

export default profileStyles;