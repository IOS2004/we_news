import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../components/common";
import { useWallet } from "../../../contexts/WalletContext";
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

interface Bet {
  id: string;
  colorId: string;
  amount: number;
  timestamp: number;
}

interface GameRound {
  id: string;
  startTime: number;
  endTime: number;
  bettingEndTime: number;
  winningColor?: string;
  status: 'waiting' | 'betting' | 'drawing' | 'finished';
}

const plans: Plan[] = [
  { id: '1', amount: 10, label: '₹10' },
  { id: '2', amount: 20, label: '₹20' },
  { id: '3', amount: 50, label: '₹50' },
  { id: '4', amount: 100, label: '₹100' },
];

// 12 colors like in the client screenshots
const colors: Color[] = [
  { id: 'red', name: 'Red', color: '#DC2626', textColor: 'white' },
  { id: 'blue', name: 'Blue', color: '#2563EB', textColor: 'white' },
  { id: 'green', name: 'Green', color: '#16A34A', textColor: 'white' },
  { id: 'yellow', name: 'Yellow', color: '#EAB308', textColor: 'black' },
  { id: 'orange', name: 'Orange', color: '#EA580C', textColor: 'white' },
  { id: 'purple', name: 'Purple', color: '#9333EA', textColor: 'white' },
  { id: 'black', name: 'Black', color: '#374151', textColor: 'white' },
  { id: 'white', name: 'White', color: '#F3F4F6', textColor: 'black' },
  { id: 'brown', name: 'Brown', color: '#92400E', textColor: 'white' },
  { id: 'pink', name: 'Pink', color: '#EC4899', textColor: 'white' },
  { id: 'cyan', name: 'Cyan', color: '#0891B2', textColor: 'white' },
  { id: 'grey', name: 'Grey', color: '#6B7280', textColor: 'white' },
];

const ROUND_DURATION = 3 * 60 * 1000; // 3 minutes
const BETTING_DURATION = 2.5 * 60 * 1000; // 2.5 minutes (betting closes 30 sec before round ends)

