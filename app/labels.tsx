import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Header, ScreenWrapper } from '../components/common';
import { ActiveLabelsCard, LabelRewardsCard } from '../components/labels';

export default function LabelsScreen() {
  return (
    <ScreenWrapper>
      <Header title="Labels & Rewards" canGoBack />
      <ScrollView contentContainerStyle={styles.container}>
        <ActiveLabelsCard />
        <LabelRewardsCard />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});
