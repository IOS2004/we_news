import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { DeveloperProvider } from '../contexts/DeveloperContext';
import { AuthProvider } from '../contexts/AuthContext';
import { AppModeProvider } from '../contexts/AppModeContext';
import { WalletProvider } from '../contexts/WalletContext';
import { AdMobProvider } from '../contexts/AdMobContext';
import { toastConfig } from '../config/toastConfig';

// Import web CSS
if (Platform.OS === 'web') {
  require('./web-root.css');
}

export default function RootLayout() {
  // Web-specific setup
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Set document title
      if (typeof document !== 'undefined') {
        document.title = 'WeNews - Stay Informed, Earn Rewards';
      }
      
      // Set viewport meta for proper scaling
      if (typeof document !== 'undefined') {
        let viewport = document.querySelector('meta[name=viewport]');
        if (!viewport) {
          viewport = document.createElement('meta');
          viewport.setAttribute('name', 'viewport');
          document.head.appendChild(viewport);
        }
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      
      // Inject web-specific styles for better layout
      if (typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.textContent = `
          body {
            overflow-x: hidden;
            background-color: #f0f2f5;
          }
          #root {
            display: flex;
            justify-content: center;
            min-height: 100vh;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  const content = (
    <AdMobProvider>
      <AuthProvider>
        <WalletProvider>
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
        </WalletProvider>
      </AuthProvider>
    </AdMobProvider>
  );

  // Wrap in web-specific container for desktop
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webRoot}>
        <View style={styles.webContainer}>
          {content}
        </View>
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  webContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#ffffff',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    } as any),
  },
});