export default function ColorTrading() {
  const { balance, updateBalance } = useWallet();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [bets, setBets] = useState<Bet[]>([]);
  const [gameHistory, setGameHistory] = useState<GameRound[]>([]);

  // Initialize game round
  useEffect(() => {
    if (!currentRound) {
      startNewRound();
    }
  }, []);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentRound) {
        const now = Date.now();
        const endTime = currentRound.status === 'betting' ? currentRound.bettingEndTime : currentRound.endTime;
        const remaining = Math.max(0, endTime - now);
        setTimeLeft(remaining);

        if (remaining === 0) {
          if (currentRound.status === 'betting') {
            // End betting phase, start drawing
            setCurrentRound(prev => prev ? { ...prev, status: 'drawing' } : null);
            setTimeout(() => {
              finishRound();
            }, 5000); // 5 second drawing animation
          } else if (currentRound.status === 'drawing') {
            // Round finished, start new round
            setTimeout(() => {
              startNewRound();
            }, 10000); // 10 second delay before new round
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentRound]);

  const startNewRound = () => {
    const now = Date.now();
    const newRound: GameRound = {
      id: Date.now().toString(),
      startTime: now,
      endTime: now + ROUND_DURATION,
      bettingEndTime: now + BETTING_DURATION,
      status: 'betting',
    };
    setCurrentRound(newRound);
    setBets([]);
    setSelectedColors([]);
  };

  const finishRound = () => {
    if (!currentRound) return;

    // Generate winning color (simplified random for demo)
    const winningColor = colors[Math.floor(Math.random() * colors.length)];
    
    const finishedRound: GameRound = {
      ...currentRound,
      winningColor: winningColor.id,
      status: 'finished',
    };

    setCurrentRound(finishedRound);
    setGameHistory(prev => [finishedRound, ...prev.slice(0, 9)]);

    // Calculate winnings
    const winningBets = bets.filter(bet => bet.colorId === winningColor.id);
    const totalWinnings = winningBets.reduce((sum, bet) => sum + (bet.amount * 2), 0);
    
    if (totalWinnings > 0) {
      updateBalance(totalWinnings, 'credit', `Color trading win - ${winningColor.name}`, 'trading');
      Alert.alert(
        "Congratulations! 🎉",
        `You won ₹${totalWinnings}! The winning color was ${winningColor.name}.`,
        [{ text: "Continue", style: "default" }]
      );
    } else if (bets.length > 0) {
      Alert.alert(
        "Better luck next time!",
        `The winning color was ${winningColor.name}.`,
        [{ text: "Try Again", style: "default" }]
      );
    }
  };

  const handleColorSelect = (colorId: string) => {
    if (currentRound?.status !== 'betting') {
      Alert.alert("Betting Closed", "Betting is not available right now.");
      return;
    }
    
    if (selectedColors.includes(colorId)) {
      setSelectedColors(prev => prev.filter(id => id !== colorId));
    } else {
      setSelectedColors(prev => [...prev, colorId]);
    }
  };

  const placeBet = () => {
    if (selectedColors.length === 0) {
      Alert.alert("Select Colors", "Please select at least one color to bet on.");
      return;
    }

    if (currentRound?.status !== 'betting') {
      Alert.alert("Betting Closed", "Betting is not available right now.");
      return;
    }

    const totalAmount = selectedColors.length * selectedPlan.amount;
    if (balance < totalAmount) {
      Alert.alert("Insufficient Balance", "You don't have enough balance to place this bet.");
      return;
    }

    // Place a bet for each selected color
    const newBets: Bet[] = selectedColors.map(colorId => ({
      id: `${Date.now()}_${colorId}`,
      colorId,
      amount: selectedPlan.amount,
      timestamp: Date.now(),
    }));

    setBets(prev => [...prev, ...newBets]);
    updateBalance(totalAmount, 'debit', `Color trading bet on ${selectedColors.length} colors`, 'trading');
    setSelectedColors([]);

    Alert.alert(
      "Bet Placed!",
      `You've placed ₹${selectedPlan.amount} on ${selectedColors.length} color${selectedColors.length > 1 ? 's' : ''}. Total: ₹${totalAmount}`,
      [{ text: "OK", style: "default" }]
    );
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderCurrentBets = () => {
    if (bets.length === 0) return null;

    const betsByColor = bets.reduce((acc, bet) => {
      if (!acc[bet.colorId]) {
        acc[bet.colorId] = { count: 0, amount: 0 };
      }
      acc[bet.colorId].count += 1;
      acc[bet.colorId].amount += bet.amount;
      return acc;
    }, {} as Record<string, { count: number; amount: number }>);

    return (
      <View style={styles.currentBetsSection}>
        <Text style={styles.sectionTitle}>Your Current Bets</Text>
        <View style={styles.betsContainer}>
          {Object.entries(betsByColor).map(([colorId, data]) => {
            const color = colors.find(c => c.id === colorId);
            return (
              <View key={colorId} style={styles.betItem}>
                <View style={[styles.betColorIndicator, { backgroundColor: color?.color }]} />
                <Text style={styles.betText}>
                  {color?.name}: ₹{data.amount} ({data.count} bet{data.count > 1 ? 's' : ''})
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
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
              disabled={currentRound?.status !== 'betting'}
            >
              <Text style={[styles.colorText, { color: color.textColor }]}>
                {color.name}
              </Text>
              {selectedColors.includes(color.id) && (
                <Ionicons name="checkmark-circle" size={20} color={color.textColor} style={styles.checkmark} />
              )}
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
          <Text style={styles.title}>Color Trading</Text>
          <View style={styles.balanceContainer}>
            <Ionicons name="wallet" size={16} color={Colors.warning} />
            <Text style={styles.balanceText}>₹{balance.toLocaleString()}</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Timer and Round Status */}
          {currentRound && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>
                {currentRound.status === 'betting' ? 'Betting ends in:' : 'Round ends in:'}
              </Text>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.roundStatus}>
                Round #{currentRound.id.slice(-4)} - {currentRound.status.toUpperCase()}
              </Text>
            </View>
          )}

          {/* Current Bets */}
          {renderCurrentBets()}

          {/* Select Plan */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Bet Amount</Text>
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
              Select your lucky colors from the grid below
            </Text>
            <Text style={styles.instructionSubtext}>
              Trade amount = Plan x Selected Colors.
            </Text>
            {selectedColors.length > 0 && (
              <Text style={styles.totalAmountText}>
                Total: ₹{selectedColors.length * selectedPlan.amount}
              </Text>
            )}
          </View>

          {/* Color Selection Grid */}
          <View style={styles.colorGrid}>
            {renderColorGrid()}
          </View>

          {/* Selected Colors Summary */}
          {selectedColors.length > 0 && (
            <View style={styles.selectedSummary}>
              <Text style={styles.selectedSummaryText}>
                Selected: {selectedColors.map(id => colors.find(c => c.id === id)?.name).join(', ')} 
                ({selectedColors.length} color{selectedColors.length > 1 ? 's' : ''} selected)
              </Text>
            </View>
          )}

          {/* Bet Button */}
          <TouchableOpacity
            style={[
              styles.proceedButton,
              (selectedColors.length === 0 || currentRound?.status !== 'betting') && styles.proceedButtonDisabled
            ]}
            disabled={selectedColors.length === 0 || currentRound?.status !== 'betting'}
            onPress={placeBet}
          >
            <Text style={[
              styles.proceedButtonText,
              (selectedColors.length === 0 || currentRound?.status !== 'betting') && styles.proceedButtonTextDisabled
            ]}>
              {currentRound?.status !== 'betting' 
                ? 'Betting Closed' 
                : selectedColors.length === 0 
                  ? 'Select Colors to Bet'
                  : `Bet ₹${selectedColors.length * selectedPlan.amount}`
              }
            </Text>
          </TouchableOpacity>

          {/* Game History */}
          {gameHistory.length > 0 && (
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Recent Results</Text>
              <View style={styles.historyContainer}>
                {gameHistory.slice(0, 5).map((round) => {
                  const winningColor = colors.find(c => c.id === round.winningColor);
                  return (
                    <View key={round.id} style={styles.historyItem}>
                      <View style={[styles.historyColorIndicator, { backgroundColor: winningColor?.color }]} />
                      <Text style={styles.historyText}>
                        #{round.id.slice(-4)}: {winningColor?.name}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
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
  // Timer styles
  timerContainer: {
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  timerLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  timerText: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  roundStatus: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  // Current bets styles
  currentBetsSection: {
    margin: Spacing.lg,
    marginTop: 0,
  },
  betsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  betItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  betColorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: Spacing.sm,
  },
  betText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    flex: 1,
  },
  // Additional instruction styles
  totalAmountText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginTop: Spacing.sm,
  },
  // Selected colors summary
  selectedSummary: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  selectedSummaryText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    textAlign: 'center',
  },
  // Checkmark for selected colors
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  // History section styles
  historySection: {
    margin: Spacing.lg,
    marginTop: Spacing.xl,
  },
  historyContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  historyColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: Spacing.sm,
  },
  historyText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});