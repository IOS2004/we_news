import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CartItem as CartItemType } from '@/hooks/useCart';

interface CartItemProps {
  item: CartItemType;
  onRemove: (itemId: string) => void;
}

const COLOR_MAP: Record<string, string> = {
  red: '#DC2626',
  blue: '#2563EB',
  green: '#16A34A',
  yellow: '#EAB308',
  orange: '#EA580C',
  purple: '#9333EA',
  black: '#374151',
  white: '#F3F4F6',
  brown: '#92400E',
  pink: '#EC4899',
  cyan: '#0891B2',
  grey: '#6B7280',
};

export const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  // Format options display based on game type
  const renderOptions = () => {
    if (item.gameType === 'color') {
      // For color trading, show color boxes
      return (
        <View style={styles.optionsContainer}>
          {item.options.map((color, index) => (
            <View
              key={index}
              style={[
                styles.colorBox,
                { backgroundColor: COLOR_MAP[color.toLowerCase()] || color.toLowerCase() }
              ]}
            />
          ))}
        </View>
      );
    } else {
      // For number trading, show numbers as badges
      return (
        <View style={styles.optionsContainer}>
          {item.options.map((number, index) => (
            <View key={index} style={styles.numberBadge}>
              <Text style={styles.numberText}>{number}</Text>
            </View>
          ))}
        </View>
      );
    }
  };

  const gameTypeDisplay = item.gameType === 'color' ? 'Color Trading' : 'Number Trading';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[
            styles.typeBadge,
            item.gameType === 'color' ? styles.typeBadgeColor : styles.typeBadgeNumber
          ]}>
            <Text style={[
              styles.typeText,
              item.gameType === 'color' ? styles.typeTextColor : styles.typeTextNumber
            ]}>
              {gameTypeDisplay}
            </Text>
          </View>
          <Text style={styles.roundIdText}>#{item.roundId.slice(-6)}</Text>
        </View>
        
        <TouchableOpacity
          onPress={() => onRemove(item.id)}
          style={styles.removeButton}
        >
          <Text style={styles.removeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Options Display */}
        <View style={styles.optionsSection}>
          {renderOptions()}
        </View>

        {/* Amount */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>₹{item.amount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeColor: {
    backgroundColor: '#F3E8FF',
  },
  typeBadgeNumber: {
    backgroundColor: '#DBEAFE',
  },
  typeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  typeTextColor: {
    color: '#7C3AED',
  },
  typeTextNumber: {
    color: '#2563EB',
  },
  roundIdText: {
    fontSize: 11,
    color: '#6B7280',
  },
  removeButton: {
    padding: 4,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  removeIcon: {
    fontSize: 14,
    color: '#DC2626',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionsSection: {
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  colorBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  numberBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  numberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
});

export default CartItem;
