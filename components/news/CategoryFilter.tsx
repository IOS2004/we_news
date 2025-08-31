import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[styles.chip, selectedCategory === category && styles.selectedChip]}
          onPress={() => onSelectCategory(category)}
        >
          <Text style={[styles.chipText, selectedCategory === category && styles.selectedChipText]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: '#007bff',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  selectedChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CategoryFilter;
