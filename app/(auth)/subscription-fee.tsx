import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button, Header, ScreenWrapper } from '../../components/common';

export default function SubscriptionFeeScreen() {
  const handlePayment = () => {
    // For demo purposes, navigate to the main app after payment
    // In a real app, you would handle payment processing here
    router.replace('/(tabs)/home');
  };

  return (
    <ScreenWrapper>
      <Header title="Subscription Fee" canGoBack />
      <View style={styles.container}>
        <Text style={styles.title}>One-Time Joining Fee</Text>
        <Text style={styles.amount}>₹500</Text>
        <Text style={styles.description}>
          To activate your account, please pay the one-time joining fee.
        </Text>
        <Button title="Pay Now" onPress={handlePayment} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  amount: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
});
