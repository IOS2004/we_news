import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Colors, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { Transaction } from '../../services/walletService';
import { 
  formatTransactionDate, 
  formatTransactionTime, 
  formatTransactionType, 
  categorizeTransaction 
} from '../../utils/walletUtils';

interface TransactionListItemProps extends Transaction {}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ 
  transactionType, 
  amount, 
  description, 
  status,
  createdAt
}) => {
  const isCredit = transactionType === 'credit';
  const amountPrefix = isCredit ? '+' : '-';
  
  // Enhanced icon and color logic
  const getTransactionIcon = () => {
    if (isCredit) {
      return 'arrow-down-circle';
    } else {
      return 'arrow-up-circle';
    }
  };

  const getStatusColor = () => {
    if (status === 'pending') return Colors.warning;
    if (status === 'failed') return Colors.error;
    return isCredit ? Colors.success : Colors.primary;
  };

  const getBackgroundColor = () => {
    const baseColor = getStatusColor();
    return baseColor + '15'; // Add 15% opacity
  };

  return (
    <View style={styles.container}>
      {/* <View style={[styles.iconContainer, { backgroundColor: getBackgroundColor() }]}>
        <Ionicons 
          name={getTransactionIcon()} 
          size={24} 
          color={getStatusColor()} 
        />
      </View> */}
      
      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
          <Text style={[styles.amount, { color: getStatusColor() }]}>
            {amountPrefix}₹{amount.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.bottomRow}>
          <View style={styles.leftInfo}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{formatTransactionType(transactionType)}</Text>
            </View>
            <Text style={styles.dateTime}>
              {formatTransactionDate({ createdAt } as Transaction)} • {formatTransactionTime({ createdAt } as Transaction)}
            </Text>
          </View>
          
          {status !== 'success' && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    // marginBottom: Spacing.unit,
    ...Shadows.sm,
    borderWidth: 1,
    // paddingHorizontal: Spacing.md,
    borderColor: Colors.borderLight,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  contentContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  amount: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'right',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryTag: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
  },
  categoryText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  dateTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.normal,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    textTransform: 'capitalize',
  },
});

export default TransactionListItem;
