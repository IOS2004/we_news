import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { router } from 'expo-router';
import { Button, Header, ScreenWrapper } from '../../components/common';
import { EarningsSummary, NewsHighlightReel, OverviewCard } from '../../components/dashboard';
import { DashboardNotifications, QuickActions } from '../../components/dashboard';

const dummyNews = [
  { id: '1', title: 'Politics News Headline 1', thumbnail: 'https://picsum.photos/200' },
  { id: '2', title: 'Business News Headline 2', thumbnail: 'https://picsum.photos/201' },
  { id: '3', title: 'Tech News Headline 3', thumbnail: 'https://picsum.photos/202' },
  { id: '4', title: 'Entertainment News Headline 4', thumbnail: 'https://picsum.photos/203' },
];

const notifications = [
  { id: '1', title: 'Daily earnings credited', message: '₹50 has been added to your wallet', time: '2 hours ago' },
  { id: '2', title: 'New ad videos available', message: '5 new videos ready to watch', time: '4 hours ago' },
  { id: '3', title: 'Level reward unlocked', message: 'You\'ve reached Level 3!', time: '1 day ago' },
];

export default function HomeScreen() {
  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const handleWatchAds = () => {
    // Navigate to ad watching section
    console.log('Navigate to ad watching');
  };

  const handleInstallApps = () => {
    // Navigate to partner apps
    console.log('Navigate to partner apps');
  };

  const handleWithdraw = () => {
    handleNavigation('/withdrawals');
  };

  const handleUpgradePlan = () => {
    handleNavigation('/plans');
  };

  return (
    <ScreenWrapper>
      <Header title="Dashboard" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back, Rahul!</Text>
          <Text style={styles.dateText}>Today is {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Overview Card */}
        <OverviewCard 
          balance={1500} 
          earnings={5000} 
          plan="Silver"
          onWithdraw={handleWithdraw}
          onUpgradePlan={handleUpgradePlan}
        />

        {/* Earnings Summary */}
        <EarningsSummary today={50} week={350} month={1500} />

        {/* Quick Actions */}
        <QuickActions
          onWatchAds={handleWatchAds}
          onInstallApps={handleInstallApps}
          onViewEarnings={() => handleNavigation('/(tabs)/earnings')}
          onViewLabels={() => handleNavigation('/labels')}
        />

        {/* Notifications */}
        <DashboardNotifications notifications={notifications} />

        {/* News Highlight */}
        <NewsHighlightReel articles={dummyNews} />

        {/* Investment Status */}
        <View style={styles.investmentStatus}>
          <Text style={styles.sectionTitle}>Today's Investment</Text>
          <View style={styles.investmentCard}>
            <View style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>Plan:</Text>
              <Text style={styles.investmentValue}>Silver (₹500)</Text>
            </View>
            <View style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>Daily Return:</Text>
              <Text style={styles.investmentValue}>₹4.00 (0.8%)</Text>
            </View>
            <View style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>Status:</Text>
              <Text style={[styles.investmentValue, styles.activeStatus]}>Active</Text>
            </View>
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.levelProgress}>
          <Text style={styles.sectionTitle}>Level Progress</Text>
          <View style={styles.levelCard}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>L3</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>Silver Tier</Text>
              <Text style={styles.levelDescription}>8 more referrals to Level 4</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
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
    paddingVertical: 16,
  },
  welcomeSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  investmentStatus: {
    margin: 16,
  },
  investmentCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  investmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  investmentLabel: {
    fontSize: 16,
    color: '#666',
  },
  investmentValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  activeStatus: {
    color: '#28a745',
  },
  levelProgress: {
    margin: 16,
  },
  levelCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 4,
  },
});
