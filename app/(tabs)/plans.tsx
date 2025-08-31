import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Header, ScreenWrapper } from '../../components/common';
import { PlanDetailCard, PlanToggleButton } from '../../components/plans';

const plans = {
  Base: { price: 100, duration: '30 days', features: ['Feature A', 'Feature B'] },
  Silver: { price: 500, duration: '90 days', features: ['Feature A', 'Feature B', 'Feature C'] },
  Gold: { price: 1000, duration: '180 days', features: ['Feature A', 'Feature B', 'Feature C', 'Feature D'] },
  Diamond: { price: 5000, duration: '365 days', features: ['All Features'] },
};

const planNames = Object.keys(plans);

export default function PlansScreen() {
  const [selectedPlan, setSelectedPlan] = useState('Silver');
  const activePlan = 'Silver'; // This would come from user data

  const selectedPlanData = plans[selectedPlan as keyof typeof plans];

  return (
    <ScreenWrapper>
      <Header title="Plans & Subscriptions" />
      <PlanToggleButton
        options={planNames}
        selectedOption={selectedPlan}
        onSelect={setSelectedPlan}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <PlanDetailCard
          name={selectedPlan}
          price={selectedPlanData.price}
          duration={selectedPlanData.duration}
          features={selectedPlanData.features}
          isActive={selectedPlan === activePlan}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});
