import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Header, ScreenWrapper } from '../components/common';
import { PlanDetailCard, PlanToggleButton } from '../components/plans';
import { Colors } from '../constants/theme';
import { useRouter } from 'expo-router';
import { Button } from '../components/common';
const plans = {
  Base: { 
    price: 100, 
    duration: '30 days', 
    features: [
      'Daily returns: 0.5%',
      'News access',
      'Basic support',
      'Level 1-2 rewards'
    ],
    dailyReturn: 0.5,
    investment: 100
  },
  Silver: { 
    price: 500, 
    duration: '90 days', 
    features: [
      'Daily returns: 0.8%',
      'Premium news',
      'Priority support',
      'Level 1-5 rewards',
      'Extra earning opportunities'
    ],
    dailyReturn: 0.8,
    investment: 500
  },
  Gold: { 
    price: 1000, 
    duration: '180 days', 
    features: [
      'Daily returns: 1.2%',
      'All news categories',
      'Premium support',
      'Level 1-8 rewards',
      'Higher ad rewards',
      'Referral bonuses'
    ],
    dailyReturn: 1.2,
    investment: 1000
  },
  Diamond: { 
    price: 5000, 
    duration: '365 days', 
    features: [
      'Daily returns: 1.8%',
      'All premium features',
      'VIP support',
      'Level 1-12 rewards',
      'Maximum earning potential',
      'Exclusive rewards',
      'Priority withdrawals'
    ],
    dailyReturn: 1.8,
    investment: 5000
  },
};

const planNames = Object.keys(plans);

export default function PlansScreen() {
  const [selectedPlan, setSelectedPlan] = useState('Silver');
  const activePlan = 'Silver'; // This would come from user data

  const router = useRouter();
  const selectedPlanData = plans[selectedPlan as keyof typeof plans];

  const calculateDailyEarnings = (plan: typeof selectedPlanData) => {
    return (plan.investment * plan.dailyReturn / 100).toFixed(2);
  };

  const calculateMonthlyEarnings = (plan: typeof selectedPlanData) => {
    return (plan.investment * plan.dailyReturn / 100 * 30).toFixed(2);
  };

  return (
    <ScreenWrapper>
      <Header title="Plans & Subscriptions" canGoBack />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Choose Your Investment Plan</Text>
          <Text style={styles.subtitle}>
            Select a plan that matches your investment goals
          </Text>
        </View>

        <PlanToggleButton
          options={planNames}
          selectedOption={selectedPlan}
          onSelect={setSelectedPlan}
        />

        <View style={styles.calculatorSection}>
          <Text style={styles.calculatorTitle}>Earnings Calculator</Text>
          <View style={styles.calculatorRow}>
            <Text style={styles.calculatorLabel}>Daily Earnings:</Text>
            <Text style={styles.calculatorValue}>₹{calculateDailyEarnings(selectedPlanData)}</Text>
          </View>
          <View style={styles.calculatorRow}>
            <Text style={styles.calculatorLabel}>Monthly Earnings:</Text>
            <Text style={styles.calculatorValue}>₹{calculateMonthlyEarnings(selectedPlanData)}</Text>
          </View>
          <View style={styles.calculatorRow}>
            <Text style={styles.calculatorLabel}>Annual Returns:</Text>
            <Text style={styles.calculatorValue}>
              {(selectedPlanData.dailyReturn * 365).toFixed(1)}%
            </Text>
          </View>
        </View>

        <PlanDetailCard
          name={selectedPlan}
          price={selectedPlanData.price}
          duration={selectedPlanData.duration}
          features={selectedPlanData.features}
          isActive={selectedPlan === activePlan}
        />

        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Why Choose Our Plans?</Text>
          <Text style={styles.benefitItem}>• Guaranteed daily returns</Text>
          <Text style={styles.benefitItem}>• No hidden charges</Text>
          <Text style={styles.benefitItem}>• Secure investments</Text>
          <Text style={styles.benefitItem}>• 24/7 support</Text>
          <Text style={styles.benefitItem}>• Easy withdrawals</Text>
        </View>

        {selectedPlan !== activePlan && (
          <View style={styles.upgradeSection}>
            <Text style={styles.upgradeTitle}>Ready to upgrade?</Text>
            <Text style={styles.upgradeDescription}>
              Upgrade to {selectedPlan} plan and start earning ₹{calculateDailyEarnings(selectedPlanData)} daily!
            </Text>
            <Button 
              title={`Upgrade to ${selectedPlan} - ₹${selectedPlanData.price}`} 
              onPress={() => {}} 
            />
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  calculatorSection: {
    backgroundColor: Colors.surface,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calculatorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  calculatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calculatorLabel: {
    fontSize: 16,
    color: '#666',
  },
  calculatorValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.success,
  },
  benefitsSection: {
    backgroundColor: Colors.surfaceSecondary,
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  benefitItem: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text,
  },
  upgradeSection: {
    backgroundColor: Colors.surfaceSecondary,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.primary,
  },
  upgradeDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: Colors.textSecondary,
  },
});
