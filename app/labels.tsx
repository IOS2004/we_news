import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Header, ScreenWrapper, Card } from '../components/common';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';

export default function LabelsScreen() {
  const [activeTab, setActiveTab] = useState<'rewards' | 'achievements'>('rewards');

  // Mock data
  const availableRewards = [
    {
      id: 1,
      title: 'Premium Membership',
      description: '30 days of premium features',
      points: 500,
      category: 'subscription',
      image: 'https://picsum.photos/400/400?random=10',
      available: true,
    },
    {
      id: 2,
      title: 'Amazon Gift Card',
      description: '₹100 Amazon voucher',
      points: 800,
      category: 'voucher',
      image: 'https://picsum.photos/400/400?random=11',
      available: true,
    },
    {
      id: 3,
      title: 'Exclusive Badge',
      description: 'Silver tier exclusive badge',
      points: 300,
      category: 'badge',
      image: 'https://picsum.photos/400/400?random=12',
      available: false,
    },
    {
      id: 4,
      title: 'Cash Bonus',
      description: '₹50 direct to wallet',
      points: 600,
      category: 'cash',
      image: 'https://picsum.photos/400/400?random=13',
      available: true,
    },
  ];

  const achievements = [
    {
      id: 1,
      title: 'Early Bird',
      description: 'Complete daily check-in for 7 days',
      icon: 'sunrise',
      completed: true,
      progress: 7,
      total: 7,
      reward: '+50 points',
    },
    {
      id: 2,
      title: 'Video Master',
      description: 'Watch 100 ad videos',
      icon: 'play-circle',
      completed: false,
      progress: 67,
      total: 100,
      reward: '+100 points',
    },
    {
      id: 3,
      title: 'Referral Hero',
      description: 'Refer 10 friends',
      icon: 'people',
      completed: false,
      progress: 3,
      total: 10,
      reward: '+200 points',
    },
    {
      id: 4,
      title: 'News Reader',
      description: 'Read 50 news articles',
      icon: 'newspaper',
      completed: true,
      progress: 50,
      total: 50,
      reward: '+75 points',
    },
  ];

  const userStats = {
    totalPoints: 1250,
    availablePoints: 850,
    level: 3,
    nextLevelPoints: 2000,
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'subscription': return 'star';
      case 'voucher': return 'gift';
      case 'badge': return 'medal';
      case 'cash': return 'cash';
      default: return 'gift';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'subscription': return Colors.primary;
      case 'voucher': return Colors.warning;
      case 'badge': return Colors.secondary;
      case 'cash': return Colors.success;
      default: return Colors.textSecondary;
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Labels</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>
      </View>      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Header - Modern Dashboard Style */}
        <View style={styles.statsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.titleSection}>
              <Text style={styles.cardTitle}>Available Points</Text>
              <Text style={styles.cardSubtitle}>Ready to redeem rewards</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>L{userStats.level}</Text>
            </View>
          </View>

          <View style={styles.pointsDisplay}>
            <Text style={styles.pointsValue}>{userStats.availablePoints}</Text>
            <Text style={styles.pointsLabel}>points</Text>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Progress to Level {userStats.level + 1}</Text>
              <Text style={styles.progressText}>
                {userStats.totalPoints} / {userStats.nextLevelPoints}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                style={[
                  styles.progressFill, 
                  { width: `${(userStats.totalPoints / userStats.nextLevelPoints) * 100}%` }
                ]}
              />
            </View>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'rewards' && styles.activeTab]}
            onPress={() => setActiveTab('rewards')}
          >
            <Text style={[styles.tabText, activeTab === 'rewards' && styles.activeTabText]}>
              Rewards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
            onPress={() => setActiveTab('achievements')}
          >
            <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
              Achievements
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'rewards' ? (
          <View style={styles.rewardsContainer}>
            {availableRewards.map((reward) => (
              <View key={reward.id} style={styles.rewardCard}>
                <View style={styles.rewardContent}>
                  <Image 
                    source={{ uri: reward.image }} 
                    style={styles.rewardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.rewardDetails}>
                    <Text style={styles.rewardTitle}>{reward.title}</Text>
                    <Text style={styles.rewardDescription}>{reward.description}</Text>
                    
                    <View style={styles.rewardFooter}>
                      <View style={styles.pointsContainer}>
                        <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(reward.category) + '15' }]}>
                          <Ionicons 
                            name={getCategoryIcon(reward.category) as any} 
                            size={16} 
                            color={getCategoryColor(reward.category)} 
                          />
                        </View>
                        <Text style={styles.rewardPoints}>{reward.points} points</Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={[
                          styles.redeemButton,
                          !reward.available && styles.redeemButtonDisabled
                        ]}
                        disabled={!reward.available}
                      >
                        <Text style={[
                          styles.redeemButtonText,
                          !reward.available && styles.redeemButtonTextDisabled
                        ]}>
                          {reward.available ? 'Redeem' : 'Locked'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementContent}>
                  <View style={[
                    styles.achievementIcon,
                    { backgroundColor: achievement.completed ? Colors.success + '15' : Colors.textSecondary + '15' }
                  ]}>
                    <Ionicons 
                      name={achievement.icon as any} 
                      size={28} 
                      color={achievement.completed ? Colors.success : Colors.textSecondary} 
                    />
                  </View>
                  
                  <View style={styles.achievementInfo}>
                    <View style={styles.achievementTitleRow}>
                      <Text style={styles.achievementTitle}>{achievement.title}</Text>
                      {achievement.completed && (
                        <View style={styles.completedBadge}>
                          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                        </View>
                      )}
                    </View>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                    <Text style={styles.achievementReward}>{achievement.reward}</Text>
                    
                    <View style={styles.achievementProgress}>
                      <View style={styles.progressBarContainer}>
                        <View style={styles.achievementProgressBar}>
                          <LinearGradient
                            colors={achievement.completed ? [Colors.success, Colors.success] : [Colors.primary, Colors.secondary]}
                            style={[
                              styles.achievementProgressFill,
                              { width: `${(achievement.progress / achievement.total) * 100}%` }
                            ]}
                          />
                        </View>
                        <Text style={styles.achievementProgressText}>
                          {achievement.progress} / {achievement.total}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    paddingHorizontal: 0
  },
    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
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

  scrollContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  statsCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  titleSection: {
    flex: 1,
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  cardSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xl,
  },
  pointsValue: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  pointsLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  levelBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  levelText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
  },
  progressSection: {
    marginTop: Spacing.sm,
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
  progressText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xs,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  tabText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semibold,
  },
  rewardsContainer: {
    gap: Spacing.lg,
  },
  rewardCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  rewardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rewardImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
  },
  rewardDetails: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs / 2,
  },
  rewardDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardPoints: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
  },
  redeemButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    minWidth: 80,
    alignItems: 'center',
  },
  redeemButtonDisabled: {
    backgroundColor: Colors.borderLight,
  },
  redeemButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
    fontWeight: Typography.fontWeight.semibold,
  },
  redeemButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  achievementsContainer: {
    gap: Spacing.lg,
  },
  achievementCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  achievementTitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
    flex: 1,
  },
  completedBadge: {
    marginLeft: Spacing.sm,
  },
  achievementDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  achievementReward: {
    fontSize: Typography.fontSize.sm,
    color: Colors.success,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.md,
  },
  achievementProgress: {
    marginTop: Spacing.sm,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  achievementProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  achievementProgressFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  achievementProgressText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
    minWidth: 60,
    textAlign: 'right',
  },
});
