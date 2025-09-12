import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import Button from '../common/Button';

interface DailyEarningsCardProps {
  todayEarnings: number;
  weeklyTarget: number;
  monthlyTarget: number;
}

const DailyEarningsCard: React.FC<DailyEarningsCardProps> = ({ 
  todayEarnings, 
  weeklyTarget, 
  monthlyTarget
}) => {
  const weeklyProgress = (todayEarnings * 7) / weeklyTarget;
  const monthlyProgress = (todayEarnings * 30) / monthlyTarget;

  return (
    <Card>
      <Text style={styles.title}>Daily Earnings Summary</Text>
      <View style={styles.earningsRow}>
        <Text style={styles.label}>Today's Earnings:</Text>
        <Text style={styles.earningsValue}>₹{todayEarnings}</Text>
      </View>
      
      <View style={styles.progressSection}>
        <Text style={styles.progressTitle}>Progress</Text>
        <View style={styles.progressItem}>
          <Text style={styles.progressLabel}>Weekly Target (₹{weeklyTarget})</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(weeklyProgress * 100, 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(weeklyProgress * 100)}%</Text>
        </View>
        
        <View style={styles.progressItem}>
          <Text style={styles.progressLabel}>Monthly Target (₹{monthlyTarget})</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(monthlyProgress * 100, 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(monthlyProgress * 100)}%</Text>
        </View>
      </View>
      
      <Button title="View Detailed Report" onPress={() => {}} variant="secondary" />
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  earningsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressItem: {
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});

export default DailyEarningsCard;
