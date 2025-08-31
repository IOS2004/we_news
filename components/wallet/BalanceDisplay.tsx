import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';

interface BalanceDisplayProps {
  balance: number;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance }) => {
  return (
    <Card>
      <Text style={styles.label}>Current Wallet Balance</Text>
      <Text style={styles.balance}>₹{balance.toFixed(2)}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  balance: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default BalanceDisplay;
