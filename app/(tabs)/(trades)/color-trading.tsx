import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.title}>ColourTrading</Text>
        <View style={styles.balanceContainer}>
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
          <Text style={styles.proceedButtonText}>Proceed to Confirm</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  balanceContainer: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  balanceText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100, // Add bottom padding for tab bar
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
  },
  planContainer: {
    flexDirection: "row",
    gap: 12,
  },
  planButton: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  selectedPlanButton: {
    backgroundColor: "#3B82F6",
  },
  planText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
  selectedPlanText: {
    color: "white",
  },
  instructionContainer: {
    marginTop: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    fontWeight: "500",
  },
  instructionSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
  },
  colorGrid: {
    marginTop: 30,
    gap: 20,
  },
  colorRow: {
    flexDirection: "row",
    gap: 20,
  },
  colorOption: {
    flex: 1,
    height: 110,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  selectedColorOption: {
    borderWidth: 4,
    borderColor: "#3B82F6",
  },
  colorText: {
    fontSize: 17,
    fontWeight: "600",
  },
  emptyColorOption: {
    flex: 1,
    height: 110,
  },
  proceedButton: {
    backgroundColor: "#E5E7EB",
    marginHorizontal: 0,
    marginVertical: 24,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  proceedButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  proceedButtonText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "600",
  },
});