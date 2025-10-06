import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../common/Card';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { referralAPI } from '../../services/api';
import { showToast } from '../../utils/toast';

interface ReferralOverviewProps {
  planId?: string;
}

const ReferralOverview: React.FC<ReferralOverviewProps> = ({ planId }) => {
  const [referralInfo, setReferralInfo] = useState<any>(null);
  const [commissionStructure, setCommissionStructure] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralData();
  }, [planId]);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      
      const [infoResponse, structureResponse] = await Promise.all([
        referralAPI.getReferralInfo(),
        referralAPI.getCommissionStructure()
      ]);

      if (infoResponse.success && infoResponse.data) {
        setReferralInfo(infoResponse.data);
      }

      if (structureResponse.success && structureResponse.data) {
        setCommissionStructure(structureResponse.data);
      }

    } catch (error) {
      console.error('Error fetching referral data:', error);
      showToast.error({
        title: 'Load Error',
        message: 'Failed to load referral information.',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="refresh" size={24} color={Colors.primary} />
        <Text style={styles.loadingText}>Loading referral data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Referral Stats */}
      <Card style={styles.statsCard}>
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          style={styles.statsGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.statsHeader}>
            <Ionicons name="people" size={24} color="#ffffff" />
            <Text style={styles.statsTitle}>Your Referral Network</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {referralInfo?.totalReferrals || 0}
              </Text>
              <Text style={styles.statLabel}>Total Referrals</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {referralInfo?.activeReferrals || 0}
              </Text>
              <Text style={styles.statLabel}>Active This Month</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatCurrency(referralInfo?.totalEarnings || 0)}
              </Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </View>
          </View>
        </LinearGradient>
      </Card>

      {/* Commission Structure */}
      <Card style={styles.commissionCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="trending-up" size={20} color={Colors.primary} />
          <Text style={styles.cardTitle}>Commission Structure</Text>
        </View>
        
        {commissionStructure?.levelStructure?.map((level: any, index: number) => (
          <View key={index} style={styles.levelRow}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelNumber}>L{level.level}</Text>
              <View style={styles.levelDetails}>
                <Text style={styles.levelRequirement}>
                  {level.requiredReferrals} referrals required
                </Text>
                <Text style={styles.levelUnlockTime}>
                  Unlocks after {level.openAfterDays} days  
                </Text>
              </View>
            </View>
            <View style={styles.levelCommission}>
              <Text style={styles.commissionAmount}>
                Commission varies by plan
              </Text>
              <Text style={styles.commissionLabel}>see plan details</Text>
            </View>
          </View>
        )) || (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Commission structure not available</Text>
          </View>
        )}
      </Card>

      {/* How It Works */}
      <Card style={styles.howItWorksCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="help-circle" size={20} color={Colors.info} />
          <Text style={styles.cardTitle}>How Referral System Works</Text>
        </View>
        
        <View style={styles.stepsList}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Share Your Code</Text>
              <Text style={styles.stepDescription}>
                Share your unique referral code with friends and family
              </Text>
            </View>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>They Join & Invest</Text>
              <Text style={styles.stepDescription}>
                When they sign up using your code and make their first investment
              </Text>
            </View>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Earn Commissions</Text>
              <Text style={styles.stepDescription}>
                You earn commissions based on the level structure up to 13 levels deep
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  statsCard: {
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: Spacing.lg,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statsTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#ffffff',
    marginLeft: Spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: '#ffffff',
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: Spacing.sm,
  },
  commissionCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  levelNumber: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    width: 40,
  },
  levelDetails: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  levelRequirement: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.text,
  },
  levelUnlockTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  levelCommission: {
    alignItems: 'flex-end',
  },
  commissionAmount: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success,
  },
  commissionLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  noDataContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  howItWorksCard: {
    marginBottom: Spacing.md,
  },
  stepsList: {
    marginTop: Spacing.sm,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stepNumberText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: '#ffffff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default ReferralOverview;