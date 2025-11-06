import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface CartSummaryBarProps {
  itemCount: number;
  finalAmount: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export const CartSummaryBar: React.FC<CartSummaryBarProps> = ({
  itemCount,
  finalAmount,
  onToggle,
}) => {
  if (itemCount === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onToggle}
        style={styles.button}
        activeOpacity={0.9}
      >
        {/* Left: Cart Icon + Count */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🛒</Text>
          {itemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{itemCount}</Text>
            </View>
          )}
        </View>
        
        {/* Center: Cart Info */}
        <View style={styles.info}>
          <Text style={styles.label}>CART</Text>
          <Text style={styles.amount}>₹{finalAmount}</Text>
        </View>

        {/* Right: View Button */}
        <View style={styles.viewButton}>
          <Text style={styles.viewText}>VIEW</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 50,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F97316',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 12,
  },
  iconContainer: {
    position: 'relative',
  },
  icon: {
    fontSize: 28,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FBBF24',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  viewButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default CartSummaryBar;
