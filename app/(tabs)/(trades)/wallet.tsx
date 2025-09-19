import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../components/common";
import { useWallet } from "../../../contexts/WalletContext";
import { Colors, Typography, Spacing, BorderRadius } from "../../../constants/theme";

interface Transaction {
  id: string;
  type: 'trade' | 'winning' | 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function Wallet() {
  const { balance, transactions: walletTransactions } = useWallet();
  const [activeFilter, setActiveFilter] = useState<'all' | 'winnings' | 'trades'>('all');
  const [timeFilter, setTimeFilter] = useState('Last 7 days');

  // Filter wallet transactions to show only trading-related ones
  const tradingTransactions = walletTransactions.filter(t => t.category === 'trading');
  
  const [sampleTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'trade',
      amount: -100,
      description: 'Number Trade - Round #12',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: '2',
      type: 'winning',
      amount: 250,
      description: 'Winning - Round #11',
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: '3',
      type: 'trade',
      amount: -100,
      description: 'Number Trade - Round #10',
      date: '2024-01-13',
      status: 'completed'
    },
    {
      id: '4',
      type: 'trade',
      amount: -100,
      description: 'Number Trade - Round #9',
      date: '2024-01-12',
      status: 'completed'
    },
    {
      id: '5',
      type: 'winning',
      amount: 250,
      description: 'Winning - Round #8',
      date: '2024-01-11',
      status: 'completed'
    }
  ]);

  // Convert wallet transactions to local format and combine with sample transactions
  const allTransactions = [
    ...tradingTransactions.map(t => ({
      id: t.id,
      type: t.type === 'credit' ? 'winning' as const : 'trade' as const,
      amount: t.type === 'credit' ? t.amount : -t.amount,
      description: t.description,
      date: t.date,
      status: t.status,
    })),
    ...sampleTransactions
  ];

  const filteredTransactions = allTransactions.filter(transaction => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'winnings') return transaction.type === 'winning';
    if (activeFilter === 'trades') return transaction.type === 'trade';
    return true;
  });

  const handleAddFunds = () => {
    Alert.alert("Add Funds", "Add funds functionality will be implemented");
  };

  const handleWithdraw = () => {
    Alert.alert("Withdraw", "Withdraw functionality will be implemented");
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'trade':
        return { icon: 'arrow-down', color: '#EF4444' };
      case 'winning':
        return { icon: 'arrow-up', color: '#22C55E' };
      case 'deposit':
        return { icon: 'add', color: '#22C55E' };
      case 'withdrawal':
        return { icon: 'remove', color: '#EF4444' };
      default:
        return { icon: 'swap-horizontal', color: '#AAAAAA' };
    }
  };

  const renderTransaction = (transaction: Transaction) => {
    const { icon, color } = getTransactionIcon(transaction.type);
    
    return (
      <View key={transaction.id} style={styles.transactionItem}>
        <View style={[styles.transactionIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        
        <View style={styles.transactionContent}>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
        
        <Text style={[
          styles.transactionAmount,
          { color: transaction.amount > 0 ? '#22C55E' : '#EF4444' }
        ]}>
          {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
        </Text>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Wallet</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Balance Section */}
          <View style={styles.balanceSection}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Balance 💰</Text>
            </View>
            <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.addFundsButton} onPress={handleAddFunds}>
                <Ionicons name="add" size={20} color={Colors.white} style={{ marginRight: Spacing.xs }} />
                <Text style={styles.addFundsText}>Add Funds</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
                <Ionicons name="arrow-up" size={20} color={Colors.text} style={{ marginRight: Spacing.xs }} />
                <Text style={styles.withdrawText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Transactions Section */}
          <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>Transactions Log</Text>
            
            {/* Filter Tabs */}
            <View style={styles.filterTabs}>
              <TouchableOpacity
                style={[styles.filterTab, activeFilter === 'all' && styles.activeFilterTab]}
                onPress={() => setActiveFilter('all')}
              >
                <Text style={[
                  styles.filterTabText,
                  activeFilter === 'all' && styles.activeFilterTabText
                ]}>All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterTab, activeFilter === 'winnings' && styles.activeFilterTab]}
                onPress={() => setActiveFilter('winnings')}
              >
                <Text style={[
                  styles.filterTabText,
                  activeFilter === 'winnings' && styles.activeFilterTabText
                ]}>Winnings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterTab, activeFilter === 'trades' && styles.activeFilterTab]}
                onPress={() => setActiveFilter('trades')}
              >
                <Text style={[
                  styles.filterTabText,
                  activeFilter === 'trades' && styles.activeFilterTabText
                ]}>Trades</Text>
              </TouchableOpacity>
            </View>

            {/* Time Filter */}
            <TouchableOpacity style={styles.timeFilter}>
              <Text style={styles.timeFilterText}>{timeFilter}</Text>
              <Ionicons name="chevron-down" size={16} color="#AAAAAA" />
            </TouchableOpacity>

            {/* Transactions List */}
            <View style={styles.transactionsList}>
              {filteredTransactions.map(renderTransaction)}
            </View>
          </View>
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
    justifyContent: "center",
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
  content: {
    flex: 1,
  },
  balanceSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
  },
  balanceHeader: {
    marginBottom: Spacing.sm,
  },
  balanceLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  balanceAmount: {
    fontSize: Typography.fontSize["4xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing["3xl"],
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.base,
    width: "100%",
  },
  addFundsButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.base,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  addFundsText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: Colors.buttonSecondary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.base,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  withdrawText: {
    color: Colors.text,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  transactionsSection: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    flex: 1,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  filterTabs: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  filterTab: {
    backgroundColor: Colors.buttonSecondary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  activeFilterTabText: {
    color: Colors.white,
  },
  timeFilter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    marginBottom: Spacing.base,
  },
  timeFilterText: {
    color: Colors.text,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  transactionsList: {
    gap: Spacing.base,
    paddingBottom: Spacing.lg,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionContent: {
    flex: 1,
  },
  transactionDescription: {
    color: Colors.text,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  transactionDate: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});