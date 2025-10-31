import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { DeveloperProvider } from '../contexts/DeveloperContext';
import { AuthProvider } from '../contexts/AuthContext';
import { AppModeProvider } from '../contexts/AppModeContext';
import { WalletProvider } from '../contexts/WalletContext';
import { toastConfig } from '../config/toastConfig';
import { initializeCashfree } from '../utils/cashfree';
import { logEnvironmentInfo } from '../config/environment';

export default function RootLayout() {
  // Initialize app services when app starts
  useEffect(() => {
    console.log('🚀 SammaWenewsPro App Starting...');
    
    // Log environment information
    logEnvironmentInfo();
    
    // Initialize CashFree SDK
    try {
      initializeCashfree();
      console.log('✅ CashFree SDK initialization completed');
    } catch (error) {
      console.error('❌ Failed to initialize CashFree SDK:', error);
    }
  }, []);
  return (
    <AuthProvider>
      <WalletProvider>
        <DeveloperProvider>
          <AppModeProvider initialMode="news">
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
      </WalletProvider>
    </AuthProvider>
  );
}
