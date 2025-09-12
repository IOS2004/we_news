import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

const growthPlans = [
  {
    id: 'base',
    name: 'Base Plan',
    description: 'Start your growth journey',
    plans: {
      daily: { initialPayment: 1499, contributionAmount: 25 },
      weekly: { initialPayment: 1299, contributionAmount: 150 },
      monthly: { initialPayment: 999, contributionAmount: 600 }
    },
    planValidity: 750, // days
    earnings: {
      daily: 45,
      weekly: 315,
      monthly: 1350
    },
    features: [
      'Daily contribution tracking',
      'Growth rewards system',
      'Portfolio analytics',
      'Performance insights'
    ],
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1D4ED8'],
    popular: false
  },
  {
    id: 'silver',
    name: 'Silver Plan',
    description: 'Enhanced growth opportunities',
    plans: {
      daily: { initialPayment: 2499, contributionAmount: 75 },
      weekly: { initialPayment: 2199, contributionAmount: 450 },
      monthly: { initialPayment: 1899, contributionAmount: 1800 }
    },
    planValidity: 750,
    earnings: {
      daily: 135,
      weekly: 945,
      monthly: 4050
    },
    features: [
      'Everything in Base Plan',
      'Higher growth rewards',
      'Priority support',
      'Advanced analytics'
    ],
    color: '#6B7280',
    gradient: ['#6B7280', '#4B5563'],
    popular: true
  },
  {
    id: 'gold',
    name: 'Gold Plan',
    description: 'Premium growth experience',
    plans: {
      daily: { initialPayment: 3499, contributionAmount: 125 },
      weekly: { initialPayment: 3099, contributionAmount: 750 },
      monthly: { initialPayment: 2699, contributionAmount: 3000 }
    },
    planValidity: 750,
    earnings: {
      daily: 225,
      weekly: 1575,
      monthly: 6750
    },
    features: [
      'Everything in Silver Plan',
      'Premium growth rates',
      'Exclusive insights',
      'Personal account manager'
    ],
    color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
    popular: false
  },
  {
    id: 'diamond',
    name: 'Diamond Plan',
    description: 'Elite growth tier',
    plans: {
      daily: { initialPayment: 4499, contributionAmount: 225 },
      weekly: { initialPayment: 3999, contributionAmount: 1350 },
      monthly: { initialPayment: 3499, contributionAmount: 5400 }
    },
    planValidity: 750,
    earnings: {
      daily: 405,
      weekly: 2835,
      monthly: 12150
    },
    features: [
      'Everything in Gold Plan',
      'Maximum earning potential',
      'VIP customer support',
      'Early access to new plans'
    ],
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED'],
    popular: false
  },
  {
    id: 'platinum',
    name: 'Platinum Plan',
    description: 'Ultimate growth package',
    plans: {
      daily: { initialPayment: 5499, contributionAmount: 350 },
      weekly: { initialPayment: 4899, contributionAmount: 2100 },
      monthly: { initialPayment: 4299, contributionAmount: 8400 }
    },
    planValidity: 750,
    earnings: {
      daily: 630,
      weekly: 4410,
      monthly: 18900
    },
    features: [
      'Everything in Diamond Plan',
      'Highest growth rewards',
      'Dedicated relationship manager',
      'Exclusive growth opportunities'
    ],
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
    popular: false
  },
  {
    id: 'elite',
    name: 'Elite Plan',
    description: 'The pinnacle of growth',
    plans: {
      daily: { initialPayment: 6999, contributionAmount: 500 },
      weekly: { initialPayment: 6199, contributionAmount: 3000 },
      monthly: { initialPayment: 5399, contributionAmount: 12000 }
    },
    planValidity: 750,
    earnings: {
      daily: 900,
      weekly: 6300,
      monthly: 27000
    },
    features: [
      'Everything in Platinum Plan',
      'Maximum daily contributions',
      'Elite status benefits',
      'Personalized growth strategy'
    ],
    color: '#DC2626',
    gradient: ['#DC2626', '#B91C1C'],
    popular: false
  }
];

export default function PlansScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePurchasePlan = (plan: any) => {
    const currentPlan = plan.plans[selectedFrequency];
    Alert.alert(
      'Confirm Purchase',
      `Are you sure you want to purchase ${plan.name} (${selectedFrequency}) for ₹${currentPlan.initialPayment}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Purchase', 
          onPress: () => {
            // Handle plan purchase - integrate with backend later
            Alert.alert('Success', `${plan.name} (${selectedFrequency}) purchased successfully!`);
          }
        }
      ]
    );
  };

  const PlanCard = ({ plan }: { plan: any }) => {
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
});
