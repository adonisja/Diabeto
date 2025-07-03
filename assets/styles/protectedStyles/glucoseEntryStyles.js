import { StyleSheet } from "react-native";

const entryStyles = StyleSheet.create({
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
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '90%',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  notesInput: {
    height: 100, // Fixed height for multiline notes
    textAlignVertical: 'top', // Align text to top for Android
  },
  buttonSpacer: {
    height: 15, // Space between buttons
  },
});

export default entryStyles