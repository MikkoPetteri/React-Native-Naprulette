import { TextInput, StyleSheet, Text } from 'react-native';

export default function IconBtn({ label, inputValue, handleChange }) {
  return (
    <TextInput 
        style={styles.input} 
        onChangeText={handleChange} 
        value={inputValue} 
        keyboardType="numeric"
        placeholder={label}
        placeholderTextColor="#999"/> 
  );
}

const styles = StyleSheet.create({
  input: { 
    width: 100, 
    height: 40, 
    borderWidth: 2, 
    borderColor: "#3498db", 
    borderRadius: 10, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    fontSize: 15, 
    color: "#333", 
    backgroundColor: "#fff", 
  },
});