import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PlanToggleButtonProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

const PlanToggleButton: React.FC<PlanToggleButtonProps> = ({ options, selectedOption, onSelect }) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.button, selectedOption === option && styles.selectedButton]}
          onPress={() => onSelect(option)}
        >
          <Text style={[styles.text, selectedOption === option && styles.selectedText]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
  selectedButton: {
    backgroundColor: '#007bff',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PlanToggleButton;
