import React, { useState, useRef } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
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
  const [selectedSubscription, setSelectedSubscription] = useState(0);
  const subscriptionScrollRef = useRef<ScrollView>(null);
  const { width: screenWidth } = Dimensions.get('window');

  // Mock subscriptions data - Mixed plan types
  const subscriptions = [
    {
      id: 'silver_1',
      name: 'Silver Plan #1',
      planType: 'silver',
      planColor: '#C0C0C0',
      purchaseDate: '2024-01-15',
      daysRemaining: 685,
      totalEarnings: 3200,
      monthlyGain: 350,
      referralTreeSize: 15,
      directReferrals: 3,
      currentLevel: 2,
      maxLevels: 5,
      referralLink: 'SLV123ABC',
      isActive: true,
      dailyEarning: 50
    },
    {
      id: 'gold_1',
      name: 'Gold Plan #1',
      planType: 'gold',
      planColor: '#FFD700',
      purchaseDate: '2024-03-10',
      daysRemaining: 630,
      totalEarnings: 4800,
      monthlyGain: 580,
      referralTreeSize: 25,
      directReferrals: 5,
      currentLevel: 3,
      maxLevels: 8,
      referralLink: 'GLD456DEF',
      isActive: true,
      dailyEarning: 100
    },
    {
      id: 'diamond_1',
      name: 'Diamond Plan #1',
      planType: 'diamond',
      planColor: '#B9F2FF',
      purchaseDate: '2024-02-20',
      daysRemaining: 665,
      totalEarnings: 7200,
      monthlyGain: 920,
      referralTreeSize: 42,
      directReferrals: 7,
      currentLevel: 4,
      maxLevels: 12,
      referralLink: 'DMD789GHI',
      isActive: true,
      dailyEarning: 200
    }
  ];

  const handleSubscriptionScroll = (event: any) => {
    const slideSize = screenWidth - (Spacing.lg * 2);
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setSelectedSubscription(index);
  };

  const scrollToSubscription = (index: number) => {
    const slideSize = screenWidth - (Spacing.lg * 2);
    subscriptionScrollRef.current?.scrollTo({
      x: index * slideSize,
      animated: true,
    });
    setSelectedSubscription(index);
  };

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

  const handleAddSubscription = () => {
    // Navigate to plans page to add new subscription
    handleNavigation('/(tabs)/plans');
  };

  const handleShareReferralLink = (referralLink: string) => {
    // Share referral link functionality
    console.log('Sharing referral link:', referralLink);
    // In real app, use sharing API
  };

  const handleViewReferralTree = (subscriptionId: string) => {
    // Navigate to referral tree view
    console.log('Viewing referral tree for subscription:', subscriptionId);
    // In real app, navigate to tree view page
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
            
            <TouchableOpacity style={styles.quickAccessCard} onPress={() => handleNavigation('/(tabs)/plans')}>
              <LinearGradient
                colors={[Colors.secondary, Colors.secondaryLight]}
                style={styles.quickAccessGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="diamond" size={32} color={Colors.textOnDark} />
              </LinearGradient>
              <Text style={styles.quickAccessLabel}>Plans</Text>
              <Text style={styles.quickAccessSubLabel}>Upgrade your plan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Earnings Summary */}
        <EarningsSummary today={50} week={350} month={1500} />

        {/* Total Wallet Balance - Moved above earnings */}
        <View style={styles.walletBalanceCard}>
          <View style={styles.walletSection}>
            <Text style={styles.walletLabel}>Total Wallet Balance</Text>
            <Text style={styles.walletAmount}>₹{subscriptions.reduce((sum, sub) => sum + sub.totalEarnings, 0).toLocaleString()}.00</Text>
            <Text style={styles.activePlansText}>
              {subscriptions.length} active subscription{subscriptions.length !== 1 ? 's' : ''} • ₹{subscriptions.reduce((sum, sub) => sum + sub.dailyEarning, 0)}/day
            </Text>
          </View>
          
          <View style={styles.walletActions}>
            <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.manageButton} onPress={() => handleNavigation('/(tabs)/plans')}>
              <Text style={styles.manageButtonText}>Manage Plans</Text>
              <Ionicons name="settings" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Plan Subscriptions */}
        <View style={styles.overviewSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Subscriptions</Text>
            <TouchableOpacity style={styles.addSubscriptionButton} onPress={handleAddSubscription}>
              <Ionicons name="add-circle" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          {/* Horizontal Subscription Slider */}
          <ScrollView
            ref={subscriptionScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleSubscriptionScroll}
            contentContainerStyle={styles.subscriptionSlider}
            style={styles.subscriptionScrollView}
          >
            {subscriptions.map((subscription, index) => (
              <View key={subscription.id} style={[styles.subscriptionCard, { width: screenWidth - (Spacing.lg * 2) }]}>
                {/* Subscription Header */}
                <View style={styles.subscriptionHeader}>
                  <View style={styles.planTitleRow}>
                    <View style={styles.planIndicator}>
                      <View style={[styles.planDot, { backgroundColor: subscription.isActive ? subscription.planColor : Colors.warning }]} />
                      <Text style={styles.subscriptionName}>{subscription.name}</Text>
                    </View>
                    <Text style={styles.daysRemaining}>{subscription.daysRemaining} days left</Text>
                  </View>
                  <View style={styles.planBadgeRow}>
                    <View style={[styles.planBadge, { backgroundColor: subscription.planColor }]}>
                      <Text style={styles.planBadgeText}>{subscription.planType.toUpperCase()}</Text>
                    </View>
                    <TouchableOpacity style={styles.menuButton}>
                      <Ionicons name="ellipsis-vertical" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Earnings and Progress */}
                <View style={styles.subscriptionContent}>
                  <View style={styles.earningsSection}>
                    <Text style={styles.earningsLabel}>Total Earnings</Text>
                    <View style={styles.earningsRow}>
                      <Text style={styles.earningsAmount}>₹{subscription.totalEarnings.toLocaleString()}</Text>
                      <Text style={styles.earningsDecimal}>.00</Text>
                    </View>
                    <View style={styles.monthlyGainContainer}>
                      <Ionicons name="trending-up" size={14} color={Colors.success} />
                      <Text style={styles.monthlyGain}>+₹{subscription.monthlyGain} this month</Text>
                      <Text style={styles.dailyEarning}>• ₹{subscription.dailyEarning}/day</Text>
                    </View>
                  </View>

                  {/* MLM Stats */}
                  <View style={styles.mlmStatsContainer}>
                    <View style={styles.mlmStatItem}>
                      <Text style={styles.mlmStatValue}>{subscription.directReferrals}</Text>
                      <Text style={styles.mlmStatLabel}>Direct Referrals</Text>
                    </View>
                    <View style={styles.mlmStatDivider} />
                    <View style={styles.mlmStatItem}>
                      <Text style={styles.mlmStatValue}>{subscription.referralTreeSize}</Text>
                      <Text style={styles.mlmStatLabel}>Team Size</Text>
                    </View>
                    <View style={styles.mlmStatDivider} />
                    <View style={styles.mlmStatItem}>
                      <Text style={styles.mlmStatValue}>L{subscription.currentLevel}</Text>
                      <Text style={styles.mlmStatLabel}>Current Level</Text>
                    </View>
                  </View>

                  {/* Level Progress */}
                  <View style={styles.levelProgressContainer}>
                    <Text style={styles.levelProgressTitle}>Level Progress</Text>
                    <View style={styles.levelProgressBar}>
                      <View style={[styles.levelProgressFill, { width: `${(subscription.currentLevel / subscription.maxLevels) * 100}%` }]} />
                    </View>
                    <Text style={styles.levelProgressText}>
                      Level {subscription.currentLevel} of {subscription.maxLevels} unlocked
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.subscriptionActions}>
                    <TouchableOpacity 
                      style={styles.referralButton} 
                      onPress={() => handleShareReferralLink(subscription.referralLink)}
                    >
                      <Ionicons name="share-social" size={16} color={Colors.primary} />
                      <Text style={styles.referralButtonText}>Share Link</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.treeButton} 
                      onPress={() => handleViewReferralTree(subscription.id)}
                    >
                      <Ionicons name="git-network" size={16} color={Colors.secondary} />
                      <Text style={styles.treeButtonText}>View Tree</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {subscriptions.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paginationDot,
                  { backgroundColor: index === selectedSubscription ? Colors.primary : Colors.textSecondary }
                ]}
                onPress={() => scrollToSubscription(index)}
                activeOpacity={0.7}
              />
            ))}
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
  planDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text,
  },
  planBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  planBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: '#000000',
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
    marginTop: Spacing.xs,
  },
  monthlyGain: {
    fontSize: Typography.fontSize.sm,
    color: Colors.success,
    fontWeight: Typography.fontWeight.medium,
  },
  dailyEarning: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: Spacing.sm,
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
  activePlansText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
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

  // New MLM Subscription Styles
  walletBalanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  walletActions: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  manageButton: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  manageButtonText: {
    fontSize: Typography.fontSize.sm,
    color: '#ffffff',
    fontWeight: Typography.fontWeight.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  addSubscriptionButton: {
    padding: Spacing.xs,
  },
  subscriptionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.md,
    ...Shadows.sm, // Reduced shadow for cleaner look
  },
  subscriptionScrollView: {
    marginBottom: Spacing.md,
  },
  subscriptionSlider: {
    paddingHorizontal: Spacing.lg,
  },
  subscriptionHeader: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  planTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  planIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  planBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planTitleContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  subscriptionName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  subscriptionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  daysRemaining: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  subscriptionContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  mlmStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: '#f8f9fa', // Subtle background
    borderRadius: BorderRadius.lg,
    marginHorizontal: -Spacing.sm, // Extend to card edges
  },
  mlmStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  mlmStatValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  mlmStatLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
  },
  mlmStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
    opacity: 0.3,
  },
  levelProgressContainer: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  levelProgressTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  levelProgressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  levelProgressText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  subscriptionActions: {
    flexDirection: 'row',
    marginTop: Spacing.xl,
    gap: Spacing.md,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  referralButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  referralButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  treeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  treeButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.secondary,
    fontWeight: Typography.fontWeight.semibold,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    padding: Spacing.sm, // Touch area
  },
  
  // Enhanced Notifications Styles
});
