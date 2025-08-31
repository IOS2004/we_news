import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Header, ScreenWrapper } from '../components/common';
import { 
  SecuritySettings, 
  NotificationSettings, 
  AppSettings,
  SupportSection 
} from '../components/settings';

export default function SettingsScreen() {
  return (
    <ScreenWrapper>
      <Header title="Settings" canGoBack />
      <ScrollView contentContainerStyle={styles.container}>
        <SecuritySettings />
        <NotificationSettings />
        <AppSettings />
        <SupportSection />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});
