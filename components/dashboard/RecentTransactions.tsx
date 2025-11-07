import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useWallet } from '../../contexts/WalletContext';
import { Transaction } from '../../services/walletService';
import { 
  formatTransactionDate, 
  formatTransactionTime, 
  formatTransactionType, 
  getTransactionIcon, 
  getTransactionColor 
} from '../../utils/walletUtils';

interface RecentTransactionsProps {
  onViewMore: () => void;
  maxItems?: number;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  onViewMore,
  maxItems = 4 
}) => {
  const { transactions, isLoading } = useWallet();
  const displayTransactions = transactions.slice(0, maxItems);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={[styles.iconContainer, { backgroundColor: getTransactionColor(item.transactionType) + '15' }]}>
        <Ionicons 
          name={getTransactionIcon(item.transactionType) as any} 
          size={20} 
          color={getTransactionColor(item.transactionType)} 
        />
      </View>
      
      <View style={styles.transactionDetails}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={[styles.transactionAmount, { color: getTransactionColor(item.transactionType) }]}>
            {item.transactionType === 'credit' ? '+' : '-'}₹{item.amount.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.transactionMeta}>
          <Text style={styles.transactionCategory}>{formatTransactionType(item.transactionType)}</Text>
          <Text style={styles.transactionTime}>{formatTransactionTime(item)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="receipt-outline" size={24} color={Colors.primary} />
          <Text style={styles.title}>Recent Transactions</Text>
        </View>
      </View>

      <View style={styles.transactionsList}>
        <FlatList
          data={displayTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={48} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>No transactions yet</Text>
        </View>
      ) : transactions.length > maxItems && (
        <TouchableOpacity style={styles.viewMoreButton} onPress={onViewMore}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight]}
            style={styles.viewMoreGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.viewMoreText}>View All Transactions</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.textOnPrimary} />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  transactionsList: {
    paddingHorizontal: Spacing.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  transactionDescription: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  transactionAmount: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  transactionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionCategory: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  transactionTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 52, // Align with transaction text
  },
  viewMoreButton: {
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  viewMoreGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  viewMoreText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textOnPrimary,
    marginRight: Spacing.sm,
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});

export default RecentTransactions;
