import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../components/common";
import { Colors, Typography, Spacing, BorderRadius } from "../../../constants/theme";

interface Plan {
  id: string;
  amount: number;
  label: string;
}

const plans: Plan[] = [
  { id: '1', amount: 10, label: '₹10' },
  { id: '2', amount: 20, label: '₹20' },
  { id: '3', amount: 50, label: '₹50' },
  { id: '4', amount: 100, label: '₹100' },
];

export default function NumberTrading() {
  const [balance] = useState(1200);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Generate numbers 0-100
  const numbers = Array.from({ length: 101 }, (_, i) => i);

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(prev => prev.filter(n => n !== number));
    } else {
      setSelectedNumbers(prev => [...prev, number]);
    }
  };

  const handleProceedToConfirm = () => {
    if (selectedNumbers.length === 0) {
      Alert.alert("Select Numbers", "Please select at least one number to proceed");
      return;
    }
    setShowConfirmation(true);
  };

  const renderNumberGrid = () => {
    const rows = [];
    for (let i = 0; i < numbers.length; i += 5) {
      const rowNumbers = numbers.slice(i, i + 5);
      rows.push(
        <View key={i} style={styles.numberRow}>
          {rowNumbers.map(number => (
            <TouchableOpacity
              key={number}
              style={[
                styles.numberButton,
                selectedNumbers.includes(number) && styles.selectedNumberButton
              ]}
              onPress={() => handleNumberSelect(number)}
            >
              <Text style={[
                styles.numberText,
                selectedNumbers.includes(number) && styles.selectedNumberText
              ]}>
                {number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return rows;
  };

  const renderConfirmationModal = () => (
    <Modal
      visible={showConfirmation}
      transparent
      animationType="slide"
      onRequestClose={() => setShowConfirmation(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalIndicator} />
          </View>
          
          <Text style={styles.modalTitle}>Trade Confirmation</Text>
          
          {/* Chosen Plan */}
          <View style={styles.confirmationSection}>
            <Text style={styles.confirmationLabel}>CHOSEN PLAN</Text>
            <View style={styles.confirmationCard}>
              <View style={styles.confirmationIcon}>
                <Ionicons name="card" size={24} color="white" />
              </View>
              <View>
                <Text style={styles.confirmationText}>Plan 1</Text>
                <Text style={styles.confirmationValue}>$1000</Text>
              </View>
            </View>
          </View>

          {/* Selected Numbers */}
          <View style={styles.confirmationSection}>
            <Text style={styles.confirmationLabel}>SELECTED NUMBERS</Text>
            <View style={styles.confirmationCard}>
              <View style={styles.confirmationIcon}>
                <Text style={styles.confirmationIconText}>#</Text>
              </View>
              <View>
                <Text style={styles.confirmationText}>{selectedNumbers.join(', ')}</Text>
                <Text style={styles.confirmationSubtext}>{selectedNumbers.length} Numbers</Text>
              </View>
            </View>
          </View>

          {/* Total Amount */}
          <View style={styles.confirmationSection}>
            <Text style={styles.confirmationLabel}>TOTAL AMOUNT</Text>
            <View style={styles.confirmationCard}>
              <View style={styles.confirmationIcon}>
                <Ionicons name="cash" size={24} color="white" />
              </View>
              <Text style={styles.confirmationValue}>$1000</Text>
            </View>
          </View>

          {/* Warning */}
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>Trades cannot be cancelled once placed.</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowConfirmation(false)}
            >
              <Ionicons name="close" size={20} color="white" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                setShowConfirmation(false);
                Alert.alert("Trade Placed", "Your trade has been placed successfully!");
                setSelectedNumbers([]);
              }}
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Number Trading</Text>
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

          {/* Number Selection */}
          <View style={styles.section}>
            <Text style={styles.instructionText}>
              Select your lucky numbers from 0 to 100
            </Text>
            <View style={styles.numberGrid}>
              {renderNumberGrid()}
            </View>
          </View>

          {/* Summary */}
          {selectedNumbers.length > 0 && (
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Selected Plan</Text>
                <Text style={styles.summaryValue}>{selectedPlan.label}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Selected Numbers</Text>
                <Text style={styles.summaryValue}>{selectedNumbers.length}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Trade Amount</Text>
                <Text style={styles.summaryValueTotal}>₹{selectedPlan.amount * selectedNumbers.length}</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Button */}
        <TouchableOpacity
          style={[
            styles.proceedButton,
            selectedNumbers.length === 0 && styles.proceedButtonDisabled
          ]}
          onPress={handleProceedToConfirm}
          disabled={selectedNumbers.length === 0}
        >
          <Text style={[
            styles.proceedButtonText,
            selectedNumbers.length === 0 && styles.proceedButtonTextDisabled
          ]}>Proceed to Confirm</Text>
        </TouchableOpacity>

        {renderConfirmationModal()}
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
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
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
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.base,
  },
  planContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  planButton: {
    backgroundColor: Colors.buttonSecondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  selectedPlanButton: {
    backgroundColor: Colors.primary,
  },
  planText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  selectedPlanText: {
    color: Colors.white,
  },
  instructionText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.base,
  },
  numberGrid: {
    gap: Spacing.sm,
  },
  numberRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  numberButton: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.buttonSecondary,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedNumberButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  numberText: {
    color: Colors.text,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  selectedNumberText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semibold,
  },
  summarySection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
  },
  summaryValue: {
    color: Colors.text,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  summaryValueTotal: {
    color: Colors.success,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  proceedButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#2A2A2A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: "80%",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#4A4A4A",
    borderRadius: 2,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    marginBottom: 32,
  },
  confirmationSection: {
    marginBottom: 24,
  },
  confirmationLabel: {
    color: "#AAAAAA",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  confirmationCard: {
    backgroundColor: "#3A3A3A",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  confirmationIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#4A4A4A",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmationIconText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  confirmationText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  confirmationValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  confirmationSubtext: {
    color: "#AAAAAA",
    fontSize: 14,
    marginTop: 2,
  },
  warningContainer: {
    backgroundColor: "#4A3319",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  warningText: {
    color: "#F59E0B",
    fontSize: 14,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#4A4A4A",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});