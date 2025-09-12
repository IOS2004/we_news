import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';

import ScreenWrapper from '../components/common/ScreenWrapper';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import { Colors } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

// Dummy data for plan details - this would come from backend API
const getPlanDetails = (planId: string) => {
  const planDetailsData = {
    'base_daily': {
      id: 'base_daily',
      name: 'Base Plan',
      frequency: 'Daily',
      description: 'Your growth journey begins here',
      initialPayment: 1499,
      contributionAmount: 25,
      planValidity: 750,
      purchaseDate: '2024-01-15',
      expiryDate: '2026-02-03',
      status: 'Active',
      color: '#3B82F6',
      gradient: ['#3B82F6', '#1D4ED8'],
      totalContributions: 45,
      totalEarnings: 2850,
      nextContributionDate: '2024-09-13',
      contributionStreak: 45,
      referrals: {
        direct: 3,
        total: 12,
        activeThisMonth: 8
      },
      earnings: {
        thisMonth: 1350,
        lastMonth: 1425,
        total: 18500,
        pending: 250
      },
      contributionHistory: [
        { date: '2024-09-12', amount: 25, status: 'Completed' },
        { date: '2024-09-11', amount: 25, status: 'Completed' },
        { date: '2024-09-10', amount: 25, status: 'Completed' },
        { date: '2024-09-09', amount: 25, status: 'Completed' },
        { date: '2024-09-08', amount: 25, status: 'Completed' }
      ],
      features: [
        'Daily contribution tracking',
        'Growth rewards system',
        'Portfolio analytics',
        'Performance insights',
        '24/7 customer support'
      ],
      performance: {
        contributionCompliance: 98,
        growthRate: 12.5,
        monthlyAverage: 1387
      }
    },
    'silver_weekly': {
      id: 'silver_weekly',
      name: 'Silver Plan',
      frequency: 'Weekly',
      description: 'Enhanced growth opportunities',
      initialPayment: 2199,
      contributionAmount: 450,
      planValidity: 750,
      purchaseDate: '2024-02-01',
      expiryDate: '2026-02-20',
      status: 'Active',
      color: '#6B7280',
      gradient: ['#6B7280', '#4B5563'],
      totalContributions: 28,
      totalEarnings: 8950,
      nextContributionDate: '2024-09-16',
      contributionStreak: 28,
      referrals: {
        direct: 7,
        total: 28,
        activeThisMonth: 18
      },
      earnings: {
        thisMonth: 4050,
        lastMonth: 3875,
        total: 42750,
        pending: 850
      },
      contributionHistory: [
        { date: '2024-09-09', amount: 450, status: 'Completed' },
        { date: '2024-09-02', amount: 450, status: 'Completed' },
        { date: '2024-08-26', amount: 450, status: 'Completed' },
        { date: '2024-08-19', amount: 450, status: 'Completed' },
        { date: '2024-08-12', amount: 450, status: 'Completed' }
      ],
      features: [
        'Everything in Base Plan',
        'Higher growth rewards',
        'Priority customer support',
        'Advanced analytics',
        'Weekly performance reports'
      ],
      performance: {
        contributionCompliance: 100,
        growthRate: 18.2,
        monthlyAverage: 4012
      }
    }
  };

  return planDetailsData[planId as keyof typeof planDetailsData] || null;
};

