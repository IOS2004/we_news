import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  ActivityIndicator 
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header } from '../../../components/common';
import { TransactionListItem, AddMoneyCard } from '../../../components/wallet';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../constants/theme';
import { useWallet } from '../../../contexts/WalletContext';
import { Transaction } from '../../../services/walletService';
import { formatTransactionDate, categorizeTransaction } from '../../../utils/walletUtils';

export default function WalletScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { balance, formattedBalance, transactions, isLoading, error, refreshWallet } = useWallet();
  const [refreshing, setRefreshing] = useState(false);
  
  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshWallet();
    } catch (error) {
      console.error('Error refreshing wallet:', error);
    } finally {
      setRefreshing(false);
    }
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

  // Filter transactions based on selected filter
  const filteredTransactions = selectedFilter === 'all' 
    ? transactions 
    : transactions.filter(t => t.transactionType === selectedFilter);

  // Calculate stats from real transactions
  const totalIncome = transactions
    .filter(t => t.transactionType === 'credit' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = transactions
    .filter(t => t.transactionType === 'debit' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  // Get deposit transactions (topups) - check description for deposit/topup/add money keywords
  const depositTransactions = transactions
    .filter(t => {
      const desc = t.description.toLowerCase();
      return t.transactionType === 'credit' && 
             (desc.includes('deposit') || desc.includes('topup') || desc.includes('add money') || desc.includes('payment'));
    })
    .slice(0, 3);

  // Format last updated time
  const lastUpdated = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <ScreenWrapper style={styles.container}>
      <Header title="My Wallet" />

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
        {/* Loading State */}
        {isLoading && transactions.length === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading wallet data...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Balance Card */}
        {!isLoading && !error && (
          <View>
            <View style={styles.balanceCard}>
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <TouchableOpacity>
                  <Ionicons name="eye-outline" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.balanceAmount}>{formattedBalance}</Text>
              <Text style={styles.balanceSubtext}>Last updated: Today, {lastUpdated}</Text>
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
              <Text style={styles.statValue}>₹{totalIncome.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>₹{totalWithdrawn.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Withdrawn</Text>
            </View>
          </View>
        </View>

        {/* Recent Add Money */}
        {depositTransactions.length > 0 && (
          <View style={styles.addMoneySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Deposits</Text>
              <TouchableOpacity onPress={handleAddMoney}>
                <Text style={styles.viewAllText}>Add More</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.addMoneyList}>
              {depositTransactions.map((item, index) => (
                <AddMoneyCard
                  key={item.id || `deposit-${index}`}
                  amount={item.amount}
                  method="Online Payment"
                  date={formatTransactionDate(item)}
                  status={item.status}
                  onPress={() => {}}
                />
              ))}
            </View>
          </View>
        )}

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
              filteredTransactions.slice(0, 8).map((item) => (
                <TransactionListItem key={item.id} {...item} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyStateText}>No transactions yet</Text>
              </View>
            )}
          </View>
        </View>
        </View>
      )}
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
    padding: Spacing['2xl'],
    minHeight: 300,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
    minHeight: 300,
  },
  errorText: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    fontSize: Typography.fontSize.base,
    color: Colors.error,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
    minHeight: 200,
  },
  emptyStateText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
