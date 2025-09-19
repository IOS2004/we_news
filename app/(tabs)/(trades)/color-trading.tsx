import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../components/common";
import { Colors, Typography, Spacing, BorderRadius } from "../../../constants/theme";

interface Plan {
  id: string;
  amount: number;
  label: string;
}

interface Color {
  id: string;
  name: string;
  color: string;
  textColor: string;
}

const plans: Plan[] = [
  { id: '1', amount: 10, label: '₹10' },
  { id: '2', amount: 20, label: '₹20' },
  { id: '3', amount: 50, label: '₹50' },
  { id: '4', amount: 100, label: '₹100' },
];

const colors: Color[] = [
  { id: 'red', name: 'Red', color: '#B91C7C', textColor: 'white' },
  { id: 'blue', name: 'Blue', color: '#1D4ED8', textColor: 'white' },
  { id: 'green', name: 'Green', color: '#059669', textColor: 'white' },
  { id: 'yellow', name: 'Yellow', color: '#D97706', textColor: 'white' },
  { id: 'orange', name: 'Orange', color: '#EA580C', textColor: 'white' },
  { id: 'purple', name: 'Purple', color: '#7C3AED', textColor: 'white' },
  { id: 'black', name: 'Black', color: '#374151', textColor: 'white' },
  { id: 'white', name: 'White', color: '#F3F4F6', textColor: 'black' },
  { id: 'brown', name: 'Brown', color: '#92400E', textColor: 'white' },
];

export default function ColourTrading() {
  const [balance] = useState(1234);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const handleColorSelect = (colorId: string) => {
    if (selectedColors.includes(colorId)) {
      setSelectedColors(prev => prev.filter(id => id !== colorId));
    } else {
      setSelectedColors(prev => [...prev, colorId]);
    }
  };

  const renderColorGrid = () => {
    const rows = [];
    for (let i = 0; i < colors.length; i += 3) {
      const rowColors = colors.slice(i, i + 3);
      rows.push(
        <View key={i} style={styles.colorRow}>
          {rowColors.map(color => (
            <TouchableOpacity
              key={color.id}
              style={[
                styles.colorOption,
                { backgroundColor: color.color },
                selectedColors.includes(color.id) && styles.selectedColorOption
              ]}
              onPress={() => handleColorSelect(color.id)}
            >
              <Text style={[styles.colorText, { color: color.textColor }]}>
                {color.name}
              </Text>
            </TouchableOpacity>
          ))}
          {/* Add empty placeholders for incomplete rows */}
          {rowColors.length < 3 && 
            Array.from({ length: 3 - rowColors.length }).map((_, index) => (
              <View key={`empty-${index}`} style={styles.emptyColorOption} />
            ))
          }
        </View>
      );
    }
    return rows;
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Colour Trading</Text>
          <View style={styles.balanceContainer}>
            <Ionicons name="wallet" size={16} color={Colors.warning} />
            <Text style={styles.balanceText}>₹{balance.toLocaleString()}</Text>
          </View>
        </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Select Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Plan</Text>
          <View style={styles.planContainer}>
            {plans.map(plan => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planButton,
                  selectedPlan.id === plan.id && styles.selectedPlanButton
                ]}
                onPress={() => setSelectedPlan(plan)}
              >
                <Text style={[
                  styles.planText,
                  selectedPlan.id === plan.id && styles.selectedPlanText
                ]}>
                  {plan.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Select one or more colours.
          </Text>
          <Text style={styles.instructionSubtext}>
            Trade amount = Plan x Selected Colours.
          </Text>
        </View>

        {/* Color Selection Grid */}
        <View style={styles.colorGrid}>
          {renderColorGrid()}
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          style={[
            styles.proceedButton,
            selectedColors.length === 0 && styles.proceedButtonDisabled
          ]}
          disabled={selectedColors.length === 0}
        >
          <Text style={[
            styles.proceedButtonText,
            selectedColors.length === 0 && styles.proceedButtonTextDisabled
          ]}>Proceed to Confirm</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  balanceContainer: {
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  balanceText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100, // Add bottom padding for tab bar
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  planContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  planButton: {
    backgroundColor: Colors.buttonSecondary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  selectedPlanButton: {
    backgroundColor: Colors.primary,
  },
  planText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  selectedPlanText: {
    color: Colors.white,
  },
  instructionContainer: {
    marginTop: Spacing["3xl"],
    alignItems: "center",
    marginBottom: Spacing.base,
  },
  instructionText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text,
    textAlign: "center",
    fontWeight: Typography.fontWeight.medium,
  },
  instructionSubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  colorGrid: {
    marginTop: Spacing["3xl"],
    gap: Spacing.lg,
  },
  colorRow: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  colorOption: {
    flex: 1,
    height: 110,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  selectedColorOption: {
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  colorText: {
    fontSize: Typography.fontSize.base + 1,
    fontWeight: Typography.fontWeight.semibold,
  },
  emptyColorOption: {
    flex: 1,
    height: 110,
  },
  proceedButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 0,
    marginVertical: Spacing.xl,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.base,
    alignItems: "center",
  },
  proceedButtonDisabled: {
    backgroundColor: Colors.buttonDisabled,
  },
  proceedButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  proceedButtonTextDisabled: {
    color: Colors.textSecondary,
  },
});