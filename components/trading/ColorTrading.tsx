import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Colors, Typography, Spacing } from "../../constants/theme";

interface ColorOption {
  name: string;
  color: string;
  multiplier: number;
}

interface ColorTradingProps {
  onTrade: (color: ColorOption, amount: number) => void;
  disabled?: boolean;
  balance: number;
}

const colorOptions: ColorOption[] = [
  { name: "Red", color: "#EF4444", multiplier: 2 },
  { name: "Green", color: "#22C55E", multiplier: 2 },
  { name: "Blue", color: "#3B82F6", multiplier: 2 },
  { name: "Purple", color: "#8B5CF6", multiplier: 3 },
  { name: "Gold", color: "#F59E0B", multiplier: 5 },
];

const ColorTrading: React.FC<ColorTradingProps> = ({
  onTrade,
  disabled = false,
  balance,
}) => {
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [betAmount, setBetAmount] = useState<number>(10);

  const handleTrade = () => {
    if (selectedColor && betAmount > 0 && betAmount <= balance) {
      onTrade(selectedColor, betAmount);
      setSelectedColor(null);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Color</Text>
      
      <View style={styles.colorGrid}>
        {colorOptions.map((option) => (
          <TouchableOpacity
            key={option.name}
            style={[
              styles.colorOption,
              { backgroundColor: option.color },
              selectedColor?.name === option.name && styles.selectedColor,
            ]}
            onPress={() => setSelectedColor(option)}
            disabled={disabled}
          >
            <Text style={styles.colorName}>{option.name}</Text>
            <Text style={styles.multiplier}>{option.multiplier}x</Text>
          </TouchableOpacity>
        ))}
      </View>

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
          (!selectedColor || disabled) && styles.tradeButtonDisabled,
        ]}
        onPress={handleTrade}
        disabled={!selectedColor || disabled}
      >
        <Text style={styles.tradeButtonText}>Place Trade</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },
  colorOption: {
    width: "48%",
    height: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: Colors.text,
  },
  colorName: {
    color: "white",
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  multiplier: {
    color: "white",
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.primary,
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

export default ColorTrading;