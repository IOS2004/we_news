import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';

import ScreenWrapper from '../components/common/ScreenWrapper';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import { Colors } from '../constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Mock network data based on MLM structure
const getNetworkData = (planId: string) => {
  const networkData: { [key: string]: any } = {
    'base_daily': {
      planName: 'Base Plan',
      planColor: '#3B82F6',
      totalNetworkSize: 47,
      directReferrals: 3,
      activeThisMonth: 28,
      totalEarnings: 15750,
      monthlyEarnings: 1350,
      levels: [
        { 
          level: 1, 
          unlocked: true, 
          unlockDate: '2024-01-22', 
          requirement: 3, 
          current: 3, 
          commission: 300, 
          members: [
            { id: 'u1', name: 'Rahul Kumar', joinDate: '2024-01-16', status: 'Active', earnings: 300 },
            { id: 'u2', name: 'Priya Sharma', joinDate: '2024-01-18', status: 'Active', earnings: 300 },
            { id: 'u3', name: 'Amit Singh', joinDate: '2024-01-20', status: 'Active', earnings: 300 }
          ]
        },
        { 
          level: 2, 
          unlocked: true, 
          unlockDate: '2024-02-06', 
          requirement: 9, 
          current: 12, 
          commission: 150, 
          members: [
            { id: 'u4', name: 'Sneha Patel', joinDate: '2024-01-25', status: 'Active', earnings: 150 },
            { id: 'u5', name: 'Rohit Verma', joinDate: '2024-01-28', status: 'Active', earnings: 150 },
            { id: 'u6', name: 'Kavya Reddy', joinDate: '2024-02-02', status: 'Active', earnings: 150 },
            { id: 'u7', name: 'Arjun Gupta', joinDate: '2024-02-05', status: 'Active', earnings: 150 }
          ]
        },
        { 
          level: 3, 
          unlocked: true, 
          unlockDate: '2024-03-22', 
          requirement: 27, 
          current: 32, 
          commission: 75, 
          members: [
            { id: 'u8', name: 'Deepak Joshi', joinDate: '2024-02-15', status: 'Active', earnings: 75 },
            { id: 'u9', name: 'Ritu Agarwal', joinDate: '2024-02-20', status: 'Active', earnings: 75 },
            { id: 'u10', name: 'Vikash Roy', joinDate: '2024-03-01', status: 'Inactive', earnings: 0 }
          ]
        },
        { 
          level: 4, 
          unlocked: false, 
          unlockDate: null, 
          requirement: 81, 
          current: 0, 
          commission: 50, 
          members: []
        },
        { 
          level: 5, 
          unlocked: false, 
          unlockDate: null, 
          requirement: 243, 
          current: 0, 
          commission: 25, 
          members: []
        }
      ]
    },
    'silver_weekly': {
      planName: 'Silver Plan',
      planColor: '#6B7280',
      totalNetworkSize: 128,
      directReferrals: 7,
      activeThisMonth: 89,
      totalEarnings: 42750,
      monthlyEarnings: 4050,
      levels: [
        { 
          level: 1, 
          unlocked: true, 
          unlockDate: '2024-02-08', 
          requirement: 3, 
          current: 7, 
          commission: 400, 
          members: [
            { id: 's1', name: 'Ankit Sharma', joinDate: '2024-02-02', status: 'Active', earnings: 400 },
            { id: 's2', name: 'Meera Singh', joinDate: '2024-02-04', status: 'Active', earnings: 400 },
            { id: 's3', name: 'Rajesh Kumar', joinDate: '2024-02-06', status: 'Active', earnings: 400 },
            { id: 's4', name: 'Pooja Gupta', joinDate: '2024-02-08', status: 'Active', earnings: 400 }
          ]
        },
        { 
          level: 2, 
          unlocked: true, 
          unlockDate: '2024-02-23', 
          requirement: 9, 
          current: 28, 
          commission: 200, 
          members: [
            { id: 's5', name: 'Suresh Patel', joinDate: '2024-02-12', status: 'Active', earnings: 200 },
            { id: 's6', name: 'Nisha Reddy', joinDate: '2024-02-15', status: 'Active', earnings: 200 },
            { id: 's7', name: 'Karan Joshi', joinDate: '2024-02-18', status: 'Active', earnings: 200 }
          ]
        },
        { 
          level: 3, 
          unlocked: true, 
          unlockDate: '2024-03-25', 
          requirement: 27, 
          current: 93, 
          commission: 100, 
          members: [
            { id: 's8', name: 'Divya Agarwal', joinDate: '2024-02-25', status: 'Active', earnings: 100 },
            { id: 's9', name: 'Manish Roy', joinDate: '2024-03-01', status: 'Active', earnings: 100 },
            { id: 's10', name: 'Sonia Verma', joinDate: '2024-03-05', status: 'Active', earnings: 100 }
          ]
        },
        { 
          level: 4, 
          unlocked: false, 
          unlockDate: null, 
          requirement: 81, 
          current: 0, 
          commission: 75, 
          members: []
        }
      ]
    }
  };

  return networkData[planId] || null;
};

