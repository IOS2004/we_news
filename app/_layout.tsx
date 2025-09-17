import { Stack } from 'expo-router';
import React from 'react';
import Toast from 'react-native-toast-message';
import { DeveloperProvider } from '../contexts/DeveloperContext';
import { AuthProvider } from '../contexts/AuthContext';
import { AppModeProvider } from '../contexts/AppModeContext';
import { toastConfig } from '../config/toastConfig';

export default function RootLayout() {
  return (
    <AuthProvider>
      <DeveloperProvider>
        <AppModeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="developer-settings" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="edit-profile" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="labels" />
            <Stack.Screen name="withdrawals" />
            <Stack.Screen name="withdrawal-request" />
            <Stack.Screen name="withdrawal-history" />
            <Stack.Screen name="add-money" />
            <Stack.Screen name="redeem" />
          </Stack>
          {/* Toast Component with custom config */}
          <Toast config={toastConfig} />
        </AppModeProvider>
      </DeveloperProvider>
    </AuthProvider>
  );
}
