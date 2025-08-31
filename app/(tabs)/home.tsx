import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, ScreenWrapper } from '../../components/common';
import { EarningsSummary, NewsHighlightReel, OverviewCard } from '../../components/dashboard';
import { DashboardNotifications, QuickActions } from '../../components/dashboard';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

const dummyNews = [
  { id: '1', title: 'Politics News Headline 1', thumbnail: 'https://picsum.photos/200' },
  { id: '2', title: 'Business News Headline 2', thumbnail: 'https://picsum.photos/201' },
  { id: '3', title: 'Tech News Headline 3', thumbnail: 'https://picsum.photos/202' },
  { id: '4', title: 'Entertainment News Headline 4', thumbnail: 'https://picsum.photos/203' },
];

const notifications = [
  { id: '1', title: 'Daily earnings credited', message: '₹50 has been added to your wallet', time: '2 hours ago' },
  { id: '2', title: 'New ad videos available', message: '5 new videos ready to watch', time: '4 hours ago' },
  { id: '3', title: 'Level reward unlocked', message: 'You\'ve reached Level 3!', time: '1 day ago' },
];

export default function HomeScreen() {
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

  return (
    <ScreenWrapper style={styles.screenWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <Ionicons name="person-circle-outline" size={32} color={Colors.textOnDark} />
        </TouchableOpacity>
        
        <View style={styles.rightSection}>
          <View style={styles.statusIndicators}>
            {/* Money Badge */}
            <View style={styles.moneyBadge}>
              <Ionicons name="wallet" size={16} color={Colors.textOnDark} />
              <Text style={styles.moneyText}>₹25000.0</Text>
            </View>
            
            {/* Level Badge */}
            <View style={styles.levelStatusBadge}>
              <Ionicons name="trending-up" size={16} color={Colors.textOnDark} />
              <Text style={styles.levelStatusText}>Level 3</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.textOnDark} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* What are you looking for? */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>What are you looking for?</Text>
          <View style={styles.categoryGrid}>
            <TouchableOpacity style={styles.categoryCard} onPress={() => handleNavigation('/(tabs)/earnings')}>
              <View style={styles.categoryImagePlaceholder}>
                <Ionicons name="trending-up" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.categoryLabel}>Earnings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.categoryCard} onPress={() => handleNavigation('/(tabs)/news')}>
              <View style={styles.categoryImagePlaceholder}>
                <Ionicons name="newspaper" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.categoryLabel}>News</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Overview Cards Section */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Your Dashboard</Text>
          <OverviewCard 
            balance={1500} 
            earnings={5000} 
            plan="Silver"
            onWithdraw={handleWithdraw}
            onUpgradePlan={handleUpgradePlan}
          />
        </View>

        {/* Earnings Summary */}
        <EarningsSummary today={50} week={350} month={1500} />

        {/* Quick Actions */}
        <QuickActions
          onWatchAds={handleWatchAds}
          onInstallApps={handleInstallApps}
          onViewEarnings={() => handleNavigation('/(tabs)/earnings')}
          onViewLabels={() => handleNavigation('/labels')}
        />

        {/* Investment Status */}
        <View style={styles.investmentStatus}>
          <Text style={styles.sectionTitle}>Today's Investment</Text>
          <View style={styles.investmentCard}>
            <View style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>Plan:</Text>
              <Text style={styles.investmentValue}>Silver (₹500)</Text>
            </View>
            <View style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>Daily Return:</Text>
              <Text style={styles.investmentValue}>₹4.00 (0.8%)</Text>
            </View>
            <View style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>Status:</Text>
              <Text style={[styles.investmentValue, styles.activeStatus]}>Active</Text>
            </View>
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.levelProgress}>
          <Text style={styles.sectionTitle}>Level Progress</Text>
          <View style={styles.levelCard}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>L3</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>Silver Tier</Text>
              <Text style={styles.levelDescription}>8 more referrals to Level 4</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <DashboardNotifications notifications={notifications} />

        {/* News Highlight */}
        <NewsHighlightReel articles={dummyNews} />

        {/* Investment Status */}
        <View style={styles.investmentStatus}>
          <Text style={styles.sectionTitle}>Today's Investment</Text>
          <View style={styles.investmentCard}>
            <View style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>Plan:</Text>
              <Text style={styles.investmentValue}>Silver (₹500)</Text>
            </View>
            <View style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>Daily Return:</Text>
              <Text style={styles.investmentValue}>₹4.00 (0.8%)</Text>
            </View>
            <View style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>Status:</Text>
              <Text style={[styles.investmentValue, styles.activeStatus]}>Active</Text>
            </View>
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.levelProgress}>
          <Text style={styles.sectionTitle}>Level Progress</Text>
          <View style={styles.levelCard}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>L3</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>Silver Tier</Text>
              <Text style={styles.levelDescription}>8 more referrals to Level 4</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
              </View>
            </View>
          </View>
        </View>
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
  },
  profileButton: {
    padding: Spacing.xs,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  moneyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  moneyText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnDark,
  },
  levelStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  levelStatusText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnDark,
  },
  notificationButton: {
    padding: Spacing.xs,
  },
  container: {
    paddingBottom: Spacing.xl,
  },
  categorySection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  categoryImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  overviewSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  investmentStatus: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  investmentCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  investmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  investmentLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textSecondary,
  },
  investmentValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  activeStatus: {
    color: Colors.success,
    fontWeight: Typography.fontWeight.bold,
  },
  levelProgress: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  levelCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.md,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  levelText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnPrimary,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  levelDescription: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.sm,
  },
});
