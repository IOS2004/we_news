import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScreenWrapper } from '../components/common';
import { WithdrawalHistoryCard } from '../components/withdrawals';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

// Mock withdrawal history data
const mockWithdrawalHistory = [
  {
    id: '1',
    amount: 500,
    date: '2024-01-20',
    status: 'completed' as const,
    method: 'Bank Transfer',
    transactionId: 'TXN123456',
    accountNumber: '****1234',
  },
  {
    id: '2',
    amount: 300,
    date: '2024-01-18',
    status: 'pending' as const,
    method: 'UPI',
    transactionId: 'TXN123457',
    accountNumber: 'user@upi',
  },
  {
    id: '3',
    amount: 750,
    date: '2024-01-15',
    status: 'completed' as const,
    method: 'Bank Transfer',
    transactionId: 'TXN123458',
    accountNumber: '****5678',
  },
  {
    id: '4',
    amount: 200,
    date: '2024-01-12',
    status: 'failed' as const,
    method: 'UPI',
    transactionId: 'TXN123459',
    accountNumber: 'user@upi',
  },
  {
    id: '5',
    amount: 400,
    date: '2024-01-10',
    status: 'completed' as const,
    method: 'Bank Transfer',
    transactionId: 'TXN123460',
    accountNumber: '****9012',
  },
];

export default function WithdrawalHistoryScreen() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const filteredHistory = filterStatus === 'all' 
    ? mockWithdrawalHistory 
    : mockWithdrawalHistory.filter(item => item.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return Colors.success;
      case 'pending': return Colors.warning;
      case 'failed': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'failed': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const renderHistoryItem = ({ item }: { item: typeof mockWithdrawalHistory[0] }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyItemHeader}>
        <View style={styles.amountSection}>
          <Text style={styles.historyAmount}>₹{item.amount}</Text>
          <Text style={styles.historyDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Ionicons 
            name={getStatusIcon(item.status) as any} 
            size={16} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.historyItemDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Method:</Text>
          <Text style={styles.detailValue}>{item.method}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account:</Text>
          <Text style={styles.detailValue}>{item.accountNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction ID:</Text>
          <Text style={styles.detailValue}>{item.transactionId}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenWrapper style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdrawal History</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {mockWithdrawalHistory.filter(h => h.status === 'completed').length}
            </Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {mockWithdrawalHistory.filter(h => h.status === 'pending').length}
            </Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              ₹{mockWithdrawalHistory
                .filter(h => h.status === 'completed')
                .reduce((sum, h) => sum + h.amount, 0)}
            </Text>
            <Text style={styles.summaryLabel}>Total Amount</Text>
          </View>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {(['all', 'completed', 'pending', 'failed'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filterStatus === status && styles.activeFilterButton
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[
                styles.filterButtonText,
                filterStatus === status && styles.activeFilterButtonText
              ]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* History List */}
      <View style={styles.content}>
        {filteredHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyStateTitle}>No Withdrawals Found</Text>
            <Text style={styles.emptyStateText}>
              {filterStatus === 'all' 
                ? "You haven't made any withdrawals yet." 
                : `No ${filterStatus} withdrawals found.`}
            </Text>
            <TouchableOpacity 
              style={styles.newWithdrawalButton}
              onPress={() => router.push('/withdrawal-request')}
            >
              <Text style={styles.newWithdrawalButtonText}>Make New Withdrawal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.primary,
    ...Shadows.md,
  },
  backButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.whiteTransparent,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnPrimary,
  },
  helpButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.whiteTransparent,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  filterContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  activeFilterButtonText: {
    color: Colors.textOnPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  listContainer: {
    paddingBottom: Spacing.xl,
  },
  historyItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  amountSection: {
    flex: 1,
  },
  historyAmount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  historyDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  historyItemDetails: {
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
  },
  emptyStateTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.fontSize.base * 1.5,
  },
  newWithdrawalButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  newWithdrawalButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
