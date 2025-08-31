import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Header, ScreenWrapper } from '../components/common';
import { WithdrawalRequestCard, WithdrawalHistoryCard } from '../components/withdrawals';

export default function WithdrawalsScreen() {
  return (
    <ScreenWrapper>
      <Header title="Withdrawals" canGoBack />
      <ScrollView contentContainerStyle={styles.container}>
        <WithdrawalRequestCard />
        <WithdrawalHistoryCard />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});
