import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Card from '../common/Card';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface EarningsSummaryProps {
  today: number;
  week: number;
  month: number;
}

const EarningsSummary: React.FC<EarningsSummaryProps> = ({ today, week, month }) => {
  const calculateGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card style={styles.card}>
      {/* Header with title and trending icon */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="trending-up" size={18} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Earnings Summary</Text>
        </View>
        <View style={styles.badge}>
          <View style={styles.badgeIcon}>
            <Ionicons name="flash" size={8} color={Colors.success} />
          </View>
          <Text style={styles.badgeText}>Active</Text>
        </View>
      </View>

      {/* Earnings Grid */}
      <View style={styles.earningsGrid}>
        {/* Today's Earnings */}
        <View style={styles.earningItem}>
          <View style={styles.earningCard}>
            <View style={styles.earningHeader}>
              <Text style={styles.earningLabel}>Today</Text>
              <View style={[styles.earningIndicator, { backgroundColor: Colors.success + '20' }]}>
                <Ionicons name="arrow-up" size={10} color={Colors.success} />
              </View>
            </View>
            <Text style={styles.earningValue}>{formatCurrency(today)}</Text>
            <View style={styles.growthContainer}>
              <Ionicons name="trending-up" size={8} color={Colors.success} />
              <Text style={[styles.growthText, { color: Colors.success }]}>+12.5%</Text>
            </View>
          </View>
        </View>

        {/* Week's Earnings */}
        <View style={styles.earningItem}>
          <View style={styles.earningCard}>
            <View style={styles.earningHeader}>
              <Text style={styles.earningLabel}>This Week</Text>
              <View style={[styles.earningIndicator, { backgroundColor: Colors.info + '20' }]}>
                <Ionicons name="arrow-up" size={10} color={Colors.info} />
              </View>
            </View>
            <Text style={styles.earningValue}>{formatCurrency(week)}</Text>
            <View style={styles.growthContainer}>
              <Ionicons name="trending-up" size={8} color={Colors.info} />
              <Text style={[styles.growthText, { color: Colors.info }]}>+8.2%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Monthly Earnings - Full Width */}
      <View style={styles.monthlyContainer}>
        <View style={styles.monthlyCard}>
          <View style={styles.monthlyHeader}>
            <View style={styles.monthlyTitleContainer}>
              <Text style={styles.monthlyLabel}>This Month</Text>
              <View style={styles.monthlyBadge}>
                <Ionicons name="star" size={8} color={Colors.warning} />
                <Text style={styles.monthlyBadgeText}>Best Month</Text>
              </View>
            </View>
            <View style={[styles.monthlyIndicator, { backgroundColor: Colors.accent3 + '20' }]}>
              <Ionicons name="arrow-up" size={12} color={Colors.accent3} />
            </View>
          </View>
          <Text style={styles.monthlyValue}>{formatCurrency(month)}</Text>
          <View style={styles.monthlyFooter}>
            <View style={styles.monthlyGrowth}>
              <Ionicons name="trending-up" size={10} color={Colors.accent3} />
              <Text style={[styles.growthText, { color: Colors.accent3, fontSize: Typography.fontSize.sm }]}>+15.7% from last month</Text>
            </View>
            <View style={styles.monthlyProgress}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '75%' }]} />
              </View>
              <Text style={styles.progressText}>75% of target</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 0,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '10',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.base,
    gap: 4,
  },
  badgeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.success,
    fontWeight: Typography.fontWeight.semibold,
  },
  earningsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  earningItem: {
    flex: 1,
  },
  earningCard: {
    padding: Spacing.md,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  earningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  earningLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  earningIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  growthText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  monthlyContainer: {
    marginTop: Spacing.xs,
  },
  monthlyCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  monthlyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  monthlyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  monthlyLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
  },
  monthlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '15',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  monthlyBadgeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.warning,
    fontWeight: Typography.fontWeight.semibold,
  },
  monthlyIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthlyValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  monthlyFooter: {
    gap: Spacing.sm,
  },
  monthlyGrowth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.xs,
  },
  monthlyProgress: {
    gap: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent3,
    borderRadius: 3,
  },
  progressText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
});

export default EarningsSummary;
