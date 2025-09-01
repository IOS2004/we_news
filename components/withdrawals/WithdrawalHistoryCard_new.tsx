import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface WithdrawalHistory {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  transactionId?: string;
  bankAccount: string;
  processingDate?: string;
}

const WithdrawalHistoryCard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all');

  const withdrawalHistory: WithdrawalHistory[] = [
    {
      id: '1',
      amount: 1000,
      date: '2025-08-29',
      status: 'completed',
      transactionId: 'TXN123456789',
      bankAccount: '****1234',
      processingDate: '2025-08-30',
    },
    {
      id: '2',
      amount: 500,
      date: '2025-08-25',
      status: 'approved',
      transactionId: 'TXN123456788',
      bankAccount: '****1234',
      processingDate: '2025-08-26',
    },
    {
      id: '3',
      amount: 750,
      date: '2025-08-20',
      status: 'pending',
      bankAccount: '****1234',
    },
    {
      id: '4',
      amount: 300,
      date: '2025-08-15',
      status: 'rejected',
      bankAccount: '****1234',
    },
    {
      id: '5',
      amount: 1200,
      date: '2025-08-10',
      status: 'completed',
      transactionId: 'TXN123456787',
      bankAccount: '****1234',
      processingDate: '2025-08-11',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'approved':
        return 'time';
      case 'pending':
        return 'hourglass-outline';
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'approved':
        return Colors.info;
      case 'pending':
        return Colors.warning;
      case 'rejected':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const filteredHistory = selectedFilter === 'all' 
    ? withdrawalHistory 
    : withdrawalHistory.filter(item => item.status === selectedFilter);

  const renderHistoryItem = ({ item }: { item: WithdrawalHistory }) => (
    <View style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <View style={styles.itemLeft}>
          <View style={[styles.statusIcon, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Ionicons 
              name={getStatusIcon(item.status) as any} 
              size={20} 
              color={getStatusColor(item.status)} 
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemAmount}>₹{item.amount.toLocaleString()}</Text>
            <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
        </View>
        <View style={styles.itemRight}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.detailText}>Account: {item.bankAccount}</Text>
        {item.transactionId && (
          <Text style={styles.detailText}>Transaction ID: {item.transactionId}</Text>
        )}
        {item.processingDate && (
          <Text style={styles.detailText}>
            Processed: {new Date(item.processingDate).toLocaleDateString()}
          </Text>
        )}
      </View>
    </View>
  );

  const totalWithdrawn = withdrawalHistory
    .filter(item => item.status === 'completed')
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingAmount = withdrawalHistory
    .filter(item => item.status === 'pending' || item.status === 'approved')
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <View style={styles.container}>
      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>₹{totalWithdrawn.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Total Withdrawn</Text>
          <View style={styles.summaryIcon}>
            <Ionicons name="trending-down" size={16} color={Colors.success} />
          </View>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>₹{pendingAmount.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
          <View style={styles.summaryIcon}>
            <Ionicons name="time" size={16} color={Colors.warning} />
          </View>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{withdrawalHistory.length}</Text>
          <Text style={styles.summaryLabel}>Total Requests</Text>
          <View style={styles.summaryIcon}>
            <Ionicons name="document-text" size={16} color={Colors.info} />
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        <View style={styles.filterTabs}>
          {(['all', 'pending', 'completed', 'rejected'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, selectedFilter === filter && styles.activeFilterTab]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* History List */}
      <View style={styles.historyContainer}>
        <FlatList
          data={filteredHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>No transactions found</Text>
              <Text style={styles.emptyText}>
                {selectedFilter === 'all' 
                  ? 'You haven\'t made any withdrawal requests yet' 
                  : `No ${selectedFilter} transactions found`
                }
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },

  // Summary Grid
  summaryGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  summaryIcon: {
    marginTop: Spacing.xs,
  },

  // Filter Section
  filterContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
  activeFilterText: {
    color: Colors.textOnPrimary,
    fontWeight: Typography.fontWeight.semibold,
  },

  // History List
  historyContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  historyItem: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemAmount: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  itemDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    textTransform: 'capitalize',
  },
  itemDetails: {
    paddingLeft: 56,
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default WithdrawalHistoryCard;
