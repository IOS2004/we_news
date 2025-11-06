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
import { ScreenWrapper } from '../../../components/common';
import { useWallet } from '../../../contexts/WalletContext';
import { useRounds } from '../../../contexts/RoundsContext';
import { useCart } from '../../../hooks/useCart';
import { tradingApi } from '../../../services/tradingApi';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';

// Types
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

// Constants
const plans: Plan[] = [
  { id: '1', amount: 10, label: '₹10' },
  { id: '2', amount: 20, label: '₹20' },
  { id: '3', amount: 50, label: '₹50' },
  { id: '4', amount: 100, label: '₹100' },
];

// 12 colors matching backend
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

export default function ColorTrading() {
  const { balance, formattedBalance, refreshWallet } = useWallet();
  const {
    colorActiveRounds,
    colorUpcomingRounds,
    selectedColorRoundId,
    setSelectedColorRoundId,
    isLoadingColorRounds,
    colorRoundsError,
    fetchColorRounds,
  } = useRounds();
  
  const { cart, addItem, removeItem, clearCart, validateCartBalance } = useCart();

  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize - fetch rounds on mount
  useEffect(() => {
    fetchColorRounds();
  }, []);

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchColorRounds(true),
        refreshWallet()
      ]);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Toggle color selection
  const toggleColor = (colorId: string) => {
    if (!selectedColorRoundId) {
      Alert.alert('Select Round', 'Please select a round first!');
      return;
    }

    setSelectedColors(prev => {
      if (prev.includes(colorId)) {
        return prev.filter(c => c !== colorId);
      } else {
        return [...prev, colorId];
      }
    });
  };

  // Add selections to cart
  const addToCart = () => {
    if (!selectedColorRoundId) {
      Alert.alert('No Round Selected', 'Please select a round first!');
      return;
    }

    if (selectedColors.length === 0) {
      Alert.alert('No Colors Selected', 'Please select at least one color');
      return;
    }

    const totalAmount = selectedColors.length * selectedPlan.amount;
    
    const result = addItem({
      roundId: selectedColorRoundId,
      gameType: 'color',
      options: selectedColors,
      amount: totalAmount,
    });

    if (result.success) {
      Alert.alert('Success', result.message);
      setSelectedColors([]);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  // Submit all cart orders
  const submitCartOrders = async () => {
    if (!selectedColorRoundId) {
      Alert.alert('Error', 'No round selected!');
      return;
    }

    if (cart.totalItems === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty!');
      return;
    }

    // Validate balance
    const balanceCheck = validateCartBalance(balance);
    if (!balanceCheck.isValid) {
      Alert.alert('Insufficient Balance', balanceCheck.message);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare all trades - with safety checks
      const allSelections = (cart.items || []).flatMap(item => 
        (Array.isArray(item.options) ? item.options : []).map(color => ({
          option: color,
          amount: selectedPlan.amount
        }))
      );

      // Place order
      const result = await tradingApi.placeOrder(selectedColorRoundId, allSelections);

      if (result) {
        Alert.alert(
          'Success! 🎉',
          `Successfully placed ${allSelections.length} bet${allSelections.length > 1 ? 's' : ''} for ₹${cart.finalAmount}!`,
          [{ text: 'OK', onPress: () => {} }]
        );
        
        clearCart();
        
        // Refresh wallet and rounds
        await Promise.all([
          refreshWallet(),
          fetchColorRounds(true)
        ]);
      } else {
        Alert.alert('Error', 'Failed to place bets');
      }
    } catch (error: any) {
      console.error('Failed to submit orders:', error);
      Alert.alert('Error', error.message || 'Failed to place orders. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total bet amount for selected colors
  const getTotalBetAmount = () => {
    return selectedColors.length * selectedPlan.amount;
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
            <Text style={styles.headerTitle}>🎨 Color Trading</Text>
            <Text style={styles.headerSubtitle}>Select colors • Place bets • Win 9.5x!</Text>
          </View>
          <TouchableOpacity
            onPress={() => fetchColorRounds(true)}
            disabled={isLoadingColorRounds}
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
        {!selectedColorRoundId && (
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
        {isLoadingColorRounds && colorActiveRounds.length === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading rounds...</Text>
          </View>
        )}

        {/* Error State */}
        {colorRoundsError && !isLoadingColorRounds && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
            <Text style={styles.errorText}>{colorRoundsError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchColorRounds(true)}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Active Rounds */}
        {!isLoadingColorRounds && !colorRoundsError && colorActiveRounds.length > 0 && (
          <View style={styles.roundsSection}>
            <Text style={styles.sectionTitle}>🟢 Active Rounds</Text>
            {colorActiveRounds.map((round) => (
              <TouchableOpacity
                key={round.id}
                style={[
                  styles.roundCard,
                  selectedColorRoundId === round.id && styles.selectedRoundCard
                ]}
                onPress={() => {
                  setSelectedColorRoundId(round.id);
                  Alert.alert('Round Selected', 'Round selected for trading');
                }}
              >
                <View style={styles.roundHeader}>
                  <Text style={styles.roundNumber}>Round #{round.roundNumber}</Text>
                  {selectedColorRoundId === round.id && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>SELECTED</Text>
                    </View>
                  )}
                </View>
                <View style={styles.roundDetails}>
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
        {!isLoadingColorRounds && colorUpcomingRounds.length > 0 && (
          <View style={styles.roundsSection}>
            <Text style={styles.sectionTitle}>⏳ Upcoming Rounds</Text>
            {colorUpcomingRounds.slice(0, 3).map((round) => (
              <View key={round.id} style={styles.upcomingRoundCard}>
                <Text style={styles.upcomingRoundNumber}>Round #{round.roundNumber}</Text>
                <Text style={styles.upcomingRoundText}>Upcoming</Text>
              </View>
            ))}
          </View>
        )}

        {/* Color Grid */}
        <View style={styles.colorSection}>
          <Text style={styles.sectionTitle}>Select Your Lucky Colors</Text>
          <Text style={styles.sectionSubtitle}>Choose colors from the grid below</Text>
          <View style={styles.colorGrid}>
            {colors.map(color => {
              const isSelected = selectedColors.includes(color.id);
              
              return (
                <TouchableOpacity
                  key={color.id}
                  onPress={() => toggleColor(color.id)}
                  disabled={!selectedColorRoundId}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color.color },
                    isSelected && styles.selectedColorButton,
                    !selectedColorRoundId && styles.disabledColorButton
                  ]}
                >
                  <Text style={[
                    styles.colorButtonText,
                    { color: color.textColor }
                  ]}>
                    {color.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark-circle" size={24} color={color.textColor} />
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
        {selectedColors.length > 0 && (
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
                <Text style={styles.betSummaryLabel}>Colors</Text>
                <Text style={styles.betSummaryAmount}>{selectedColors.length}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={addToCart}
              disabled={!selectedColorRoundId || selectedColors.length === 0}
              style={[
                styles.addToCartButton,
                (!selectedColorRoundId || selectedColors.length === 0) && styles.disabledButton
              ]}
            >
              <Ionicons name="cart" size={20} color={Colors.textOnPrimary} />
              <Text style={styles.addToCartButtonText}>
                {selectedColorRoundId ? 'Add to Cart' : 'Select Round First'}
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
            
            {(cart.items || []).map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.cartItemHeader}>
                  <Text style={styles.cartItemTitle}>
                    {Array.isArray(item.options) ? item.options.join(', ') : 'N/A'}
                  </Text>
                  <Text style={styles.cartItemAmount}>₹{item.amount || 0}</Text>
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
  colorSection: { margin: Spacing.lg },
  sectionSubtitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.md },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  colorButton: { width: '30%', height: 100, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center', position: 'relative', borderWidth: 2, borderColor: 'transparent' },
  selectedColorButton: { borderColor: Colors.primary, borderWidth: 4 },
  disabledColorButton: { opacity: 0.5 },
  colorButtonText: { fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.semibold },
  checkmark: { position: 'absolute', top: 4, right: 4 },
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