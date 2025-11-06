import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../../components/common';
import { useWallet } from '../../../contexts/WalletContext';
import { useCart } from '../../../hooks/useCart';
import { tradingApi } from '../../../services/tradingApi';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';

export default function Cart() {
  const router = useRouter();
  const { balance, formattedBalance, refreshWallet } = useWallet();
  const { cart, removeItem, clearCart, validateCartBalance } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle item removal
  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeItem(itemId),
        },
      ]
    );
  };

  // Handle clear cart
  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => clearCart(),
        },
      ]
    );
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart first!');
      return;
    }

    // Validate balance
    const balanceCheck = validateCartBalance(balance);
    if (!balanceCheck.isValid) {
      Alert.alert(
        'Insufficient Balance',
        balanceCheck.message || `You need ₹${cart.finalAmount.toFixed(2)} but have ${formattedBalance}. Please recharge your wallet.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Recharge',
            onPress: () => router.push('/(tabs)/(home)/wallet'),
          },
        ]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Group items by round and game type
      const trades = cart.items.map((item) => ({
        roundId: item.roundId,
        tradeType: item.gameType === 'color' ? 'colour' : item.gameType, // backend expects 'colour'
        selection: item.options[0], // For single selection
        amount: item.amount,
      }));

      // Submit all trades in batch
  const response = await tradingApi.placeTradesBatch(trades as any);

      if (response.success) {
        Alert.alert('Success', 'All trades placed successfully!', [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              refreshWallet();
              router.push('/(tabs)/(trades)/my-trades');
            },
          },
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to place trades');
      }
    } catch (error: any) {
      console.error('Error placing trades:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to place trades. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render empty cart
  if (cart.items.length === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="cart-outline" size={28} color={Colors.text} />
              <Text style={styles.headerTitle}>My Cart</Text>
            </View>
          </View>

          {/* Empty State */}
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Add some trades to get started!
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push('/(tabs)/(trades)')}
            >
              <Text style={styles.browseButtonText}>Browse Rounds</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="cart" size={28} color={Colors.text} />
            <Text style={styles.headerTitle}>My Cart</Text>
            <View style={styles.itemCountBadge}>
              <Text style={styles.itemCountText}>{cart.totalItems}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Wallet Balance */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceLeft}>
              <Ionicons name="wallet" size={24} color={Colors.primary} />
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceValue}>{formattedBalance}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.rechargeButton}
              onPress={() => router.push('/(tabs)/(home)/wallet')}
            >
              <Ionicons name="add-circle" size={18} color={Colors.primary} />
              <Text style={styles.rechargeButtonText}>Add Money</Text>
            </TouchableOpacity>
          </View>

          {/* Cart Items */}
          <View style={styles.cartSection}>
            <Text style={styles.sectionTitle}>Cart Items ({cart.totalItems})</Text>
            {cart.items.map((item, index) => (
              <View 
                key={item.id || `cart-item-${index}`} 
                style={styles.cartItem}
              >
                {/* Item Header */}
                <View style={styles.cartItemHeader}>
                  <View style={[
                    styles.gameTypeBadge,
                    { backgroundColor: item.gameType === 'color' ? '#EC4899' : '#3B82F6' }
                  ]}>
                    <Text style={styles.gameTypeText}>
                      {item.gameType === 'color' ? '🎨 Color' : '🔢 Number'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveItem(item.id)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={24} color={Colors.error} />
                  </TouchableOpacity>
                </View>

                {/* Item Content */}
                <View style={styles.cartItemContent}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemLabel}>Round ID</Text>
                    <Text style={styles.itemValue}>#{item.roundId.slice(-6)}</Text>
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemLabel}>Selection</Text>
                    <View style={styles.selectionsChipContainer}>
                      {Array.isArray(item.options) ? (
                        item.options.map((option, idx) => (
                          <View key={`${item.id}-option-${idx}`} style={styles.selectionChip}>
                            <Text style={styles.selectionChipText}>{option}</Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.itemValue}>N/A</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemLabel}>Amount</Text>
                    <Text style={[styles.itemValue, styles.amountText]}>
                      ₹{item.amount}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Price Breakdown */}
          <View style={styles.breakdownCard}>
            <Text style={styles.sectionTitle}>Price Breakdown</Text>
            
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Subtotal</Text>
              <Text style={styles.breakdownValue}>₹{cart.totalAmount.toFixed(2)}</Text>
            </View>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLabelContainer}>
                <Text style={styles.breakdownLabel}>Service Charge</Text>
                <Text style={styles.serviceChargeNote}>(10%)</Text>
              </View>
              <Text style={styles.breakdownValue}>₹{cart.serviceCharge.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.breakdownRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{cart.finalAmount.toFixed(2)}</Text>
            </View>

            {/* Balance Check */}
            {cart.finalAmount > balance && (
              <View style={styles.warningBox}>
                <Ionicons name="warning" size={18} color={Colors.warning} />
                <Text style={styles.warningText}>
                  Insufficient balance! Please recharge your wallet.
                </Text>
              </View>
            )}
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Checkout Button */}
        <View style={styles.checkoutContainer}>
          <View style={styles.checkoutInfo}>
            <Text style={styles.checkoutLabel}>Total Amount</Text>
            <Text style={styles.checkoutAmount}>₹{cart.finalAmount.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              (isSubmitting || cart.finalAmount > balance) && styles.checkoutButtonDisabled,
            ]}
            onPress={handleCheckout}
            disabled={isSubmitting || cart.finalAmount > balance}
          >
            {isSubmitting ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
                <Text style={styles.checkoutButtonText}>Place Orders</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  itemCountBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCountText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  clearButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
    fontWeight: Typography.fontWeight.medium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  balanceInfo: {
    gap: 2,
  },
  balanceLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  balanceValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  rechargeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  rechargeButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
  },
  cartSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  cartItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  gameTypeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  gameTypeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
  removeButton: {
    padding: 4,
  },
  cartItemContent: {
    gap: Spacing.sm,
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  itemValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  amountText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  selectionsChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  selectionChip: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  selectionChipText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
  },
  breakdownCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  breakdownLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  breakdownLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  serviceChargeNote: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  breakdownValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  totalLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  totalValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#FEF3C7',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  warningText: {
    flex: 1,
    fontSize: Typography.fontSize.xs,
    color: '#92400E',
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkoutInfo: {
    flex: 1,
  },
  checkoutLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  checkoutAmount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
    minWidth: 150,
  },
  checkoutButtonDisabled: {
    backgroundColor: Colors.buttonDisabled,
    opacity: 0.6,
  },
  checkoutButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  browseButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
});