export default function NetworkScreen() {
  const { planId } = useLocalSearchParams();
  const [networkData, setNetworkData] = useState<any>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'overview' | 'tree' | 'members'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = getNetworkData(planId as string);
      setNetworkData(data);
      setLoading(false);
    }, 500);
  }, [planId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const LevelCard = ({ level }: { level: any }) => (
    <TouchableOpacity 
      style={[
        styles.levelCard, 
        level.unlocked ? styles.levelCardUnlocked : styles.levelCardLocked,
        selectedLevel === level.level && styles.levelCardSelected
      ]}
      onPress={() => {
        if (level.unlocked) {
          setSelectedLevel(level.level);
          setViewMode('members');
        }
      }}
    >
      <View style={styles.levelHeader}>
        <View style={styles.levelTitleRow}>
          <Text style={[styles.levelTitle, !level.unlocked && styles.levelTitleLocked]}>
            Level {level.level}
          </Text>
          <View style={[styles.levelStatus, { backgroundColor: level.unlocked ? Colors.success : Colors.textSecondary }]}>
            <Ionicons 
              name={level.unlocked ? "checkmark" : "lock-closed"} 
              size={12} 
              color="#ffffff" 
            />
          </View>
        </View>
        
        {level.unlocked ? (
          <Text style={styles.levelUnlockDate}>
            Unlocked: {formatDate(level.unlockDate)}
          </Text>
        ) : (
          <Text style={styles.levelRequirement}>
            Requires: {level.requirement} members
          </Text>
        )}
      </View>

      <View style={styles.levelStats}>
        <View style={styles.levelStat}>
          <Text style={styles.levelStatValue}>{level.current}</Text>
          <Text style={styles.levelStatLabel}>Members</Text>
        </View>
        <View style={styles.levelStat}>
          <Text style={styles.levelStatValue}>₹{level.commission}</Text>
          <Text style={styles.levelStatLabel}>Commission</Text>
        </View>
      </View>

      {level.unlocked && level.current > 0 && (
        <View style={styles.levelProgress}>
          <View style={styles.levelProgressBar}>
            <View 
              style={[
                styles.levelProgressFill, 
                { width: `${Math.min((level.current / level.requirement) * 100, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.levelProgressText}>
            {level.current}/{level.requirement} completed
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const MemberCard = ({ member }: { member: any }) => (
    <View style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <View style={styles.memberAvatar}>
          <Text style={styles.memberInitials}>
            {member.name.split(' ').map((n: string) => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberJoinDate}>
            Joined: {formatDate(member.joinDate)}
          </Text>
          <View style={styles.memberStatusRow}>
            <View style={[styles.memberStatusBadge, { backgroundColor: member.status === 'Active' ? Colors.success : Colors.warning }]}>
              <Text style={styles.memberStatusText}>{member.status}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.memberEarnings}>
        <Text style={styles.memberEarningAmount}>₹{member.earnings}</Text>
        <Text style={styles.memberEarningLabel}>Earned</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <ScreenWrapper>
        <Header title="Network" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading network data...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!networkData) {
    return (
      <ScreenWrapper>
        <Header title="Network" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.error} />
          <Text style={styles.errorText}>Network data not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  const selectedLevelData = networkData.levels.find((l: any) => l.level === selectedLevel);

  return (
    <ScreenWrapper>
      <Header title={`${networkData.planName} Network`} />
      
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Network Overview Header */}
        <LinearGradient
          colors={[networkData.planColor, networkData.planColor + '80']}
          style={styles.networkHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.networkTitle}>{networkData.planName} Network</Text>
          <View style={styles.networkStatsGrid}>
            <View style={styles.networkStat}>
              <Text style={styles.networkStatValue}>{networkData.totalNetworkSize}</Text>
              <Text style={styles.networkStatLabel}>Total Network</Text>
            </View>
            <View style={styles.networkStat}>
              <Text style={styles.networkStatValue}>{networkData.directReferrals}</Text>
              <Text style={styles.networkStatLabel}>Direct Referrals</Text>
            </View>
            <View style={styles.networkStat}>
              <Text style={styles.networkStatValue}>{networkData.activeThisMonth}</Text>
              <Text style={styles.networkStatLabel}>Active This Month</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Earnings Summary */}
        <Card style={styles.earningsCard}>
          <Text style={styles.cardTitle}>Network Earnings</Text>
          <View style={styles.earningsRow}>
            <View style={styles.earningItem}>
              <Text style={styles.earningAmount}>₹{networkData.totalEarnings.toLocaleString()}</Text>
              <Text style={styles.earningLabel}>Total Earnings</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningAmount}>₹{networkData.monthlyEarnings.toLocaleString()}</Text>
              <Text style={styles.earningLabel}>This Month</Text>
            </View>
          </View>
        </Card>

        {/* View Mode Toggle */}
        <View style={styles.viewModeToggle}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'overview' && styles.activeViewMode]}
            onPress={() => setViewMode('overview')}
          >
            <Text style={[styles.viewModeText, viewMode === 'overview' && styles.activeViewModeText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'tree' && styles.activeViewMode]}
            onPress={() => setViewMode('tree')}
          >
            <Text style={[styles.viewModeText, viewMode === 'tree' && styles.activeViewModeText]}>
              Tree View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'members' && styles.activeViewMode]}
            onPress={() => setViewMode('members')}
          >
            <Text style={[styles.viewModeText, viewMode === 'members' && styles.activeViewModeText]}>
              Members
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on view mode */}
        {viewMode === 'overview' && (
          <View style={styles.overviewContent}>
            <Text style={styles.sectionTitle}>Level Progress</Text>
            {networkData.levels.map((level: any) => (
              <LevelCard key={level.level} level={level} />
            ))}
          </View>
        )}

        {viewMode === 'tree' && (
          <View style={styles.treeContent}>
            <Text style={styles.sectionTitle}>Network Tree Structure</Text>
            <View style={styles.treeVisualization}>
              <View style={styles.treeNode}>
                <View style={styles.userNode}>
                  <Text style={styles.userNodeText}>You</Text>
                </View>
                <View style={styles.treeBranches}>
                  {networkData.levels.filter((l: any) => l.unlocked && l.current > 0).map((level: any) => (
                    <View key={level.level} style={styles.treeLevelContainer}>
                      <Text style={styles.treeLevelLabel}>L{level.level}</Text>
                      <View style={styles.treeLevelNodes}>
                        {Array.from({ length: Math.min(level.current, 6) }, (_, i) => (
                          <View key={i} style={styles.treeChildNode}>
                            <Text style={styles.treeChildText}>{i + 1}</Text>
                          </View>
                        ))}
                        {level.current > 6 && (
                          <View style={styles.treeMoreNode}>
                            <Text style={styles.treeMoreText}>+{level.current - 6}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {viewMode === 'members' && selectedLevelData && (
          <View style={styles.membersContent}>
            <Text style={styles.sectionTitle}>
              Level {selectedLevel} Members ({selectedLevelData.current})
            </Text>
            {selectedLevelData.members.length > 0 ? (
              selectedLevelData.members.map((member: any) => (
                <MemberCard key={member.id} member={member} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyStateText}>No members at this level yet</Text>
              </View>
            )}
          </View>
        )}
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
  networkHeader: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  networkTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  networkStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  networkStat: {
    alignItems: 'center',
    flex: 1,
  },
  networkStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  networkStatLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
  },
  earningsCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  earningsRow: {
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
    marginBottom: 4,
  },
  earningLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeViewMode: {
    backgroundColor: Colors.primary,
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeViewModeText: {
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  overviewContent: {
    gap: 12,
  },
  levelCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelCardUnlocked: {
    borderColor: Colors.success + '30',
  },
  levelCardLocked: {
    opacity: 0.6,
  },
  levelCardSelected: {
    borderColor: Colors.primary,
  },
  levelHeader: {
    marginBottom: 12,
  },
  levelTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  levelTitleLocked: {
    color: Colors.textSecondary,
  },
  levelStatus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelUnlockDate: {
    fontSize: 12,
    color: Colors.success,
  },
  levelRequirement: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  levelStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  levelStat: {
    alignItems: 'center',
  },
  levelStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  levelStatLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  levelProgress: {
    marginTop: 8,
  },
  levelProgressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: Colors.success,
  },
  levelProgressText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  treeContent: {
    alignItems: 'center',
  },
  treeVisualization: {
    padding: 20,
  },
  treeNode: {
    alignItems: 'center',
  },
  userNode: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  userNodeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  treeBranches: {
    gap: 16,
  },
  treeLevelContainer: {
    alignItems: 'center',
    gap: 8,
  },
  treeLevelLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  treeLevelNodes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  treeChildNode: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  treeChildText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  treeMoreNode: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  treeMoreText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  membersContent: {
    gap: 12,
  },
  memberCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitials: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  memberJoinDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  memberStatusRow: {
    flexDirection: 'row',
  },
  memberStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  memberStatusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  memberEarnings: {
    alignItems: 'flex-end',
  },
  memberEarningAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  memberEarningLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
});
