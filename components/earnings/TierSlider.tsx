import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth - (Spacing.lg * 3); // Account for padding and margins

interface TierData {
  id: string;
  name: string;
  investmentAmount: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  level: number;
  currentPoints: number;
  nextLevelPoints: number;
}

const tierData: TierData[] = [
  {
    id: 'bronze',
    name: 'Bronze Plan',
    investmentAmount: '₹99/month',
    color: '#CD7F32',
    icon: 'medal',
    level: 1,
    currentPoints: 650,
    nextLevelPoints: 1000
  },
  {
    id: 'silver',
    name: 'Silver Plan',
    investmentAmount: '₹299/month',
    color: '#C0C0C0',
    icon: 'trophy',
    level: 2,
    currentPoints: 1200,
    nextLevelPoints: 2000
  },
  {
    id: 'gold',
    name: 'Gold Plan',
    investmentAmount: '₹599/month',
    color: '#FFD700',
    icon: 'star',
    level: 3,
    currentPoints: 2800,
    nextLevelPoints: 4000
  },
  {
    id: 'platinum',
    name: 'Platinum Plan',
    investmentAmount: '₹999/month',
    color: '#E5E4E2',
    icon: 'diamond',
    level: 4,
    currentPoints: 5000,
    nextLevelPoints: 8000
  }
];

interface TierSliderProps {
  activeTiers: string[];
}

export const TierSlider: React.FC<TierSliderProps> = ({ activeTiers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter to show only active tiers
  const activeTierData = tierData.filter(tier => activeTiers.includes(tier.id));

  // If no active tiers, show a message
  if (activeTierData.length === 0) {
    return (
      <View style={styles.noTierContainer}>
        <Ionicons name="trending-up-outline" size={32} color={Colors.textSecondary} />
        <Text style={styles.noTierTitle}>No Active Subscription Plans</Text>
        <Text style={styles.noTierDescription}>
          Visit the profile settings to enable subscription plans for testing
        </Text>
      </View>
    );
  }

  // If only one tier, show it without slider
  if (activeTierData.length === 1) {
    return (
      <View style={styles.container}>
        <View style={styles.singleTierContainer}>
          <TierCard tier={activeTierData[0]} isActive={true} isSingle={true} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Subscription Plans</Text>
        <Text style={styles.headerSubtitle}>
          {currentIndex + 1} of {activeTierData.length} active subscription plans
        </Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
          setCurrentIndex(newIndex);
        }}
        contentContainerStyle={styles.scrollContainer}
      >
        {activeTierData.map((tier, index) => (
          <TierCard key={tier.id} tier={tier} isActive={index === currentIndex} />
        ))}
      </ScrollView>

      {/* Dots Indicator */}
      {activeTierData.length > 1 && (
        <View style={styles.dotsContainer}>
          {activeTierData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

interface TierCardProps {
  tier: TierData;
  isActive: boolean;
  isSingle?: boolean;
}

const TierCard: React.FC<TierCardProps> = ({ tier, isActive, isSingle = false }) => {
  const progressPercentage = (tier.currentPoints / tier.nextLevelPoints) * 100;

  return (
    <View style={[
      styles.tierCard, 
      { borderColor: tier.color, shadowColor: tier.color },
      isSingle && styles.singleTierCardStyle
    ]}>
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={[tier.color, `${tier.color}CC`]}
        style={styles.tierHeaderGradient}
      >
        <View style={styles.tierInfo}>
          <View style={styles.tierIconContainer}>
            <Ionicons name={tier.icon} size={28} color={Colors.white} />
          </View>
          <View style={styles.tierDetails}>
            <Text style={styles.tierName}>{tier.name}</Text>
            <Text style={styles.tierPrice}>{tier.investmentAmount}</Text>
          </View>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>L{tier.level}</Text>
        </View>
      </LinearGradient>

      {/* Active Status */}
      <View style={styles.activeStatusBar}>
        <View style={styles.activeIndicator}>
          <Ionicons name="trending-up" size={16} color={Colors.success} />
          <Text style={styles.activeText}>Subscription Active</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Level Progress</Text>
          <Text style={styles.progressPoints}>
            {tier.currentPoints.toLocaleString()} / {tier.nextLevelPoints.toLocaleString()}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[tier.color, `${tier.color}80`]}
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </View>
          <Text style={styles.progressPercent}>{Math.round(progressPercentage)}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  
  // Header
  header: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },

  // Scroll Container
  scrollContainer: {
    paddingLeft: Spacing.lg,
  },

  // Single Tier Container (centered)
  singleTierContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },

  // Single Tier Card (override width for centering)
  singleTierCardStyle: {
    width: screenWidth - (Spacing.lg * 2), // Full width minus padding
    marginRight: 0, // Remove the margin that's used for horizontal scroll
  },

  // No Tier State
  noTierContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.surfaceSecondary,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  noTierTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  noTierDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Tier Card
  tierCard: {
    width: cardWidth,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    marginRight: Spacing.lg,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  // Tier Header with Gradient
  tierHeaderGradient: {
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tierIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tierDetails: {
    flex: 1,
  },
  tierName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: 2,
  },
  tierPrice: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: Typography.fontWeight.medium,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  levelText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },

  // Active Status
  activeStatusBar: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    color: Colors.success,
    fontWeight: Typography.fontWeight.semibold,
  },

  // Progress Section
  progressContainer: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  progressPoints: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    minWidth: 35,
    textAlign: 'right',
  },

  // Benefits Section
  benefitsSection: {
    padding: Spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  benefitIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  benefitText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    flex: 1,
    lineHeight: 18,
  },

  // Dots Indicator
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
});
