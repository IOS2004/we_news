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
    <View >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // The style prop styles the container OF the scrollable content
        style={styles.mainContainer}
      // The contentContainerStyle prop styles the content INSIDE
      contentContainerStyle={styles.container}
    >
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
    </View>
  );
};

const styles = StyleSheet.create({
  // This is the outer container with the blue background.
  // We remove all height and spacing from here to let it wrap its content.
  mainContainer: {
    backgroundColor: '#ffffff29',
    // paddingVertical: Spacing.md,
  },
  // This styles the content area *inside* the ScrollView.
  // This is where all spacing should be handled.
  container: {
    // Add padding above and below the chips for vertical spacing.
    paddingVertical: Spacing.md,
    // Add padding on the left for the first item.
    paddingHorizontal: Spacing.lg,
    // Vertically center the chips within the padded area.
    // alignItems: 'center',
    justifyContent: 'center',
    // height: 60,
  },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSecondary,
    marginRight: Spacing.md, // This creates space between the chips
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