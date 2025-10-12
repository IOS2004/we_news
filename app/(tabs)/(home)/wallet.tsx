import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header } from '../../../components/common';
import { TransactionListItem, AddMoneyCard } from '../../../components/wallet';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../constants/theme';
import { useWallet } from '../../../contexts/WalletContext';
import walletApi from '../../../services/walletApi';

interface Transaction {
  id?: string;
  walletId?: string;
  type?: 'credit' | 'debit';
  transactionType?: 'credit' | 'debit' | 'refund' | 'cashback';
  amount: number;
  date?: string;
  description: string;
  status?: 'completed' | 'pending' | 'failed' | 'success';
  category?: string;
  time?: string;
  createdAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
  transactionReference?: string;
}

export default function WalletScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { balance, formattedBalance } = useWallet();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [totalTransactionsCount, setTotalTransactionsCount] = useState(0);
  const [apiBalance, setApiBalance] = useState<number>(0);

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      const response = await walletApi.getTransactions({ limit: 5 });
      
      // Transform API transactions to match component format
      const transformedTransactions = response.transactions.map((txn: any) => ({
        id: txn.transactionReference || txn.id || `txn-${Date.now()}`,
        type: txn.transactionType as 'credit' | 'debit',
        amount: txn.amount,
        date: txn.createdAt?._seconds 
          ? new Date(txn.createdAt._seconds * 1000).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        time: txn.createdAt?._seconds
          ? new Date(txn.createdAt._seconds * 1000).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })
          : '',
        description: txn.description,
        status: txn.status === 'success' ? 'completed' as const : 
                txn.status === 'pending' ? 'pending' as const : 
                txn.status === 'failed' ? 'failed' as const : 'completed' as const,
        category: txn.transactionType === 'credit' ? 'Deposit' : 'Withdrawal',
      }));

      setRecentTransactions(transformedTransactions);
      setTotalTransactionsCount(response.totalTransactions);
      setApiBalance(response.currentBalance);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };
  
  const handleWithdrawal = () => {
    router.push('/withdrawal-request');
  };

  const handleAddMoney = () => {
    router.push('/add-money');
  };

  const handleRedeem = () => {
    router.push('/redeem');
  };

  const handleHistory = () => {
    router.push('/withdrawal-history');
  };

  // Use API transactions
  const displayTransactions = recentTransactions;

  const filteredTransactions = selectedFilter === 'all' 
    ? displayTransactions 
    : displayTransactions.filter(t => t.type === selectedFilter);

  const totalIncome = displayTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = displayTransactions
    .filter(t => t.type === 'debit' && (t.status === 'completed' || t.status === 'success'))
    .reduce((sum, t) => sum + t.amount, 0);

  // Use balance from API or context
  const currentBalance = apiBalance || balance;

  // Get credit transactions for "Add Money" section
  const addMoneyFromAPI = displayTransactions
    .filter(t => t.type === 'credit')
    .slice(0, 3)
    .map(t => ({
      id: t.id!,
      amount: t.amount,
      method: t.description.includes('UPI') ? 'UPI Payment' : 
              t.description.includes('Bank') ? 'Net Banking' : 
              t.description.includes('topup') || t.description.includes('Wallet') ? 'Wallet Topup' : 'Payment',
      date: t.date!,
      status: t.status === 'completed' || t.status === 'success' ? 'success' as const : 
              t.status === 'pending' ? 'pending' as const : 'success' as const,
    }));

  // Use API data
  const displayAddMoney = addMoneyFromAPI;

  if (loading) {
    return (
      <ScreenWrapper style={styles.container}>
        <Header title="My Wallet" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading wallet data...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.container}>
      <Header title="My Wallet" />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <TouchableOpacity>
              <Ionicons name="eye-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>₹{currentBalance.toLocaleString()}</Text>
          <Text style={styles.balanceSubtext}>Last updated: {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleWithdrawal}>
            <View style={styles.actionIcon}>
              <Ionicons name="arrow-up-outline" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleAddMoney}>
            <View style={styles.actionIcon}>
              <Ionicons name="add-outline" size={24} color={Colors.success} />
            </View>
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleRedeem}>
            <View style={styles.actionIcon}>
              <Ionicons name="gift-outline" size={24} color={Colors.accent2} />
            </View>
            <Text style={styles.actionText}>Redeem</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleHistory}>
            <View style={styles.actionIcon}>
              <Ionicons name="time-outline" size={24} color={Colors.warning} />
            </View>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>₹{totalIncome}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
              <View style={styles.statTrend}>
                <Ionicons name="trending-up" size={16} color={Colors.success} />
                <Text style={styles.statTrendText}>+12%</Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>₹{totalWithdrawn}</Text>
              <Text style={styles.statLabel}>Withdrawn</Text>
              <View style={styles.statTrend}>
                <Ionicons name="trending-down" size={16} color={Colors.error} />
                <Text style={styles.statTrendText}>-5%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Add Money */}
        <View style={styles.addMoneySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Add Money</Text>
            <TouchableOpacity onPress={handleAddMoney}>
              <Text style={styles.viewAllText}>Add More</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.addMoneyList}>
            {displayAddMoney.slice(0, 3).map((item) => (
              <AddMoneyCard
                key={item.id}
                amount={item.amount}
                method={item.method}
                date={new Date(item.date).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
                status={item.status}
                onPress={() => {}}
              />
            ))}
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.transactionSection}>
          <View style={styles.transactionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterTabs}>
            {['all', 'credit', 'debit'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterTab, selectedFilter === filter && styles.activeFilterTab]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.filterTabText, selectedFilter === filter && styles.activeFilterTabText]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Transaction List */}
          <View style={styles.transactionList}>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.slice(0, 5).map((item) => (
                <TransactionListItem 
                  key={item.id || `txn-${Math.random()}`}
                  type={item.type || 'credit'}
                  amount={item.amount}
                  date={item.date || ''}
                  description={item.description}
                  status={item.status === 'success' ? 'completed' : item.status || 'completed'}
                  category={item.category}
                  time={item.time}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No transactions yet</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  balanceCard: {
    margin: Spacing.lg,
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  balanceLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textSecondary,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginVertical: Spacing.sm,
  },
  balanceSubtext: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    minWidth: 70,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    ...Shadows.sm,
  },
  actionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  statsSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statTrendText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.success,
  },
  transactionSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  viewAllText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    paddingVertical: Spacing.unit,
  },
  activeFilterTabText: {
    color: Colors.textOnPrimary,
  },
  transactionList: {
    gap: Spacing.sm,
  },
  addMoneySection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  addMoneyList: {
    gap: Spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
});
