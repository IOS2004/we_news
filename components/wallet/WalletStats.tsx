import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import { Colors } from '../../constants/theme';

interface WalletStatsProps {
  totalIncome: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
  thisMonthEarnings: number;
}

const WalletStats: React.FC<WalletStatsProps> = ({
  totalIncome,
  totalWithdrawn,
  pendingWithdrawals,
  thisMonthEarnings
}) => {
  return (
    <Card>
      <Text style={styles.title}>Wallet Statistics</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹{totalIncome.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Income</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹{totalWithdrawn.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Withdrawn</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹{pendingWithdrawals.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹{thisMonthEarnings.toFixed(2)}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
      </View>

      <View style={styles.summarySection}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Net Earnings:</Text>
          <Text style={styles.summaryValue}>
            ₹{(totalIncome - totalWithdrawn).toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Available for Withdrawal:</Text>
          <Text style={styles.summaryValue}>
            ₹{(totalIncome - totalWithdrawn - pendingWithdrawals).toFixed(2)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    width: '48%',
    backgroundColor: Colors.surfaceSecondary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  summarySection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.success,
  },
});

export default WalletStats;
