import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '../common/Card';
import Button from '../common/Button';

interface LabelReward {
  id: string;
  name: string;
  description: string;
  unlockCondition: string;
  reward: number;
  isUnlocked: boolean;
  icon: string;
}

const LabelRewardsCard: React.FC = () => {
  const labelRewards: LabelReward[] = [
    {
      id: '1',
      name: 'First Contribution',
      description: 'Complete your first daily contribution',
      unlockCondition: 'Make 1 contribution',
      reward: 50,
      isUnlocked: true,
      icon: '💰',
    },
    {
      id: '2',
      name: 'Week Warrior',
      description: 'Complete 7 consecutive days of contribution',
      unlockCondition: 'Contribute for 7 days straight',
      reward: 200,
      isUnlocked: true,
      icon: '🏆',
    },
    {
      id: '3',
      name: 'News Enthusiast',
      description: 'Read 50 news articles',
      unlockCondition: 'Read 50 articles',
      reward: 100,
      isUnlocked: false,
      icon: '📰',
    },
    {
      id: '4',
      name: 'Referral Champion',
      description: 'Refer 10 friends successfully',
      unlockCondition: 'Get 10 successful referrals',
      reward: 1000,
      isUnlocked: false,
      icon: '👥',
    },
    {
      id: '5',
      name: 'Ad Master',
      description: 'Watch 100 advertisement videos',
      unlockCondition: 'Watch 100 ads',
      reward: 300,
      isUnlocked: false,
      icon: '📺',
    },
    {
      id: '6',
      name: 'Monthly Contributor',
      description: 'Complete 30 days of contribution',
      unlockCondition: 'Contribute for 30 days',
      reward: 500,
      isUnlocked: false,
      icon: '📅',
    },
  ];

  const renderReward = ({ item }: { item: LabelReward }) => (
    <View style={[styles.rewardItem, item.isUnlocked && styles.unlockedReward]}>
      <View style={styles.rewardIcon}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>
      
      <View style={styles.rewardContent}>
        <Text style={styles.rewardName}>{item.name}</Text>
        <Text style={styles.rewardDescription}>{item.description}</Text>
        <Text style={styles.unlockCondition}>{item.unlockCondition}</Text>
      </View>
      
      <View style={styles.rewardValueContainer}>
        <Text style={[styles.rewardValue, item.isUnlocked && styles.unlockedValue]}>
          ₹{item.reward}
        </Text>
        {item.isUnlocked && (
          <View style={styles.unlockedBadge}>
            <Text style={styles.unlockedText}>✓</Text>
          </View>
        )}
      </View>
    </View>
  );

  const unlockedRewards = labelRewards.filter(r => r.isUnlocked);
  const totalEarned = unlockedRewards.reduce((sum, r) => sum + r.reward, 0);

  return (
    <Card>
      <Text style={styles.title}>Label Rewards & Unlock Conditions</Text>
      
      <View style={styles.summarySection}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{unlockedRewards.length}</Text>
          <Text style={styles.summaryLabel}>Unlocked</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>₹{totalEarned}</Text>
          <Text style={styles.summaryLabel}>Total Earned</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{labelRewards.length - unlockedRewards.length}</Text>
          <Text style={styles.summaryLabel}>Remaining</Text>
        </View>
      </View>

      <FlatList
        data={labelRewards}
        renderItem={renderReward}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />

      <View style={styles.actionSection}>
        <Text style={styles.actionText}>
          Keep completing activities to unlock more rewards!
        </Text>
        <Button title="View All Activities" onPress={() => {}} variant="secondary" />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  unlockedReward: {
    backgroundColor: '#e8f5e8',
    borderColor: '#28a745',
  },
  rewardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  rewardContent: {
    flex: 1,
    marginRight: 12,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  unlockCondition: {
    fontSize: 12,
    color: '#007bff',
    fontStyle: 'italic',
  },
  rewardValueContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  rewardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  unlockedValue: {
    color: '#28a745',
  },
  unlockedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#28a745',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionSection: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default LabelRewardsCard;
