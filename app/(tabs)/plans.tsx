import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Header, ScreenWrapper, Card } from '../../components/common';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

const plans = {
  Basic: { 
    monthlyPrice: 100, 
    yearlyPrice: 900,
    monthlyOriginalPrice: 200,
    yearlyOriginalPrice: 1800,
    duration: { monthly: '30 days', yearly: '1 year' },
    features: ['5 News Sources', 'Basic Analytics', 'Standard Support'],
    color: Colors.textSecondary,
    gradient: [Colors.textSecondary, Colors.secondary],
    savings: '50% OFF',
    popular: false
  },
  Silver: { 
    monthlyPrice: 500, 
    yearlyPrice: 4500,
    monthlyOriginalPrice: 750,
    yearlyOriginalPrice: 6750,
    duration: { monthly: '30 days', yearly: '1 year' },
    features: ['15 News Sources', 'Advanced Analytics', 'Priority Support', 'Ad-Free Experience'],
    color: Colors.primary,
    gradient: [Colors.primary, Colors.primaryDark],
    savings: '33% OFF',
    popular: true
  },
  Gold: { 
    monthlyPrice: 1000, 
    yearlyPrice: 9000,
    monthlyOriginalPrice: 1500,
    yearlyOriginalPrice: 13500,
    duration: { monthly: '30 days', yearly: '1 year' },
    features: ['Unlimited News Sources', 'Premium Analytics', '24/7 Support', 'Ad-Free Experience', 'Exclusive Content'],
    color: Colors.warning,
    gradient: [Colors.warning, '#E67E22'],
    savings: '33% OFF',
    popular: false
  },
  Diamond: { 
    monthlyPrice: 5000, 
    yearlyPrice: 45000,
    monthlyOriginalPrice: 7500,
    yearlyOriginalPrice: 67500,
    duration: { monthly: '30 days', yearly: '1 year' },
    features: ['Everything in Gold', 'AI-Powered Insights', 'Personal News Assistant', 'Early Access Features', 'VIP Support'],
    color: Colors.success,
    gradient: [Colors.success, '#0E9749'],
    savings: '33% OFF',
    popular: false
  },
};

const planNames = Object.keys(plans) as Array<keyof typeof plans>;

