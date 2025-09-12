import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, ScreenWrapper } from '../../components/common';
import { EarningsSummary, OverviewCard } from '../../components/dashboard';
import { DashboardNotifications, QuickActions, RecentTransactions } from '../../components/dashboard';
import { AdPlaceholder } from '../../components/ads';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

const notifications = [
  { id: '1', title: 'Daily earnings credited', message: '₹50 has been added to your wallet', time: '2 hours ago' },
  { id: '2', title: 'New ad videos available', message: '5 new videos ready to watch', time: '4 hours ago' },
  { id: '3', title: 'Level reward unlocked', message: 'You\'ve reached Level 3!', time: '1 day ago' },
];

export default function HomeScreen() {
  const { user } = useAuth();

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const handleWatchAds = () => {
    // Navigate to ad watching section
    console.log('Navigate to ad watching');
  };

  const handleInstallApps = () => {
    // Navigate to partner apps
    console.log('Navigate to partner apps');
  };

  const handleWithdraw = () => {
    handleNavigation('/withdrawals');
  };

  const handleUpgradePlan = () => {
    handleNavigation('/plans');
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const handleViewAllTransactions = () => {
    router.push('/(tabs)/wallet');
  };

  return (
    <ScreenWrapper style={styles.screenWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Clean Minimal Header */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.greetingText}>Hi, {user?.firstName || 'User'}!</Text>
        </View>
        
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={22} color={Colors.textSecondary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Banner Ad Placeholder - Replacing News Highlight */}
        <AdPlaceholder onAdPress={() => console.log('Ad clicked')} />

        {/* Enhanced Quick Access Section */}
        <View style={styles.quickAccessSection}>
          <Text style={styles.quickAccessTitle}>What would you like to do?</Text>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity style={styles.quickAccessCard} onPress={() => handleNavigation('/(tabs)/earnings')}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryLight]}
                style={styles.quickAccessGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="trending-up" size={32} color={Colors.textOnDark} />
              </LinearGradient>
              <Text style={styles.quickAccessLabel}>Earnings</Text>
              <Text style={styles.quickAccessSubLabel}>Track your progress</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAccessCard} onPress={() => handleNavigation('/(tabs)/news')}>
              <LinearGradient
                colors={[Colors.secondary, Colors.secondaryLight]}
                style={styles.quickAccessGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="newspaper" size={32} color={Colors.textOnDark} />
              </LinearGradient>
              <Text style={styles.quickAccessLabel}>News</Text>
              <Text style={styles.quickAccessSubLabel}>Stay updated</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Earnings Summary */}
        <EarningsSummary today={50} week={350} month={1500} />

        {/* Dashboard Card - Exact Match to Design */}
        <View style={styles.overviewSection}>
          <View style={styles.dashboardCard}>
            {/* Plan Header with dot and menu */}
            <View style={styles.planHeader}>
              <View style={styles.planIndicator}>
                <View style={styles.planDot} />
                <Text style={styles.planName}>Silver Plan</Text>
              </View>
              <TouchableOpacity style={styles.menuButton}>
                <Ionicons name="menu" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Total Earnings Section */}
            <View style={styles.earningsSection}>
              <Text style={styles.earningsLabel}>Total Earnings</Text>
              <View style={styles.earningsRow}>
                <Text style={styles.earningsAmount}>₹5,000</Text>
                <Text style={styles.earningsDecimal}>.00</Text>
              </View>
              <View style={styles.monthlyGainContainer}>
                <Ionicons name="trending-up" size={14} color={Colors.success} />
                <Text style={styles.monthlyGain}>+₹500 this month</Text>
              </View>
            </View>

            {/* Wallet Balance Section */}
            <View style={styles.walletSection}>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={styles.walletAmount}>₹1,500.00</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
                <Text style={styles.withdrawButtonText}>Withdraw</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgradePlan}>
                <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Enhanced Quick Actions */}
        <QuickActions
          onWatchAds={handleWatchAds}
          onInstallApps={handleInstallApps}
          onViewEarnings={() => handleNavigation('/(tabs)/earnings')}
          onViewLabels={() => handleNavigation('/labels')}
        />

        {/* Recent Transactions */}
        <RecentTransactions 
          onViewMore={handleViewAllTransactions}
          maxItems={4}
        />

        {/* Enhanced Notifications */}
        <DashboardNotifications notifications={notifications} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  profileButton: {
    padding: 0,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  headerStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  headerLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  headerLevelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  notificationButton: {
    padding: Spacing.xs,
    position: 'relative',
    marginLeft: Spacing.xs,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
  },
  container: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  
  // Enhanced Quick Access Section
  quickAccessSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  quickAccessTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickAccessCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  quickAccessGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quickAccessLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  quickAccessSubLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  
  // Dashboard Card Styles - Exact Match to Design
  dashboardCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    ...Shadows.md,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  planIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  planDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text,
  },
  planName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  menuButton: {
    padding: Spacing.xs,
  },
  earningsSection: {
    marginBottom: Spacing.lg,
  },
  earningsLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  earningsAmount: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    lineHeight: 40,
  },
  earningsDecimal: {
    fontSize: Typography.fontSize.xl,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  monthlyGainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  monthlyGain: {
    fontSize: Typography.fontSize.sm,
    color: Colors.success,
    fontWeight: Typography.fontWeight.medium,
  },
  walletSection: {
    marginBottom: Spacing.xl,
  },
  walletLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  walletAmount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  upgradeButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  upgradeButtonText: {
    fontSize: Typography.fontSize.sm,
    color: '#ffffff',
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Enhanced Overview Section (old styles now removed)
  overviewSection: {
    paddingHorizontal: 0, // Remove horizontal padding since card has its own
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'left',
  },
  
  // Enhanced Notifications Styles
});
