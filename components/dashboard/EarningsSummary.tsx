import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';

interface EarningsSummaryProps {
  today: number;
  week: number;
  month: number;
}

const EarningsSummary: React.FC<EarningsSummaryProps> = ({ today, week, month }) => {
  return (
    <Card>
      <Text style={styles.title}>Earnings Summary</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Today</Text>
        <Text style={styles.value}>₹{today.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>This Week</Text>
        <Text style={styles.value}>₹{week.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>This Month</Text>
        <Text style={styles.value}>₹{month.toFixed(2)}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default EarningsSummary;
