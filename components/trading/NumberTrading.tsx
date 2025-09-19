import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Colors, Typography, Spacing } from "../../constants/theme";

interface NumberOption {
  number: number;
  multiplier: number;
}

interface NumberTradingProps {
  onTrade: (numbers: number[], amount: number) => void;
  disabled?: boolean;
  balance: number;
}

const numberOptions: NumberOption[] = [
  { number: 1, multiplier: 2 },
  { number: 2, multiplier: 2 },
  { number: 3, multiplier: 2 },
  { number: 4, multiplier: 3 },
  { number: 5, multiplier: 3 },
  { number: 6, multiplier: 5 },
  { number: 7, multiplier: 7 }, // Lucky 7
  { number: 8, multiplier: 3 },
  { number: 9, multiplier: 2 },
];

const NumberTrading: React.FC<NumberTradingProps> = ({
  onTrade,
  disabled = false,
  balance,
}) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState<number>(10);

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(prev => prev.filter(n => n !== number));
    } else if (selectedNumbers.length < 3) {
      setSelectedNumbers(prev => [...prev, number]);
    } else {
      Alert.alert("Limit Reached", "You can select up to 3 numbers");
    }
  };

  const handleTrade = () => {
    if (selectedNumbers.length > 0 && betAmount > 0 && betAmount <= balance) {
      onTrade(selectedNumbers, betAmount);
      setSelectedNumbers([]);
    }
  };

  const increaseBet = () => {
    if (betAmount < balance) {
      setBetAmount(prev => Math.min(prev + 10, balance));
    }
  };

  const decreaseBet = () => {
    setBetAmount(prev => Math.max(prev - 10, 10));
  };

  const clearSelection = () => {
    setSelectedNumbers([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Lucky Numbers</Text>
        <Text style={styles.selectionInfo}>
          {selectedNumbers.length}/3 selected
        </Text>
      </View>
      
      <View style={styles.numberGrid}>
        {numberOptions.map((option) => (
          <TouchableOpacity
            key={option.number}
            style={[
              styles.numberOption,
              selectedNumbers.includes(option.number) && styles.selectedNumber,
              option.number === 7 && styles.luckyNumber,
            ]}
            onPress={() => handleNumberSelect(option.number)}
            disabled={disabled}
          >
            <Text style={[
              styles.numberText,
              selectedNumbers.includes(option.number) && styles.selectedNumberText,
            ]}>
              {option.number}
            </Text>
            <Text style={[
              styles.multiplierText,
              selectedNumbers.includes(option.number) && styles.selectedMultiplierText,
            ]}>
              {option.multiplier}x
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {selectedNumbers.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearSelection}>
          <Text style={styles.clearButtonText}>Clear Selection</Text>
        </TouchableOpacity>
      )}

      <View style={styles.betSection}>
        <Text style={styles.betTitle}>Bet Amount</Text>
        <View style={styles.betControls}>
          <TouchableOpacity style={styles.betButton} onPress={decreaseBet}>
            <Text style={styles.betButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.betAmount}>{betAmount}</Text>
          <TouchableOpacity style={styles.betButton} onPress={increaseBet}>
            <Text style={styles.betButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.tradeButton,
          (selectedNumbers.length === 0 || disabled) && styles.tradeButtonDisabled,
        ]}
        onPress={handleTrade}
        disabled={selectedNumbers.length === 0 || disabled}
      >
        <Text style={styles.tradeButtonText}>Roll the Dice</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  selectionInfo: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  numberGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  numberOption: {
    width: "30%",
    height: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  selectedNumber: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  luckyNumber: {
    borderColor: Colors.warning,
    borderWidth: 3,
  },
  numberText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  selectedNumberText: {
    color: "white",
  },
  multiplierText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  selectedMultiplierText: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  clearButton: {
    backgroundColor: Colors.error,
    borderRadius: 8,
    padding: Spacing.sm,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  clearButtonText: {
    color: "white",
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  betSection: {
    marginBottom: Spacing.xl,
  },
  betTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  betControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.lg,
  },
  betButton: {
    backgroundColor: Colors.secondary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  betButtonText: {
    color: "white",
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  betAmount: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    minWidth: 80,
    textAlign: "center",
  },
  tradeButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: "center",
  },
  tradeButtonDisabled: {
    backgroundColor: Colors.borderDark,
  },
  tradeButtonText: {
    color: "white",
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
});

export default NumberTrading;