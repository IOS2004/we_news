import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Cart } from '@/hooks/useCart';
import { CartItem } from './CartItem';

interface CartDrawerProps {
  cart: Cart;
  isOpen: boolean;
  onClose: () => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onSubmitOrders: () => Promise<void>;
  walletBalance: number;
  isSubmitting?: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  cart,
  isOpen,
  onClose,
  onRemoveItem,
  onClearCart,
  onSubmitOrders,
  walletBalance,
  isSubmitting = false,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearCart = () => {
    if (showClearConfirm) {
      onClearCart();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  const handleSubmit = async () => {
    await onSubmitOrders();
  };

  // Check if user has sufficient balance
  const hasInsufficientBalance = cart.finalAmount > walletBalance;

  // Group items by game type
  const colorItems = cart.items.filter((item) => item.gameType === 'color');
  const numberItems = cart.items.filter((item) => item.gameType === 'number');

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.drawer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconBox}>
                <Text style={styles.headerIcon}>🛒</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>Your Cart</Text>
                <Text style={styles.headerSubtitle}>
                  {cart.totalItems} {cart.totalItems === 1 ? 'order' : 'orders'} ready to place
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Cart Items (Scrollable) */}
          <ScrollView 
            style={styles.itemsContainer}
            contentContainerStyle={styles.itemsContent}
          >
            {cart.items.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconBox}>
                  <Text style={styles.emptyIcon}>🛒</Text>
                </View>
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptyText}>Select colors or numbers to add orders to your cart</Text>
                <View style={styles.emptyHint}>
                  <Text style={styles.emptyHintIcon}>💡</Text>
                  <Text style={styles.emptyHintText}>Add multiple orders before placing them all at once!</Text>
                </View>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {/* Color Trading Orders */}
                {colorItems.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <View style={[styles.sectionDot, { backgroundColor: '#9333EA' }]} />
                      <Text style={styles.sectionTitle}>Color Trading ({colorItems.length})</Text>
                    </View>
                    {colorItems.map((item) => (
                      <CartItem key={item.id} item={item} onRemove={onRemoveItem} />
                    ))}
                  </View>
                )}

                {/* Number Trading Orders */}
                {numberItems.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <View style={[styles.sectionDot, { backgroundColor: '#2563EB' }]} />
                      <Text style={styles.sectionTitle}>Number Trading ({numberItems.length})</Text>
                    </View>
                    {numberItems.map((item) => (
                      <CartItem key={item.id} item={item} onRemove={onRemoveItem} />
                    ))}
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {/* Balance Warning */}
            {hasInsufficientBalance && (
              <View style={styles.warningBox}>
                <View style={styles.warningIconBox}>
                  <Text style={styles.warningIcon}>⚠️</Text>
                </View>
                <View style={styles.warningContent}>
                  <Text style={styles.warningTitle}>Insufficient Balance</Text>
                  <Text style={styles.warningText}>
                    You need ₹{cart.finalAmount} but only have ₹{walletBalance} available
                  </Text>
                </View>
              </View>
            )}

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Orders</Text>
                  <Text style={styles.statValue}>{cart.totalItems}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Potential Win</Text>
                  <Text style={styles.statWinValue}>₹{cart.totalAmount * 2}</Text>
                </View>
              </View>

              {/* Price Breakdown */}
              <View style={styles.breakdown}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Subtotal:</Text>
                  <Text style={styles.breakdownValue}>₹{cart.totalAmount}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <View style={styles.breakdownLabelBox}>
                    <Text style={styles.breakdownLabel}>Service Charge (10%):</Text>
                    <Text style={styles.breakdownHint}>(min ₹5)</Text>
                  </View>
                  <Text style={styles.breakdownServiceValue}>₹{cart.serviceCharge}</Text>
                </View>
                <View style={styles.breakdownDivider} />
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownTotalLabel}>Total Amount:</Text>
                  <Text style={styles.breakdownTotalValue}>₹{cart.finalAmount}</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              {/* Submit Orders Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={cart.items.length === 0 || hasInsufficientBalance || isSubmitting}
                style={[
                  styles.submitButton,
                  (cart.items.length === 0 || hasInsufficientBalance || isSubmitting) && styles.submitButtonDisabled
                ]}
              >
                {isSubmitting ? (
                  <>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text style={styles.submitButtonText}>Placing Orders...</Text>
                  </>
                ) : (
                  <>
                    <View style={styles.submitIconBox}>
                      <Text style={styles.submitIcon}>📤</Text>
                    </View>
                    <Text style={styles.submitButtonText}>Place All {cart.totalItems} Orders</Text>
                    <View style={styles.submitAmountBox}>
                      <Text style={styles.submitAmount}>₹{cart.finalAmount}</Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>

              {/* Clear Cart Button */}
              <TouchableOpacity
                onPress={handleClearCart}
                disabled={cart.items.length === 0 || isSubmitting}
                style={[
                  styles.clearButton,
                  showClearConfirm && styles.clearButtonConfirm,
                  (cart.items.length === 0 || isSubmitting) && styles.clearButtonDisabled
                ]}
              >
                <Text style={[
                  styles.clearButtonIcon,
                  showClearConfirm && styles.clearButtonIconConfirm
                ]}>
                  🗑️
                </Text>
                <Text style={[
                  styles.clearButtonText,
                  showClearConfirm && styles.clearButtonTextConfirm
                ]}>
                  {showClearConfirm ? 'Confirm Clear All' : 'Clear All Orders'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  drawer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#9333EA',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 12,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  closeIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  itemsContainer: {
    maxHeight: 400,
  },
  itemsContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIconBox: {
    backgroundColor: '#F3E8FF',
    padding: 24,
    borderRadius: 999,
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  emptyHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 8,
  },
  emptyHintIcon: {
    fontSize: 16,
  },
  emptyHintText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
  },
  itemsList: {
    gap: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  footer: {
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 12,
  },
  warningIconBox: {
    backgroundColor: '#FEE2E2',
    padding: 8,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  warningIcon: {
    fontSize: 18,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#DC2626',
  },
  summaryCard: {
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  statWinValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10B981',
  },
  breakdown: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#4B5563',
  },
  breakdownLabelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  breakdownHint: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  breakdownServiceValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EA580C',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  breakdownTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  breakdownTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#7C3AED',
  },
  actions: {
    gap: 8,
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitIconBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 999,
  },
  submitIcon: {
    fontSize: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  submitAmountBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  submitAmount: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  clearButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  clearButtonConfirm: {
    backgroundColor: '#DC2626',
  },
  clearButtonDisabled: {
    opacity: 0.5,
  },
  clearButtonIcon: {
    fontSize: 16,
  },
  clearButtonIconConfirm: {
    fontSize: 16,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  clearButtonTextConfirm: {
    color: '#FFFFFF',
  },
});

export default CartDrawer;
