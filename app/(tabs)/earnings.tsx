import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header, ScreenWrapper } from '../../components/common';
import { 
  DailyEarningsCard, 
  LevelProgressCard, 
  ExtraEarningsCard,
  EarningsChart
} from '../../components/earnings';

export default function EarningsScreen() {
  return (
    <ScreenWrapper>
      <Header title="Earnings & Rewards" />
      <ScrollView contentContainerStyle={styles.container}>
        <DailyEarningsCard 
          todayEarnings={50}
          weeklyTarget={350}
          monthlyTarget={1500}
          dailyInvestment={100}
        />
        <LevelProgressCard 
          currentLevel={3}
          currentLevelEarnings={150}
          nextLevelRequirement={500}
          totalReferrals={8}
        />
        <ExtraEarningsCard 
          adVideoEarnings={25}
          appInstallEarnings={40}
          availableAds={5}
          availableApps={3}
        />
        <EarningsChart />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});