export default function PlansScreen() {
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof plans>('Silver');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const activePlan = 'Silver'; // This would come from user data

  const selectedPlanData = plans[selectedPlan];

  return (
    <ScreenWrapper style={styles.container}>
      <Header title="Plans & Subscriptions" canGoBack={false} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Choose Your Plan</Text>
          <Text style={styles.headerSubtitle}>
            Unlock premium features and get the most out of your news experience
          </Text>
        </View>

        {/* Billing Toggle */}
        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[styles.billingOption, billingCycle === 'monthly' && styles.billingOptionActive]}
            onPress={() => setBillingCycle('monthly')}
          >
            <Text style={[styles.billingText, billingCycle === 'monthly' && styles.billingTextActive]}>
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.billingOption, billingCycle === 'yearly' && styles.billingOptionActive]}
            onPress={() => setBillingCycle('yearly')}
          >
            <Text style={[styles.billingText, billingCycle === 'yearly' && styles.billingTextActive]}>
              Yearly
            </Text>
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>Save 25%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Plan Cards */}
        <View style={styles.plansContainer}>
          {planNames.map((planName) => {
            const plan = plans[planName];
            const isSelected = selectedPlan === planName;
            const isActive = planName === activePlan;
            
            // Get current pricing based on billing cycle
            const currentPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            const currentOriginalPrice = billingCycle === 'monthly' ? plan.monthlyOriginalPrice : plan.yearlyOriginalPrice;
            const currentDuration = plan.duration[billingCycle];
            
            return (
              <TouchableOpacity
                key={planName}
                style={[styles.planCard, isSelected && styles.planCardSelected]}
                onPress={() => setSelectedPlan(planName)}
                activeOpacity={0.8}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}
                
                <LinearGradient
                  colors={plan.gradient as [string, string]}
                  style={styles.planGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                
                <View style={styles.planContent}>
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{planName}</Text>
                    {plan.savings && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{plan.savings}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.pricingSection}>
                    <View style={styles.priceRow}>
                      <Text style={styles.currency}>₹</Text>
                      <Text style={styles.price}>{currentPrice}</Text>
                      {currentOriginalPrice && (
                        <Text style={styles.originalPrice}>₹{currentOriginalPrice}</Text>
                      )}
                    </View>
                    <Text style={styles.duration}>for {currentDuration}</Text>
                  </View>
                  
                  <View style={styles.featuresSection}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                  
                  {isActive ? (
                    <View style={styles.currentPlanButton}>
                      <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                      <Text style={styles.currentPlanText}>Current Plan</Text>
                    </View>
                  ) : (
                    <TouchableOpacity style={[styles.subscribeButton, { backgroundColor: plan.color }]}>
                      <Text style={styles.subscribeButtonText}>
                        {isSelected ? 'Subscribe Now' : 'Select Plan'}
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color={Colors.white} />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Features Comparison Section */}
        <View style={styles.comparisonSection}>
          <Text style={styles.comparisonTitle}>Why Upgrade?</Text>
          <Text style={styles.comparisonSubtitle}>
            Unlock powerful features to enhance your news experience
          </Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <LinearGradient
                colors={[Colors.warning + '20', Colors.warning + '10']}
                style={styles.benefitIcon}
              >
                <Ionicons name="flash" size={24} color={Colors.warning} />
              </LinearGradient>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Faster News Updates</Text>
                <Text style={styles.benefitDescription}>Get breaking news instantly with real-time notifications</Text>
              </View>
            </View>
            
            <View style={styles.benefitItem}>
              <LinearGradient
                colors={[Colors.success + '20', Colors.success + '10']}
                style={styles.benefitIcon}
              >
                <Ionicons name="shield-checkmark" size={24} color={Colors.success} />
              </LinearGradient>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Ad-Free Experience</Text>
                <Text style={styles.benefitDescription}>Enjoy uninterrupted reading without any advertisements</Text>
              </View>
            </View>
            
            <View style={styles.benefitItem}>
              <LinearGradient
                colors={[Colors.info + '20', Colors.info + '10']}
                style={styles.benefitIcon}
              >
                <Ionicons name="analytics" size={24} color={Colors.info} />
              </LinearGradient>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Advanced Analytics</Text>
                <Text style={styles.benefitDescription}>Track your reading habits and earning patterns</Text>
              </View>
            </View>
            
            <View style={styles.benefitItem}>
              <LinearGradient
                colors={[Colors.primary + '20', Colors.primary + '10']}
                style={styles.benefitIcon}
              >
                <Ionicons name="star" size={24} color={Colors.primary} />
              </LinearGradient>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Exclusive Content</Text>
                <Text style={styles.benefitDescription}>Access premium articles and exclusive market insights</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 0
  },
  scrollContainer: {
    paddingBottom: Spacing.xl * 2,
  },
  
  // Header Section
  headerSection: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Billing Toggle
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xs,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  billingOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    position: 'relative',
  },
  billingOptionActive: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  billingText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
  billingTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semibold,
  },
  savingsBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  savingsText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
  },
  
  // Plans Container
  plansContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.borderLight,
    ...Shadows.md,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: Colors.primary,
    transform: [{ scale: 1.02 }],
    ...Shadows.lg,
  },
  popularBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    zIndex: 2,
  },
  popularText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  planGradient: {
    height: 6,
    width: '100%',
  },
  planContent: {
    padding: Spacing.xl,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  planName: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  discountBadge: {
    backgroundColor: Colors.error + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  discountText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.error,
  },
  
  // Pricing Section
  pricingSection: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  currency: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  price: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.text,
    lineHeight: 40,
  },
  originalPrice: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: Spacing.sm,
  },
  duration: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  // Features Section
  featuresSection: {
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    flex: 1,
  },
  
  // Buttons
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    ...Shadows.md,
  },
  subscribeButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
  currentPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.success + '15',
    gap: Spacing.sm,
  },
  currentPlanText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.success,
  },
  
  // Comparison Section
  comparisonSection: {
    padding: Spacing.xl,
    marginTop: Spacing.xl,
  },
  comparisonTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  comparisonSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  benefitsList: {
    gap: Spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  benefitDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
