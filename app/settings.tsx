import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Header, ScreenWrapper } from '../components/common';
import SecuritySettings from '../components/settings/SecuritySettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import AppSettings from '../components/settings/AppSettings';
import SupportSection from '../components/settings/SupportSection';
import { Spacing } from '../constants/theme';

export default function SettingsScreen() {
  return (
    <ScreenWrapper>
      <Header title="Settings" canGoBack />
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
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
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.base,
  },
});
