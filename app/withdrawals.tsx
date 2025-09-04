import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScreenWrapper } from '../components/common';
import { WithdrawalRequestCard, WithdrawalHistoryCard } from '../components/withdrawals';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

export default function WithdrawalsScreen() {
  const [activeTab, setActiveTab] = useState<'request' | 'history'>('request');

  // Redirect to separate pages for better UX
  React.useEffect(() => {
    // Auto-navigate to withdrawal request page
    router.replace('/withdrawal-request');
  }, []);

  return (
    <ScreenWrapper style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdrawals</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'request' && styles.activeTab]}
          onPress={() => setActiveTab('request')}
        >
          <Ionicons 
            name="card-outline" 
            size={20} 
            color={activeTab === 'request' ? Colors.textOnPrimary : Colors.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'request' && styles.activeTabText]}>
            New Request
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons 
            name="time-outline" 
            size={20} 
            color={activeTab === 'history' ? Colors.textOnPrimary : Colors.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'request' ? <WithdrawalRequestCard /> : <WithdrawalHistoryCard />}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.primary,
    ...Shadows.md,
  },
  backButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.whiteTransparent,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnPrimary,
  },
  helpButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.whiteTransparent,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    ...Shadows.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  activeTab: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  tabText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.textOnPrimary,
    fontWeight: Typography.fontWeight.semibold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
});