export default function PlanDetailsScreen() {
  const { planId } = useLocalSearchParams();
  const [planDetails, setPlanDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const details = getPlanDetails(planId as string);
      setPlanDetails(details);
      setLoading(false);
    }, 500);
  }, [planId]);

  const handleMakeContribution = () => {
    Alert.alert(
      'Make Contribution',
      `Make your ${planDetails.frequency.toLowerCase()} contribution of ₹${planDetails.contributionAmount}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Contribute', 
          onPress: () => {
            Alert.alert('Success', 'Contribution made successfully!');
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <Header title="Plan Details" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading plan details...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!planDetails) {
    return (
      <ScreenWrapper>
        <Header title="Plan Details" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.error} />
          <Text style={styles.errorText}>Plan not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title="Plan Details" />
      
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Plan Header Card */}
        <LinearGradient
          colors={planDetails.gradient}
          style={styles.planHeaderCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.planHeaderContent}>
            <View style={styles.planTitleSection}>
              <Text style={styles.planName}>{planDetails.name}</Text>
              <Text style={styles.planFrequency}>{planDetails.frequency} Plan</Text>
              <Text style={styles.planDescription}>{planDetails.description}</Text>
            </View>
            
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{planDetails.status}</Text>
            </View>
          </View>

          <View style={styles.planStatsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹{planDetails.totalEarnings.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{planDetails.contributionStreak}</Text>
              <Text style={styles.statLabel}>Contribution Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{planDetails.referrals.total}</Text>
              <Text style={styles.statLabel}>Total Network</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={handleMakeContribution}>
              <Ionicons name="add-circle" size={24} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Make Contribution</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push({
                pathname: '/network',
                params: { planId: planId as string }
              })}
            >
              <Ionicons name="people" size={24} color={Colors.primary} />
              <Text style={styles.actionButtonText}>View Network</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="analytics" size={24} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Performance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="download" size={24} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Download Report</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plan Information */}
        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>Plan Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color={Colors.primary} />
            <Text style={styles.infoLabel}>Purchase Date:</Text>
            <Text style={styles.infoValue}>{formatDate(planDetails.purchaseDate)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time" size={16} color={Colors.primary} />
            <Text style={styles.infoLabel}>Expiry Date:</Text>
            <Text style={styles.infoValue}>{formatDate(planDetails.expiryDate)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="cash" size={16} color={Colors.primary} />
            <Text style={styles.infoLabel}>Contribution Amount:</Text>
            <Text style={styles.infoValue}>₹{planDetails.contributionAmount}/{planDetails.frequency.toLowerCase()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
            <Text style={styles.infoLabel}>Next Contribution:</Text>
            <Text style={styles.infoValue}>{formatDate(planDetails.nextContributionDate)}</Text>
          </View>
        </Card>

        {/* Earnings Overview */}
        <Card style={styles.earningsCard}>
          <Text style={styles.cardTitle}>Earnings Overview</Text>
          <View style={styles.earningsGrid}>
            <View style={styles.earningItem}>
              <Text style={styles.earningAmount}>₹{planDetails.earnings.thisMonth.toLocaleString()}</Text>
              <Text style={styles.earningLabel}>This Month</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningAmount}>₹{planDetails.earnings.lastMonth.toLocaleString()}</Text>
              <Text style={styles.earningLabel}>Last Month</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningAmount}>₹{planDetails.earnings.pending.toLocaleString()}</Text>
              <Text style={styles.earningLabel}>Pending</Text>
            </View>
          </View>
        </Card>

        {/* Performance Metrics */}
        <Card style={styles.performanceCard}>
          <Text style={styles.cardTitle}>Performance Metrics</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Contribution Compliance</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${planDetails.performance.contributionCompliance}%` }]} />
            </View>
            <Text style={styles.metricValue}>{planDetails.performance.contributionCompliance}%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Growth Rate</Text>
            <Text style={styles.metricValue}>+{planDetails.performance.growthRate}%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Monthly Average</Text>
            <Text style={styles.metricValue}>₹{planDetails.performance.monthlyAverage.toLocaleString()}</Text>
          </View>
        </Card>

        {/* Recent Contributions */}
        <Card style={styles.historyCard}>
          <Text style={styles.cardTitle}>Recent Contributions</Text>
          {planDetails.contributionHistory.map((contribution: any, index: number) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <Ionicons 
                  name={contribution.status === 'Completed' ? 'checkmark-circle' : 'time'} 
                  size={20} 
                  color={contribution.status === 'Completed' ? Colors.success : Colors.warning} 
                />
                <View style={styles.historyInfo}>
                  <Text style={styles.historyDate}>{formatDate(contribution.date)}</Text>
                  <Text style={styles.historyStatus}>{contribution.status}</Text>
                </View>
              </View>
              <Text style={styles.historyAmount}>₹{contribution.amount}</Text>
            </View>
          ))}
        </Card>

        {/* Plan Features */}
        <Card style={styles.featuresCard}>
          <Text style={styles.cardTitle}>Plan Features</Text>
          {planDetails.features.map((feature: string, index: number) => (
            <View key={index} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  planHeaderCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  planHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  planTitleSection: {
    flex: 1,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  planFrequency: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  planStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
  },
  quickActionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (screenWidth - 52) / 2,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonText: {
    fontSize: 12,
    color: Colors.text,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  infoCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  earningsCard: {
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  earningLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  performanceCard: {
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  metricValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  progressBar: {
    flex: 2,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
  },
  historyCard: {
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyInfo: {
    gap: 2,
  },
  historyDate: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  historyStatus: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  historyAmount: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  featuresCard: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
});
