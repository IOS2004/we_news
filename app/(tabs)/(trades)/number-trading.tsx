import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../../components/common';
import { useWallet } from '../../../contexts/WalletContext';
import { useRounds } from '../../../contexts/RoundsContext';
import { useCart } from '../../../hooks/useCart';
import { tradingApi } from '../../../services/tradingApi';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';
import { checkSufficientBalance, formatCurrency } from '../../../utils/walletUtils';
import { showToast } from '../../../utils/toast';

// Types
interface Plan {
  id: string;
  amount: number;
  label: string;
}

// Constants
const plans: Plan[] = [
  { id: '1', amount: 10, label: '₹10' },
  { id: '2', amount: 20, label: '₹20' },
  { id: '3', amount: 50, label: '₹50' },
  { id: '4', amount: 100, label: '₹100' },
];

// Generate numbers 0-99
const numbers = Array.from({ length: 100 }, (_, i) => i);

export default function NumberTrading() {
  const router = useRouter();
  const { balance, formattedBalance, deductFromWallet, refreshWallet } = useWallet();
  const {
    numberActiveRounds,
    numberUpcomingRounds,
    selectedNumberRoundId,
    setSelectedNumberRoundId,
    isLoadingNumberRounds,
    numberRoundsError,
    fetchNumberRounds,
  } = useRounds();
  
  const { cart, addItem, removeItem, clearCart, validateCartBalance } = useCart();

  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize - fetch rounds on mount
  useEffect(() => {
    fetchNumberRounds();
  }, []);

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchNumberRounds(true),
        refreshWallet()
      ]);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Toggle number selection
  const toggleNumber = (number: number) => {
    if (!selectedNumberRoundId) {
      Alert.alert('Select Round', 'Please select a round first!');
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

  // Add selections to cart
  const addToCart = () => {
    if (!selectedNumberRoundId) {
      Alert.alert('No Round Selected', 'Please select a round first!');
      return;
    }

    if (selectedNumbers.length === 0) {
      Alert.alert('No Numbers Selected', 'Please select at least one number');
      return;
    }

    const totalAmount = selectedNumbers.length * selectedPlan.amount;
    
    const result = addItem({
      roundId: selectedNumberRoundId,
      gameType: 'number',
      options: selectedNumbers.map(String),
      amount: totalAmount,
    });

    if (result.success) {
      Alert.alert('Success', result.message);
      setSelectedNumbers([]);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  // Submit all cart orders
  const submitCartOrders = async () => {
    if (!selectedNumberRoundId) {
      Alert.alert('Error', 'No round selected!');
      return;
    }

    if (cart.totalItems === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty!');
      return;
    }

    // Check sufficient balance
    const balanceCheck = checkSufficientBalance(cart.finalAmount, balance);
    if (!balanceCheck.sufficient) {
      Alert.alert(
        'Insufficient Balance',
        `You need ${formatCurrency(cart.finalAmount)} but have ${formattedBalance}. You need ${formatCurrency(balanceCheck.shortfall)} more.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add Money',
            onPress: () => router.push('/(tabs)/(home)/add-money'),
          },
        ]
      );
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare all trades
      const allSelections = cart.items.flatMap(item => 
        item.options.map(number => ({
          option: number,
          amount: selectedPlan.amount
        }))
      );

      // Deduct amount from wallet first
      const paymentSuccess = await deductFromWallet(
        cart.finalAmount,
        `Number Trading: ${allSelections.length} bet${allSelections.length > 1 ? 's' : ''}`
      );

      if (!paymentSuccess) {
        Alert.alert('Payment Failed', 'Failed to deduct amount from wallet. Please try again.');
        return;
      }

      // Place order
      const result = await tradingApi.placeOrder(selectedNumberRoundId, allSelections);

      if (result) {
        clearCart();
        
        showToast.success({
          title: 'Bets Placed! 🎉',
          message: `Successfully placed ${allSelections.length} bet${allSelections.length > 1 ? 's' : ''}`,
        });
        
        // Refresh rounds
        await fetchNumberRounds(true);
      } else {
        Alert.alert('Error', 'Failed to place bets. Please contact support if amount was deducted.');
      }
    } catch (error: any) {
      console.error('Failed to submit orders:', error);
      Alert.alert('Error', error.message || 'Failed to place orders. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total bet amount for selected numbers
  const getTotalBetAmount = () => {
    return selectedNumbers.length * selectedPlan.amount;
  };

  // Format time remaining
  const formatTimeRemaining = (timestamp: any): string => {
    if (!timestamp) return '--:--';
    
    const endTime = timestamp._seconds ? timestamp._seconds * 1000 : new Date(timestamp).getTime();
    const now = Date.now();
    const diff = endTime - now;
    
    if (diff <= 0) return 'Closed';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>🔢 Number Trading</Text>
            <Text style={styles.headerSubtitle}>Select numbers • Place bets • Win 9.5x!</Text>
          </View>
          <TouchableOpacity
            onPress={() => fetchNumberRounds(true)}
            disabled={isLoadingNumberRounds}
            style={styles.refreshButton}
          >
            <Ionicons 
              name="refresh" 
              size={20} 
              color={Colors.textOnPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Wallet Balance */}
        <View style={styles.walletCard}>
          <View style={styles.walletContent}>
            <View>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={styles.walletAmount}>{formattedBalance}</Text>
            </View>
            <Text style={styles.walletIcon}>💰</Text>
          </View>
        </View>

        {/* Important Info Banner */}
        {!selectedNumberRoundId && (
          <View style={styles.infoBanner}>
            <Ionicons name="alert-circle" size={24} color={Colors.warning} />
            <View style={styles.infoBannerText}>
              <Text style={styles.infoBannerTitle}>Select a Round to Start Trading</Text>
              <Text style={styles.infoBannerSubtitle}>
                Choose an active round below
              </Text>
            </View>
          </View>
        )}

        {/* Loading State */}
        {isLoadingNumberRounds && numberActiveRounds.length === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading rounds...</Text>
          </View>
        )}

        {/* Error State */}
        {numberRoundsError && !isLoadingNumberRounds && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
            <Text style={styles.errorText}>{numberRoundsError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchNumberRounds(true)}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Active Rounds */}
        {!isLoadingNumberRounds && !numberRoundsError && numberActiveRounds.length > 0 && (
          <View style={styles.roundsSection}>
            <Text style={styles.sectionTitle}>🟢 Active Rounds</Text>
            {numberActiveRounds.map((round) => (
              <TouchableOpacity
                key={round.id}
                style={[
                  styles.roundCard,
                  selectedNumberRoundId === round.id && styles.selectedRoundCard
                ]}
                onPress={() => {
                  setSelectedNumberRoundId(round.id);
                  Alert.alert('Round Selected', 'Round selected for trading');
                }}
              >
                <View style={styles.roundHeader}>
                  <Text style={styles.roundNumber}>Round #{round.roundNumber}</Text>
                  {selectedNumberRoundId === round.id && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>SELECTED</Text>
                    </View>
                  )}
                </View>
                <View style={styles.roundDetails}>
                  <View style={styles.roundDetailItem}>
                    <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.roundDetailText}>
                      {formatTimeRemaining(round.resultDeclarationTime)}
                    </Text>
                  </View>
                  <View style={styles.roundDetailItem}>
                    <Ionicons name="people-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.roundDetailText}>{round.totalTrades || 0} trades</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Upcoming Rounds */}
        {!isLoadingNumberRounds && numberUpcomingRounds.length > 0 && (
          <View style={styles.roundsSection}>
            <Text style={styles.sectionTitle}>⏳ Upcoming Rounds</Text>
            {numberUpcomingRounds.slice(0, 3).map((round) => (
              <View key={round.id} style={styles.upcomingRoundCard}>
                <Text style={styles.upcomingRoundNumber}>Round #{round.roundNumber}</Text>
                <Text style={styles.upcomingRoundText}>Upcoming</Text>
              </View>
            ))}
          </View>
        )}

        {/* Number Grid */}
        <View style={styles.numberSection}>
          <Text style={styles.sectionTitle}>Select Numbers (0-99)</Text>
          <View style={styles.numberGrid}>
            {numbers.map(number => {
              const isSelected = selectedNumbers.includes(number);
              
              return (
                <TouchableOpacity
                  key={number}
                  onPress={() => toggleNumber(number)}
                  disabled={!selectedNumberRoundId}
                  style={[
                    styles.numberButton,
                    isSelected && styles.selectedNumberButton,
                    !selectedNumberRoundId && styles.disabledNumberButton
                  ]}
                >
                  <Text style={[
                    styles.numberButtonText,
                    isSelected && styles.selectedNumberButtonText
                  ]}>
                    {number}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bet Amount Selector */}
        <View style={styles.planSection}>
          <Text style={styles.sectionTitle}>Select Bet Amount</Text>
          <View style={styles.planGrid}>
            {plans.map(plan => (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlan(plan)}
                style={[
                  styles.planButton,
                  selectedPlan.id === plan.id && styles.selectedPlanButton
                ]}
              >
                <Text style={[
                  styles.planButtonText,
                  selectedPlan.id === plan.id && styles.selectedPlanButtonText
                ]}>
                  {plan.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add to Cart Button */}
        {selectedNumbers.length > 0 && (
          <View style={styles.cartPreview}>
            {cart.totalItems > 0 && (
              <View style={styles.cartInfo}>
                <Text style={styles.cartInfoText}>
                  📦 {cart.totalItems} item{cart.totalItems > 1 ? 's' : ''} in cart (₹{cart.finalAmount})
                </Text>
              </View>
            )}
            <View style={styles.betSummary}>
              <View>
                <Text style={styles.betSummaryLabel}>Total Bet</Text>
                <Text style={styles.betSummaryAmount}>₹{getTotalBetAmount()}</Text>
              </View>
              <View>
                <Text style={styles.betSummaryLabel}>Numbers</Text>
                <Text style={styles.betSummaryAmount}>{selectedNumbers.length}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={addToCart}
              disabled={!selectedNumberRoundId || selectedNumbers.length === 0}
              style={[
                styles.addToCartButton,
                (!selectedNumberRoundId || selectedNumbers.length === 0) && styles.disabledButton
              ]}
            >
              <Ionicons name="cart" size={20} color={Colors.textOnPrimary} />
              <Text style={styles.addToCartButtonText}>
                {selectedNumberRoundId ? 'Add to Cart' : 'Select Round First'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cart Summary & Submit */}
        {cart.totalItems > 0 && (
          <View style={styles.cartSummary}>
            <View style={styles.cartSummaryHeader}>
              <Text style={styles.cartSummaryTitle}>Cart ({cart.totalItems})</Text>
              <TouchableOpacity onPress={clearCart}>
                <Text style={styles.clearCartText}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            {cart.items.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.cartItemHeader}>
                  <Text style={styles.cartItemTitle}>
                    {item.options.join(', ')}
                  </Text>
                  <Text style={styles.cartItemAmount}>₹{item.amount}</Text>
                </View>
              </View>
            ))}

            <View style={styles.cartTotal}>
              <Text style={styles.cartTotalLabel}>Total</Text>
              <Text style={styles.cartTotalAmount}>₹{cart.finalAmount}</Text>
            </View>

            <TouchableOpacity
              onPress={submitCartOrders}
              disabled={isSubmitting}
              style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.textOnPrimary} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.textOnPrimary} />
                  <Text style={styles.submitButtonText}>Place All Bets</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollView: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, paddingTop: Spacing.xl },
  headerTitle: { fontSize: Typography.fontSize['2xl'], fontWeight: Typography.fontWeight.bold, color: Colors.text },
  headerSubtitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  refreshButton: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: BorderRadius.full },
  walletCard: { backgroundColor: Colors.success, margin: Spacing.lg, padding: Spacing.lg, borderRadius: BorderRadius.lg },
  walletContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletLabel: { fontSize: Typography.fontSize.sm, color: Colors.textOnPrimary, opacity: 0.9 },
  walletAmount: { fontSize: Typography.fontSize['3xl'], fontWeight: Typography.fontWeight.bold, color: Colors.textOnPrimary },
  walletIcon: { fontSize: 48, opacity: 0.8 },
  infoBanner: { flexDirection: 'row', backgroundColor: '#FEF3C7', margin: Spacing.lg, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 2, borderColor: '#F59E0B' },
  infoBannerText: { flex: 1, marginLeft: Spacing.md },
  infoBannerTitle: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.semibold, color: '#92400E', marginBottom: Spacing.xs },
  infoBannerSubtitle: { fontSize: Typography.fontSize.sm, color: '#92400E' },
  loadingContainer: { padding: Spacing['2xl'], alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: Spacing.md, fontSize: Typography.fontSize.base, color: Colors.textSecondary },
  errorContainer: { padding: Spacing['2xl'], alignItems: 'center', justifyContent: 'center' },
  errorText: { marginTop: Spacing.md, marginBottom: Spacing.lg, fontSize: Typography.fontSize.base, color: Colors.error, textAlign: 'center' },
  retryButton: { backgroundColor: Colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.md },
  retryButtonText: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.semibold, color: Colors.textOnPrimary },
  roundsSection: { margin: Spacing.lg },
  sectionTitle: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.semibold, color: Colors.text, marginBottom: Spacing.md },
  roundCard: { backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.md, borderWidth: 2, borderColor: 'transparent' },
  selectedRoundCard: { borderColor: Colors.primary, backgroundColor: '#EFF6FF' },
  roundHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  roundNumber: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.semibold, color: Colors.text },
  selectedBadge: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm },
  selectedBadgeText: { fontSize: Typography.fontSize.xs, fontWeight: Typography.fontWeight.bold, color: Colors.textOnPrimary },
  roundDetails: { flexDirection: 'row', gap: Spacing.lg },
  roundDetailItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  roundDetailText: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  upcomingRoundCard: { backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.sm, opacity: 0.7 },
  upcomingRoundNumber: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.semibold, color: Colors.text },
  upcomingRoundText: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  numberSection: { margin: Spacing.lg },
  numberGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  numberButton: { width: '18%', aspectRatio: 1, backgroundColor: Colors.buttonSecondary, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', position: 'relative', borderWidth: 1, borderColor: Colors.border },
  selectedNumberButton: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  disabledNumberButton: { opacity: 0.5 },
  numberButtonText: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold, color: Colors.text },
  selectedNumberButtonText: { color: Colors.textOnPrimary, fontWeight: Typography.fontWeight.bold },
  checkmark: { position: 'absolute', top: -6, right: -6, backgroundColor: '#FBBF24', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  checkmarkText: { fontSize: 10, fontWeight: Typography.fontWeight.bold, color: '#000' },
  planSection: { margin: Spacing.lg },
  planGrid: { flexDirection: 'row', gap: Spacing.md },
  planButton: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.surface, alignItems: 'center' },
  selectedPlanButton: { backgroundColor: Colors.success },
  planButtonText: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.semibold, color: Colors.text },
  selectedPlanButtonText: { color: Colors.textOnPrimary },
  cartPreview: { backgroundColor: '#FEF3C7', margin: Spacing.lg, padding: Spacing.lg, borderRadius: BorderRadius.lg },
  cartInfo: { backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: Spacing.sm, borderRadius: BorderRadius.md, marginBottom: Spacing.md, alignItems: 'center' },
  cartInfoText: { fontSize: Typography.fontSize.sm, color: '#92400E' },
  betSummary: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  betSummaryLabel: { fontSize: Typography.fontSize.sm, color: '#92400E', opacity: 0.9 },
  betSummaryAmount: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: '#92400E' },
  addToCartButton: { backgroundColor: Colors.warning, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, borderRadius: BorderRadius.lg, gap: Spacing.md },
  addToCartButtonText: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.bold, color: Colors.textOnPrimary },
  disabledButton: { opacity: 0.5 },
  cartSummary: { backgroundColor: Colors.surface, margin: Spacing.lg, padding: Spacing.lg, borderRadius: BorderRadius.lg },
  cartSummaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  cartSummaryTitle: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.semibold, color: Colors.text },
  clearCartText: { fontSize: Typography.fontSize.sm, color: Colors.error, fontWeight: Typography.fontWeight.medium },
  cartItem: { backgroundColor: Colors.background, padding: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.md },
  cartItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cartItemTitle: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.medium, color: Colors.text, flex: 1 },
  cartItemAmount: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.bold, color: Colors.primary },
  cartTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border, marginTop: Spacing.md, marginBottom: Spacing.lg },
  cartTotalLabel: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.semibold, color: Colors.text },
  cartTotalAmount: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: Colors.primary },
  submitButton: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, borderRadius: BorderRadius.lg, gap: Spacing.md },
  submitButtonText: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.bold, color: Colors.textOnPrimary },
  bottomSpacing: { height: Spacing['6xl'] },
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
});