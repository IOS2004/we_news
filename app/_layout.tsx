import { Stack } from 'expo-router';
import React from 'react';
import { DeveloperProvider } from '../contexts/DeveloperContext';

export default function RootLayout() {
  return (
    <DeveloperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="developer-settings" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="plans" />
        <Stack.Screen name="labels" />
        <Stack.Screen name="withdrawals" />
        <Stack.Screen name="withdrawal-request" />
        <Stack.Screen name="withdrawal-history" />
        <Stack.Screen name="add-money" />
        <Stack.Screen name="redeem" />
      </Stack>
    </DeveloperProvider>
  );
}
