import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenWrapper from '../../../components/common/ScreenWrapper';
import Header from '../../../components/common/Header';
import Card from '../../../components/common/Card';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../constants/theme';
import { showToast } from '../../../utils/toast';
import { investmentAPI, mapBackendPlansToGrowthPlans, GrowthPlan } from '../../../services/api';

const { width: screenWidth } = Dimensions.get('window');

export default function PlansScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [growthPlans, setGrowthPlans] = useState<GrowthPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load growth plans from backend
  useEffect(() => {
    loadGrowthPlans();
  }, []);

  const loadGrowthPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await investmentAPI.getInvestmentPlans();
      
      if (response.success && response.data) {
        const mappedPlans = mapBackendPlansToGrowthPlans(response.data);
        setGrowthPlans(mappedPlans);
      } else {
        throw new Error(response.message || 'Failed to load growth plans');
      }
    } catch (error: any) {
      console.error('Error loading growth plans:', error);
      setError('Failed to load growth plans. Please try again.');
      showToast.error({
        title: 'Error',
        message: 'Unable to load growth plans. Please check your connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePurchasePlan = async (plan: GrowthPlan) => {
    const currentPlan = plan.plans[selectedFrequency];
    Alert.alert(
      'Confirm Purchase',
      `Are you sure you want to purchase ${plan.name} (${selectedFrequency}) for ₹${currentPlan.initialPayment}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Purchase', 
          onPress: async () => {
            try {
              showToast.info({
                title: 'Processing Purchase',
                message: 'Please wait while we process your purchase...'
              });

              const response = await investmentAPI.purchaseInvestmentPlan(plan.id);
              
              if (response.success) {
                showToast.success({
                  title: 'Purchase Successful!',
                  message: `${plan.name} (${selectedFrequency}) purchased successfully!`
                });
              } else {
                throw new Error(response.message || 'Purchase failed');
              }
            } catch (error: any) {
              console.error('Error purchasing plan:', error);
              showToast.error({
                title: 'Purchase Failed',
                message: error.message || 'Unable to complete purchase. Please try again.'
              });
            }
          }
        }
      ]
    );
  };

  const PlanCard = ({ plan }: { plan: GrowthPlan }) => {
    const currentPlan = plan.plans[selectedFrequency];
    
    return (
      <View style={[styles.planCard, selectedPlan === plan.id && styles.selectedPlanCard]}>
        {plan.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>MOST POPULAR</Text>
          </View>
        )}
        
        <LinearGradient
          colors={plan.gradient}
          style={styles.planHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDescription}>{plan.description}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.initialPaymentLabel}>Initial Payment</Text>
            <Text style={styles.initialPaymentAmount}>₹{currentPlan.initialPayment.toLocaleString()}</Text>
          </View>
        </LinearGradient>

        <View style={styles.planContent}>
          {/* Contribution Details */}
          <View style={styles.contributionSection}>
            <Text style={styles.sectionTitle}>Contribution Details</Text>
            <View style={styles.contributionRow}>
              <Ionicons name="calendar" size={16} color={Colors.primary} />
              <Text style={styles.contributionText}>
                ₹{currentPlan.contributionAmount} per {selectedFrequency === 'daily' ? 'day' : selectedFrequency.replace('ly', '')}
              </Text>
            </View>
            <View style={styles.contributionRow}>
              <Ionicons name="time" size={16} color={Colors.primary} />
              <Text style={styles.contributionText}>
                {plan.planValidity} days validity
              </Text>
            </View>
            <View style={styles.contributionRow}>
              <Ionicons name="trending-up" size={16} color={Colors.primary} />
              <Text style={styles.contributionText}>
                Growth tracking included
              </Text>
            </View>
          </View>

          {/* Earning Potential */}
          <View style={styles.earningsSection}>
            <Text style={styles.sectionTitle}>Growth Potential</Text>
            <View style={styles.earningsGrid}>
              <View style={styles.earningItem}>
                <Text style={styles.earningAmount}>₹{plan.earnings.daily}</Text>
                <Text style={styles.earningLabel}>Daily</Text>
              </View>
              <View style={styles.earningItem}>
                <Text style={styles.earningAmount}>₹{plan.earnings.weekly}</Text>
                <Text style={styles.earningLabel}>Weekly</Text>
              </View>
              <View style={styles.earningItem}>
                <Text style={styles.earningAmount}>₹{plan.earnings.monthly}</Text>
                <Text style={styles.earningLabel}>Monthly</Text>
              </View>
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Plan Features</Text>
            {plan.features.map((feature: string, index: number) => (
              <View key={index} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Purchase Button */}
          <TouchableOpacity 
            style={[styles.purchaseButton, { backgroundColor: plan.color }]}
            onPress={() => handlePurchasePlan(plan)}
          >
            <Text style={styles.purchaseButtonText}>
              Purchase for ₹{currentPlan.initialPayment.toLocaleString()}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <Header title="Growth Plans" />
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading growth plans...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={64} color={Colors.error} />
          <Text style={styles.errorTitle}>Unable to Load Plans</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadGrowthPlans}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Choose Your Growth Plan</Text>
            <Text style={styles.headerSubtitle}>
              Accelerate your financial growth with our flexible contribution plans designed for consistent returns.
            </Text>
          </View>

          {/* Frequency Toggle */}
          <View style={styles.frequencyToggle}>
            <TouchableOpacity
              style={[styles.frequencyButton, selectedFrequency === 'daily' && styles.activeFrequency]}
              onPress={() => setSelectedFrequency('daily')}
            >
              <Text style={[styles.frequencyText, selectedFrequency === 'daily' && styles.activeFrequencyText]}>
                Daily
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.frequencyButton, selectedFrequency === 'weekly' && styles.activeFrequency]}
              onPress={() => setSelectedFrequency('weekly')}
            >
              <Text style={[styles.frequencyText, selectedFrequency === 'weekly' && styles.activeFrequencyText]}>
                Weekly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.frequencyButton, selectedFrequency === 'monthly' && styles.activeFrequency]}
              onPress={() => setSelectedFrequency('monthly')}
            >
              <Text style={[styles.frequencyText, selectedFrequency === 'monthly' && styles.activeFrequencyText]}>
                Monthly
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.plansContainer}>
            {growthPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color={Colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Important Information</Text>
                <Text style={styles.infoText}>
                  • Contributions must be made regularly to maintain growth eligibility{'\n'}
                  • Missing contributions may affect your growth rewards{'\n'}
                  • Plans are valid for the specified duration{'\n'}
                  • Growth rewards are calculated based on your contribution consistency
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  plansContainer: {
    gap: 20,
  },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlanCard: {
    borderColor: Colors.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  popularText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  planHeader: {
    padding: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 16,
  },
  priceContainer: {
    alignItems: 'center',
  },
  initialPaymentLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  initialPaymentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  planContent: {
    padding: 20,
  },
  contributionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  contributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  contributionText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  earningsSection: {
    marginBottom: 20,
  },
  earningsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningItem: {
    alignItems: 'center',
    flex: 1,
  },
  earningAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  earningLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  featuresSection: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  featureText: {
    fontSize: 16,
    color: Colors.textSecondary,
    flex: 1,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  infoSection: {
    marginTop: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 8,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  frequencyToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeFrequency: {
    backgroundColor: Colors.primary,
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeFrequencyText: {
    color: '#ffffff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.error,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
