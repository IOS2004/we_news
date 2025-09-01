import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import { Spacing } from '../../constants/theme';

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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    backgroundColor: '#d4edda',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#155724',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#27ae60',
  },
  card: {
    margin: 0,
    marginBottom: Spacing.xl,
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
});

export default EarningsSummary;
