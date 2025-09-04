import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header } from '../../components/common';
import { TransactionListItem, AddMoneyCard } from '../../components/wallet';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

// Dummy add money transactions
const addMoneyTransactions = [
  {
    id: '1',
    amount: 1000,
    method: 'UPI Payment',
    date: '2024-01-21',
    status: 'success' as const,
  },
  {
    id: '2',
    amount: 500,
    method: 'Net Banking',
    date: '2024-01-20',
    status: 'success' as const,
  },
  {
    id: '3',
    amount: 2000,
    method: 'Debit Card',
    date: '2024-01-19',
    status: 'pending' as const,
  },
];

// Dummy transaction data
const dummyTransactions = [
  {
    id: '1',
    type: 'credit' as const,
    amount: 250,
    date: '2024-01-20',
    description: 'News Article Interaction',
    status: 'completed' as const,
    category: 'Reading',
    time: '10:30 AM',
  },
  {
    id: '2',
    type: 'credit' as const,
    amount: 180,
    date: '2024-01-19',
    description: 'Daily Streak Bonus',
    status: 'completed' as const,
    category: 'Bonus',
    time: '11:45 AM',
  },
  {
    id: '3',
    type: 'debit' as const,
    amount: 500,
    date: '2024-01-18',
    description: 'Withdrawal to Bank',
    status: 'completed' as const,
    category: 'Withdrawal',
    time: '2:15 PM',
  },
  {
    id: '4',
    type: 'credit' as const,
    amount: 320,
    date: '2024-01-17',
    description: 'News Sharing Reward',
    status: 'completed' as const,
    category: 'Sharing',
    time: '4:20 PM',
  },
  {
    id: '5',
    type: 'credit' as const,
    amount: 90,
    date: '2024-01-16',
    description: 'Article Comment Reward',
    status: 'completed' as const,
    category: 'Engagement',
    time: '9:15 AM',
  },
  {
    id: '6',
    type: 'debit' as const,
    amount: 200,
    date: '2024-01-15',
    description: 'Withdrawal to UPI',
    status: 'pending' as const,
    category: 'Withdrawal',
    time: '6:30 PM',
  },
  {
    id: '7',
    type: 'credit' as const,
    amount: 150,
    date: '2024-01-14',
    description: 'Weekly Challenge Completion',
    status: 'completed' as const,
    category: 'Challenge',
    time: '12:00 PM',
  },
  {
    id: '8',
    type: 'credit' as const,
    amount: 75,
    date: '2024-01-13',
    description: 'News Category Quiz',
    status: 'completed' as const,
    category: 'Quiz',
    time: '3:45 PM',
  },
];

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  description: string;
  status?: 'completed' | 'pending';
}

export default function WalletScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const handleAddMoney = () => {
    router.push('/add-money');
  };

  const handleWithdrawal = () => {
    router.push('/withdrawals');
  };

  const filteredTransactions = selectedFilter === 'all' 
    ? dummyTransactions 
    : dummyTransactions.filter(t => t.type === selectedFilter);

  const totalIncome = dummyTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = dummyTransactions
    .filter(t => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = 1500;

  return (
    <ScreenWrapper style={styles.container}>
      <Header title="My Wallet" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <TouchableOpacity>
              <Ionicons name="eye-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>₹{currentBalance.toLocaleString()}</Text>
          <Text style={styles.balanceSubtext}>Last updated: Today, 9:30 AM</Text>
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
          
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/withdrawals')}>
            <View style={styles.actionIcon}>
              <Ionicons name="time-outline" size={24} color={Colors.warning} />
            </View>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="card-outline" size={24} color={Colors.info} />
            </View>
            <Text style={styles.actionText}>Cards</Text>
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
            {addMoneyTransactions.slice(0, 3).map((item) => (
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
            {filteredTransactions.slice(0, 5).map((item) => (
              <TransactionListItem key={item.id} {...item} />
            ))}
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
});
