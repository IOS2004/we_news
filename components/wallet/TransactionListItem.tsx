import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TransactionListItemProps {
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  description: string;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ type, amount, date, description }) => {
  const isCredit = type === 'credit';
  const iconName = isCredit ? 'arrow-up-circle' : 'arrow-down-circle';
  const iconColor = isCredit ? 'green' : 'red';
  const amountPrefix = isCredit ? '+' : '-';

  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={32} color={iconColor} />
      <View style={styles.detailsContainer}>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={[styles.amount, { color: iconColor }]}>
        {amountPrefix}₹{amount.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionListItem;
