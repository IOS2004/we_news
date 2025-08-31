import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import Button from '../common/Button';

interface LevelProgressCardProps {
  currentLevel: number;
  currentLevelEarnings: number;
  nextLevelRequirement: number;
  totalReferrals: number;
}

const LevelProgressCard: React.FC<LevelProgressCardProps> = ({
  currentLevel,
  currentLevelEarnings,
  nextLevelRequirement,
  totalReferrals
}) => {
  const progress = currentLevelEarnings / nextLevelRequirement;
  const remainingAmount = nextLevelRequirement - currentLevelEarnings;

  const levelBenefits = {
    1: { reward: 100, description: "Welcome Bonus" },
    2: { reward: 200, description: "Basic Tier" },
    3: { reward: 500, description: "Silver Tier" },
    4: { reward: 1000, description: "Gold Tier" },
    5: { reward: 2000, description: "Platinum Tier" },
  };

  const currentBenefit = levelBenefits[currentLevel as keyof typeof levelBenefits] || 
    { reward: currentLevel * 500, description: `Level ${currentLevel} Tier` };

  return (
    <Card>
      <Text style={styles.title}>Level Rewards (L1-L12)</Text>
      
      <View style={styles.levelSection}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>L{currentLevel}</Text>
        </View>
        <View style={styles.levelInfo}>
          <Text style={styles.levelDescription}>{currentBenefit.description}</Text>
          <Text style={styles.levelReward}>Reward: ₹{currentBenefit.reward}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalReferrals}</Text>
          <Text style={styles.statLabel}>Total Referrals</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹{currentLevelEarnings}</Text>
          <Text style={styles.statLabel}>Level Earnings</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressTitle}>Progress to Level {currentLevel + 1}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
        </View>
        <Text style={styles.progressText}>
          ₹{remainingAmount} more needed for next level
        </Text>
      </View>

      <View style={styles.nextLevelSection}>
        <Text style={styles.nextLevelTitle}>Next Level Benefits:</Text>
        <Text style={styles.nextLevelBenefit}>• Higher daily returns</Text>
        <Text style={styles.nextLevelBenefit}>• Bonus rewards</Text>
        <Text style={styles.nextLevelBenefit}>• Exclusive features</Text>
      </View>

      <Button title="Invite Friends" onPress={() => {}} />
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
  levelSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  levelDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  levelReward: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 5,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  nextLevelSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  nextLevelTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nextLevelBenefit: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});

export default LevelProgressCard;
