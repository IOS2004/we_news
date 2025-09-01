import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

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
    // paddingVertical: Spacing.sm,
    // paddingHorizontal: Spacing.lg,
    // alignItems: 'center',
    // height:2,
    height: 40,
    // backgroundColor:'yellow'
    paddingVertical: Spacing.sm,
    margin: Spacing.lg,
    marginBottom:Spacing['2xl'],
  },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSecondary,
    marginRight: Spacing.md,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  selectedChipText: {
    color: Colors.textOnPrimary,
    fontWeight: Typography.fontWeight.bold,
  },
});

export default CategoryFilter;
