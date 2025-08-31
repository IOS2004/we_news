import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Button, Header, ScreenWrapper } from '../../components/common';
import { BalanceDisplay, TransactionListItem, WalletStats } from '../../components/wallet';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  description: string;
  status?: 'completed' | 'pending';
}

const dummyTransactions: Transaction[] = [
  { id: '1', type: 'credit', amount: 50, date: '2025-08-31', description: 'Daily Earnings', status: 'completed' },
  { id: '2', type: 'debit', amount: 200, date: '2025-08-30', description: 'Withdrawal', status: 'completed' },
  { id: '3', type: 'credit', amount: 10, date: '2025-08-29', description: 'Ad Video Reward', status: 'completed' },
  { id: '4', type: 'credit', amount: 50, date: '2025-08-28', description: 'Daily Earnings', status: 'completed' },
  { id: '5', type: 'credit', amount: 25, date: '2025-08-27', description: 'Referral Bonus', status: 'completed' },
  { id: '6', type: 'credit', amount: 500, date: '2025-08-26', description: 'Level Reward', status: 'completed' },
  { id: '7', type: 'debit', amount: 100, date: '2025-08-25', description: 'Withdrawal Request', status: 'pending' },
];

export default function WalletScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const handleWithdrawal = () => {
    router.push('/withdrawals');
  };

  const filteredTransactions = selectedFilter === 'all' 
    ? dummyTransactions 
    : dummyTransactions.filter(t => t.type === selectedFilter);

  const totalIncome = dummyTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = dummyTransactions
    .filter(t => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <ScreenWrapper>
      <Header title="Wallet" />
      
      <BalanceDisplay balance={1500} />
      
      <WalletStats 
        totalIncome={totalIncome}
        totalWithdrawn={totalWithdrawn}
        pendingWithdrawals={100}
        thisMonthEarnings={650}
      />

      <View style={styles.actionButtons}>
        <Button title="Request Withdrawal" onPress={handleWithdrawal} />
        <Button 
          title="View Withdrawal History" 
          onPress={() => router.push('/withdrawals')} 
          variant="secondary" 
        />
      </View>

      <View style={styles.transactionSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          <View style={styles.filterButtons}>
            <Button 
              title="All" 
              onPress={() => setSelectedFilter('all')}
              variant={selectedFilter === 'all' ? 'primary' : 'secondary'}
            />
            <Button 
              title="Credit" 
              onPress={() => setSelectedFilter('credit')}
              variant={selectedFilter === 'credit' ? 'primary' : 'secondary'}
            />
            <Button 
              title="Debit" 
              onPress={() => setSelectedFilter('debit')}
              variant={selectedFilter === 'debit' ? 'primary' : 'secondary'}
            />
          </View>
        </View>

        <FlatList
          data={filteredTransactions}
          renderItem={({ item }) => <TransactionListItem {...item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  actionButtons: {
    marginHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  transactionSection: {
    flex: 1,
    marginTop: 16,
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
