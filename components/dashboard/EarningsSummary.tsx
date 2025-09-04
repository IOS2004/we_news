import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import { Colors, Typography, Spacing } from '../../constants/theme';

interface EarningsSummaryProps {
  today: number;
  week: number;
  month: number;
}

const EarningsSummary: React.FC<EarningsSummaryProps> = ({ today, week, month }) => {
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings Summary</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Growing</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Today</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>₹{today.toFixed(2)}</Text>
          <View style={styles.greenDot} />
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>This Week</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>₹{week.toFixed(2)}</Text>
          <View style={styles.greenDot} />
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>This Month</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>₹{month.toFixed(2)}</Text>
          <View style={styles.greenDot} />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  badge: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.success,
    fontWeight: Typography.fontWeight.medium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
  },
});

export default EarningsSummary;
