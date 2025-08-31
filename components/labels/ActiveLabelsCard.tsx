import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '../common/Card';

interface Label {
  id: string;
  name: string;
  level: number;
  progress: number;
  maxProgress: number;
  reward: number;
  isActive: boolean;
}

const ActiveLabelsCard: React.FC = () => {
  const activeLabels: Label[] = [
    {
      id: '1',
      name: 'Daily Investor',
      level: 3,
      progress: 18,
      maxProgress: 30,
      reward: 500,
      isActive: true,
    },
    {
      id: '2',
      name: 'News Reader',
      level: 2,
      progress: 12,
      maxProgress: 20,
      reward: 200,
      isActive: true,
    },
    {
      id: '3',
      name: 'Referral Master',
      level: 1,
      progress: 5,
      maxProgress: 10,
      reward: 1000,
      isActive: true,
    },
    {
      id: '4',
      name: 'Ad Watcher',
      level: 4,
      progress: 45,
      maxProgress: 50,
      reward: 300,
      isActive: false,
    },
  ];

  const renderLabel = ({ item }: { item: Label }) => {
    const progressPercentage = (item.progress / item.maxProgress) * 100;
    
    return (
      <View style={[styles.labelItem, !item.isActive && styles.inactiveLabel]}>
        <View style={styles.labelHeader}>
          <View style={styles.labelInfo}>
            <Text style={styles.labelName}>{item.name}</Text>
            <Text style={styles.labelLevel}>Level {item.level}</Text>
          </View>
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardAmount}>₹{item.reward}</Text>
            <Text style={styles.rewardLabel}>Reward</Text>
          </View>
        </View>
        
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: item.isActive ? '#28a745' : '#6c757d'
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {item.progress}/{item.maxProgress} {item.isActive ? 'Active' : 'Completed'}
          </Text>
        </View>

        {!item.isActive && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓ Completed</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Card>
      <Text style={styles.title}>Active Labels</Text>
      <Text style={styles.subtitle}>Complete activities to unlock rewards</Text>
      
      <FlatList
        data={activeLabels}
        renderItem={renderLabel}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  labelItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#28a745',
  },
  inactiveLabel: {
    borderColor: '#dee2e6',
    opacity: 0.7,
  },
  labelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelInfo: {
    flex: 1,
  },
  labelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  labelLevel: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  rewardInfo: {
    alignItems: 'center',
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  rewardLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressSection: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  completedBadge: {
    alignSelf: 'center',
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ActiveLabelsCard;
