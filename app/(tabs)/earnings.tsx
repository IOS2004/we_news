import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Header, ScreenWrapper, Card, Button } from '../../components/common';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export default function EarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  
  // Mock data - replace with actual data
  const earningsData = {
    today: { amount: 125, change: '+12%' },
    week: { amount: 875, change: '+8%' },
    month: { amount: 3250, change: '+15%' },
  };

  const quickActions = [
    { 
      id: 'watch-ads', 
      title: 'Watch Ads', 
      icon: 'play-circle', 
      earning: '+₹5-15', 
      iconColor: '#5B7FFF',
      backgroundColor: '#F0F2FF'
    },
    { 
      id: 'install-apps', 
      title: 'Install Apps', 
      icon: 'download', 
      earning: '+₹10-50', 
      iconColor: '#00C896',
      backgroundColor: '#F0FFF9'
    },
    { 
      id: 'daily-checkin', 
      title: 'Daily Check-in', 
      icon: 'calendar', 
      earning: '+₹20', 
      iconColor: '#F59E0B',
      backgroundColor: '#FFFBEB'
    },
    { 
      id: 'refer-friends', 
      title: 'Refer Friends', 
      icon: 'people', 
      earning: '+₹100', 
      iconColor: '#8B5CF6',
      backgroundColor: '#FAF5FF'
    },
  ];

  const recentTransactions = [
    { id: 1, type: 'Ad Reward', amount: '+₹15', time: '2 hours ago', icon: 'play-circle' },
    { id: 2, type: 'App Install', amount: '+₹25', time: '4 hours ago', icon: 'download' },
    { id: 3, type: 'Daily Bonus', amount: '+₹20', time: '1 day ago', icon: 'gift' },
    { id: 4, type: 'Referral Bonus', amount: '+₹100', time: '2 days ago', icon: 'people' },
  ];
  return (
    <ScreenWrapper style={styles.container}>
      <Header title="Earnings & Rewards" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Earnings Card - Modern Design */}
        <View style={styles.mainEarningsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.titleSection}>
              <Text style={styles.cardTitle}>Total Earnings</Text>
              <Text style={styles.cardSubtitle}>Your accumulated rewards</Text>
            </View>
            <TouchableOpacity style={styles.walletIconContainer}>
              <Ionicons name="wallet-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.earningsDisplay}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.earningsValue}>{earningsData[selectedPeriod].amount}</Text>
            <Text style={styles.decimalValue}>.00</Text>
          </View>

          <View style={styles.changeIndicator}>
            <View style={styles.changeIcon}>
              <Ionicons name="trending-up" size={16} color={Colors.success} />
            </View>
            <Text style={styles.changeText}>{earningsData[selectedPeriod].change} from last period</Text>
          </View>

          {/* Enhanced Period Selector */}
          <View style={styles.modernPeriodSelector}>
            {(['today', 'week', 'month'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.modernPeriodButton,
                  selectedPeriod === period && styles.modernPeriodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.modernPeriodText,
                  selectedPeriod === period && styles.modernPeriodTextActive
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Earn More</Text>
          <Text style={styles.sectionSubtitle}>Boost your earnings with these activities</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={[styles.actionItem, { backgroundColor: action.backgroundColor }]}
                activeOpacity={0.8}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name={action.icon as any} size={24} color={action.iconColor} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionEarning}>{action.earning}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Recent Transactions */}
        <Card style={styles.transactionsCard}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons name={transaction.icon as any} size={20} color={Colors.primary} />
              </View>
              <View style={styles.transactionContent}>
                <Text style={styles.transactionType}>{transaction.type}</Text>
                <Text style={styles.transactionTime}>{transaction.time}</Text>
              </View>
              <Text style={styles.transactionAmount}>{transaction.amount}</Text>
            </View>
          ))}
        </Card>

        {/* Modern Action Buttons */}
        
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 0,
  },
  scrollContainer: {
    paddingBottom: Spacing.xl * 2,
    paddingTop: Spacing.md,
  },
  
  // Modern Main Earnings Card
  mainEarningsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  titleSection: {
    flex: 1,
  },
  cardTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  walletIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.lg,
  },
  currencySymbol: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  earningsValue: {
    fontSize: Typography.fontSize['6xl'],
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.text,
    lineHeight: 48,
  },
  decimalValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '10',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xl,
  },
  changeIcon: {
    marginRight: Spacing.xs,
  },
  changeText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.success,
  },
  modernPeriodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xs,
    ...Shadows.sm,
  },
  modernPeriodButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernPeriodButtonActive: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  modernPeriodText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
  modernPeriodTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semibold,
  },

  // Modern Action Buttons
  modernActionContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  primaryActionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg + 2,
    paddingHorizontal: Spacing.md,
    ...Shadows.md,
    minHeight: 56,
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg + 2,
    paddingHorizontal: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    ...Shadows.sm,
    minHeight: 56,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  primaryActionText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
    textAlign: 'center',
  },
  secondaryActionText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
    textAlign: 'center',
  },
  
  // Level Card
  levelCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  levelBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  levelNumber: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnPrimary,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  levelSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  rewardsButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.warning}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginTop: Spacing.sm,
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.borderLight,
    borderRadius: 6,
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  
  // Sections
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  
  // Actions Card
  actionsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  actionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  actionEarning: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
  },
  
  // Transactions Card
  transactionsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  viewAllText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  transactionContent: {
    flex: 1,
  },
  transactionType: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success,
  },

  // Tier Slider Styles
  tierSlider: {
    marginBottom: Spacing.lg,
  },
  tierSliderContent: {
    paddingHorizontal: Spacing.md,
  },

  // New Clean Tier Card Styles
  tierCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  tierInfo: {
    flex: 1,
  },
  tierTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  tierSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  tierIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Current Tier Display
  currentTierDisplay: {
    marginBottom: Spacing.lg,
  },
  currentTierBadge: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  tierBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tierBadgeText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  tierBadgeName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: 2,
  },
  tierBadgeEarnings: {
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
    opacity: 0.9,
  },
  currentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  currentBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },

  // Progress Section
  progressSection: {
    marginBottom: Spacing.lg,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  progressPoints: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarTier: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 4,
  },
  progressFillTier: {
    height: '100%',
    borderRadius: 4,
  },

  // Benefits Section
  benefitsSection: {
    marginBottom: Spacing.lg,
  },
  benefitsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  benefitsList: {
    gap: Spacing.xs,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  benefitText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },

  // Next Tier Section
  nextTierSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.lg,
  },
  nextTierTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  nextTierPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  nextTierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  nextTierName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    flex: 1,
  },
  nextTierPrice: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },

  // No Subscription State
  noSubscriptionState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  noSubIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  noSubTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  noSubDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  subscribeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  subscribeButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});
