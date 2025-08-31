import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import Button from '../common/Button';

interface OverviewCardProps {
  balance: number;
  earnings: number;
  plan: string;
  onWithdraw?: () => void;
  onUpgradePlan?: () => void;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ 
  balance, 
  earnings, 
  plan, 
  onWithdraw = () => {}, 
  onUpgradePlan = () => {} 
}) => {
  return (
    <Card>
      <View style={styles.row}>
        <Text style={styles.label}>Wallet Balance</Text>
        <Text style={styles.value}>₹{balance.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Total Earnings</Text>
        <Text style={styles.value}>₹{earnings.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Current Plan</Text>
        <Text style={styles.value}>{plan}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Withdraw" onPress={onWithdraw} variant="secondary" />
        <View style={{ width: 16 }} />
        <Button title="Upgrade Plan" onPress={onUpgradePlan} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});

export default OverviewCard;
