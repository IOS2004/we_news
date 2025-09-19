import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
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

interface Bet {
  id: string;
  number: number;
  amount: number;
  timestamp: number;
}

interface GameRound {
  id: string;
  startTime: number;
  endTime: number;
  bettingEndTime: number;
  winningNumber?: number;
  status: 'waiting' | 'betting' | 'drawing' | 'finished';
}

const plans: Plan[] = [
  { id: '1', amount: 10, label: '₹10' },
  { id: '2', amount: 20, label: '₹20' },
  { id: '3', amount: 50, label: '₹50' },
  { id: '4', amount: 100, label: '₹100' },
];

const ROUND_DURATION = 180000; // 3 minutes
const BETTING_DURATION = 150000; // 2.5 minutes

export default function NumberTrading() {
  const { balance, updateBalance } = useWallet();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [bets, setBets] = useState<Bet[]>([]);
  const [gameHistory, setGameHistory] = useState<GameRound[]>([]);

  // Generate numbers 0-100 like in client screenshots
  const numbers = Array.from({ length: 101 }, (_, i) => i);

  // Initialize game round
  useEffect(() => {
    if (!currentRound) {
      startNewRound();
    }
  }, []);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = Math.max(0, prev - 1000);
        
        if (newTime === 0 && currentRound) {
          if (currentRound.status === 'betting') {
            // Switch to drawing phase
            setCurrentRound(prev => prev ? { ...prev, status: 'drawing' } : null);
            setTimeLeft(30000); // 30 seconds for result
          } else if (currentRound.status === 'drawing') {
            finishRound();
          }
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRound]);

  const startNewRound = () => {
    const now = Date.now();
    const newRound: GameRound = {
      id: `round_${now}`,
      startTime: now,
      endTime: now + ROUND_DURATION,
      bettingEndTime: now + BETTING_DURATION,
      status: 'betting',
    };
    setCurrentRound(newRound);
    setBets([]);
    setSelectedNumbers([]);
    setTimeLeft(BETTING_DURATION);
  };

  const finishRound = () => {
    if (!currentRound) return;

    // Generate random winning number from 0-100
    const winningNumber = Math.floor(Math.random() * 101);

    const finishedRound: GameRound = {
      ...currentRound,
      winningNumber,
      status: 'finished',
    };

    setCurrentRound(finishedRound);
    setGameHistory(prev => [finishedRound, ...prev.slice(0, 9)]);

    // Calculate winnings - simple 2x payout
    const winningBets = bets.filter(bet => bet.number === winningNumber);
    const totalWinnings = winningBets.reduce((sum, bet) => sum + (bet.amount * 2), 0);
    
    if (totalWinnings > 0) {
      updateBalance(totalWinnings, 'credit', `Number trading win - ${winningNumber}`, 'trading');
      Alert.alert(
        "Congratulations! 🎉",
        `You won ₹${totalWinnings}! The winning number was ${winningNumber}.`,
        [{ text: "Continue", style: "default" }]
      );
    } else if (bets.length > 0) {
      Alert.alert(
        "Better luck next time!",
        `The winning number was ${winningNumber}.`,
        [{ text: "Try Again", style: "default" }]
      );
    }

    // Start new round after delay
    setTimeout(() => {
      startNewRound();
    }, 3000);
  };

  const handleNumberSelect = (number: number) => {
    if (currentRound?.status !== 'betting') {
      Alert.alert("Betting Closed", "Betting is not available right now.");
      return;
    }

    setSelectedNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      } else {
        return [...prev, number];
      }
    });
  };

  const placeBet = () => {
    if (selectedNumbers.length === 0) {
      Alert.alert("Select Numbers", "Please select at least one number to bet on.");
      return;
    }

    if (currentRound?.status !== 'betting') {
      Alert.alert("Betting Closed", "Betting is not available right now.");
      return;
    }

    const totalAmount = selectedNumbers.length * selectedPlan.amount;
    if (balance < totalAmount) {
      Alert.alert("Insufficient Balance", "You don't have enough balance to place this bet.");
      return;
    }

    // Place a bet for each selected number
    const newBets: Bet[] = selectedNumbers.map(number => ({
      id: `${Date.now()}_${number}`,
      number,
      amount: selectedPlan.amount,
      timestamp: Date.now(),
    }));

    setBets(prev => [...prev, ...newBets]);
    updateBalance(totalAmount, 'debit', `Number trading bet on ${selectedNumbers.length} numbers`, 'trading');
    setSelectedNumbers([]);

    Alert.alert(
      "Bet Placed!",
      `You bet ₹${totalAmount} on ${selectedNumbers.length} number(s). Good luck!`,
      [{ text: "OK", style: "default" }]
    );
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    if (!currentRound) return "Starting...";
    switch (currentRound.status) {
      case 'betting': return "Betting Open";
      case 'drawing': return "Drawing Number";
      case 'finished': return "Round Complete";
      default: return "Loading";
    }
  };

  const getTotalBetAmount = () => {
    return bets.reduce((sum, bet) => sum + bet.amount, 0);
  };

  const renderGameHistory = () => {
    if (gameHistory.length === 0) return null;

    return (
      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Recent Results</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.historyRow}>
            {gameHistory.map((round, index) => (
              <View key={round.id} style={styles.historyItem}>
                <Text style={styles.historyRound}>#{index + 1}</Text>
                {round.winningNumber !== undefined && (
                  <Text style={styles.historyNumber}>{round.winningNumber}</Text>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderCurrentBets = () => {
    if (bets.length === 0) return null;

    return (
      <View style={styles.currentBetsSection}>
        <Text style={styles.sectionTitle}>Your Bets This Round</Text>
        {bets.map(bet => (
          <View key={bet.id} style={styles.betItem}>
            <View style={styles.betInfo}>
              <Text style={styles.betNumbers}>Number: {bet.number}</Text>
              <Text style={styles.betAmount}>Bet: ₹{bet.amount}</Text>
            </View>
            <Text style={styles.betPotentialWin}>Win: ₹{bet.amount * 2}</Text>
          </View>
        ))}
        <View style={styles.totalBet}>
          <Text style={styles.totalBetText}>
            Total Bet: ₹{getTotalBetAmount()}
          </Text>
        </View>
      </View>
    );
  };

  const renderNumberGrid = () => {
    const rows = [];
    const numbersPerRow = 10;
    
    for (let i = 0; i < numbers.length; i += numbersPerRow) {
      const rowNumbers = numbers.slice(i, i + numbersPerRow);
      rows.push(
        <View key={i} style={styles.numberRow}>
          {rowNumbers.map(number => (
            <TouchableOpacity
              key={number}
              style={[
                styles.numberButton,
                selectedNumbers.includes(number) && styles.selectedNumberButton,
                currentRound?.status !== 'betting' && styles.disabledNumberButton
              ]}
              onPress={() => handleNumberSelect(number)}
              disabled={currentRound?.status !== 'betting'}
            >
              <Text style={[
                styles.numberText,
                selectedNumbers.includes(number) && styles.selectedNumberText,
                currentRound?.status !== 'betting' && styles.disabledNumberText
              ]}>
                {number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Numbers (0-100)</Text>
        <Text style={styles.instructionText}>
          Tap numbers to select. Betting amount = ₹{selectedPlan.amount} × {selectedNumbers.length} numbers = ₹{selectedNumbers.length * selectedPlan.amount}
        </Text>
        <View style={styles.numberContainer}>
          {rows}
        </View>
        {selectedNumbers.length > 0 && (
          <View style={styles.selectionSummary}>
            <Text style={styles.selectionText}>
              Selected: {selectedNumbers.join(', ')} ({selectedNumbers.length} numbers)
            </Text>
            <Text style={styles.totalAmountText}>
              Total Bet: ₹{selectedNumbers.length * selectedPlan.amount}
            </Text>
          </View>
        )}
      </View>
    );
  };

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
          {/* Game Status and Timer */}
          <View style={styles.gameStatus}>
            <View style={styles.statusRow}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
              <Text style={styles.timerText}>
                {timeLeft > 0 ? formatTime(timeLeft) : "00:00"}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: currentRound ? 
                      `${((Date.now() - currentRound.startTime) / ROUND_DURATION) * 100}%` : 
                      '0%' 
                  }
                ]} 
              />
            </View>
          </View>

          {/* Game History */}
          {renderGameHistory()}

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

          {/* Number Selection */}
          {renderNumberGrid()}

          {/* Current Bets */}
          {renderCurrentBets()}

          {/* Place Bet Button */}
          <TouchableOpacity
            style={[
              styles.proceedButton,
              (selectedNumbers.length === 0 || currentRound?.status !== 'betting') && styles.proceedButtonDisabled
            ]}
            disabled={selectedNumbers.length === 0 || currentRound?.status !== 'betting'}
            onPress={placeBet}
          >
            <Text style={[
              styles.proceedButtonText,
              (selectedNumbers.length === 0 || currentRound?.status !== 'betting') && styles.proceedButtonTextDisabled
            ]}>
              {selectedNumbers.length > 0 ? 
                `Bet ₹${selectedNumbers.length * selectedPlan.amount}` : 
                'Select Numbers'}
            </Text>
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
  
  // Game Status Styles
  gameStatus: {
    backgroundColor: Colors.white,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  
  // History Styles
  historySection: {
    margin: 16,
    marginTop: 0,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  historyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  historyItem: {
    backgroundColor: Colors.surface,
    padding: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  historyRound: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  historyNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  historyJodi: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
  },
  
  // Bet Type Styles
  betTypeContainer: {
    gap: 12,
  },
  betTypeButton: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBetTypeButton: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  betTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  selectedBetTypeText: {
    color: Colors.primary,
  },
  betTypeOdds: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.success,
    marginTop: 4,
  },
  betTypeDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  
  // Number Grid Styles
  gridTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  gridSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  numberContainer: {
    gap: Spacing.sm,
    marginBottom: 16,
  },
  disabledNumberButton: {
    opacity: 0.5,
  },
  disabledNumberText: {
    color: Colors.textLight,
  },
  selectionStatus: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Current Bets Styles
  currentBetsSection: {
    margin: 16,
    marginTop: 0,
  },
  betItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  betInfo: {
    flex: 1,
  },
  betTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  betNumbers: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  betAmount: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  betPotentialWin: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
  },
  
  // Selection Summary Styles
  selectionSummary: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  selectionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  totalAmountText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    textAlign: 'center',
  },
  
  // Missing styles for totalBet
  totalBet: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  totalBetText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
});