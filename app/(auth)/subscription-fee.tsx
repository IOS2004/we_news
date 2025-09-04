import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button, ScreenWrapper } from '../../components/common';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export default function SubscriptionFeeScreen() {
  const handlePayment = () => {
    // For demo purposes, navigate to the main app after payment
    // In a real app, you would handle payment processing here
    router.replace('/(tabs)/home');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <ScreenWrapper style={styles.screenWrapper}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.gradient}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleGoBack}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.textOnDark} />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Ionicons name="diamond-outline" size={60} color={Colors.textOnDark} />
          </View>
          
          <Text style={styles.headerTitle}>Subscription Fee</Text>
          <Text style={styles.headerSubtitle}>Complete your membership</Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <View style={styles.feeCard}>
            <View style={styles.feeHeader}>
              <Ionicons name="star" size={32} color={Colors.primary} />
              <Text style={styles.feeTitle}>Premium Membership</Text>
            </View>
            
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>One-Time Joining Fee</Text>
              <Text style={styles.amount}>₹500</Text>
              <Text style={styles.amountNote}>Unlock all premium features</Text>
            </View>

            <View style={styles.featuresSection}>
              <Text style={styles.featuresTitle}>What you get:</Text>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.featureText}>Access to premium news content</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.featureText}>Unlimited earnings potential</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.featureText}>Priority customer support</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.featureText}>Exclusive member benefits</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Pay ₹500 & Continue" onPress={handlePayment} />
            <TouchableOpacity style={styles.laterButton} onPress={handleGoBack}>
              <Text style={styles.laterText}>I'll pay later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 0
  },
  gradient: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: Spacing.lg,
    top: Spacing.xl,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnDark,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textOnDark,
    textAlign: 'center',
    opacity: 0.9,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  feeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.lg,
  },
  feeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  feeTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  amountLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  amount: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  amountNote: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textSecondary,
  },
  featuresSection: {
    gap: Spacing.md,
  },
  featuresTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.text,
    flex: 1,
  },
  buttonContainer: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  laterButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  laterText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textOnDark,
    textDecorationLine: 'underline',
  },
});
