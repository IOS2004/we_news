import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  time: string;
  description: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
}

interface RecentTransactionsProps {
  onViewMore: () => void;
  maxItems?: number;
}

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'credit',
    amount: 50,
    date: '2024-01-15',
    time: '2:30 PM',
    description: 'Daily earnings credited',
    category: 'Earnings',
    status: 'completed'
  },
  {
    id: '2',
    type: 'credit',
    amount: 25,
    date: '2024-01-15',
    time: '1:15 PM',
    description: 'Video ad completion bonus',
    category: 'Ad Revenue',
    status: 'completed'
  },
  {
    id: '3',
    type: 'debit',
    amount: 100,
    date: '2024-01-14',
    time: '4:45 PM',
    description: 'Withdrawal to bank account',
    category: 'Withdrawal',
    status: 'completed'
  },
  {
    id: '4',
    type: 'credit',
    amount: 15,
    date: '2024-01-14',
    time: '11:20 AM',
    description: 'Referral bonus',
    category: 'Referral',
    status: 'completed'
  },
  {
    id: '5',
    type: 'credit',
    amount: 200,
    date: '2024-01-13',
    time: '3:10 PM',
    description: 'Level up reward',
    category: 'Bonus',
    status: 'completed'
  }
];

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  onViewMore,
  maxItems = 4 
}) => {
  const displayTransactions = mockTransactions.slice(0, maxItems);

  const getTransactionIcon = (type: string, category: string) => {
    if (type === 'credit') {
      switch (category) {
        case 'Earnings': return 'trending-up';
        case 'Ad Revenue': return 'play-circle';
        case 'Referral': return 'people';
        case 'Bonus': return 'gift';
        default: return 'arrow-down-circle';
      }
    } else {
      switch (category) {
        case 'Withdrawal': return 'card';
        default: return 'arrow-up-circle';
      }
    }
  };

  const getTransactionColor = (type: string) => {
    return type === 'credit' ? Colors.success : Colors.primary;
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={[styles.iconContainer, { backgroundColor: getTransactionColor(item.type) + '15' }]}>
        <Ionicons 
          name={getTransactionIcon(item.type, item.category) as any} 
          size={20} 
          color={getTransactionColor(item.type)} 
        />
      </View>
      
      <View style={styles.transactionDetails}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={[styles.transactionAmount, { color: getTransactionColor(item.type) }]}>
            {item.type === 'credit' ? '+' : '-'}₹{item.amount}
          </Text>
        </View>
        
        <View style={styles.transactionMeta}>
          <Text style={styles.transactionCategory}>{item.category}</Text>
          <Text style={styles.transactionTime}>{item.time}</Text>
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

      {mockTransactions.length > maxItems && (
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
});

export default RecentTransactions;
