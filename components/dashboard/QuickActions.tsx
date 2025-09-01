import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../common/Card';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface QuickActionsProps {
  onWatchAds: () => void;
  onInstallApps: () => void;
  onViewEarnings: () => void;
  onViewLabels: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onWatchAds,
  onInstallApps,
  onViewEarnings,
  onViewLabels
}) => {
  const actionItems = [
    {
      id: 'watch-ads',
      title: 'Watch Ads',
      icon: 'play-circle' as keyof typeof Ionicons.glyphMap,
      iconColor: '#5B7FFF',
      backgroundColor: '#F0F2FF',
      onPress: onWatchAds,
    },
    {
      id: 'install-apps',
      title: 'Install Apps',
      icon: 'download' as keyof typeof Ionicons.glyphMap,
      iconColor: '#00C896',
      backgroundColor: '#F0FFF9',
      onPress: onInstallApps,
    },
    {
      id: 'earnings',
      title: 'Earnings',
      icon: 'bar-chart' as keyof typeof Ionicons.glyphMap,
      iconColor: '#8B5CF6',
      backgroundColor: '#FAF5FF',
      onPress: onViewEarnings,
    },
    {
      id: 'rewards',
      title: 'Rewards',
      icon: 'trophy' as keyof typeof Ionicons.glyphMap,
      iconColor: '#F59E0B',
      backgroundColor: '#FFFBEB',
      onPress: onViewLabels,
    },
  ];

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <Text style={styles.subtitle}>Boost your earnings with these activities</Text>
      
      <View style={styles.actionsGrid}>
        {actionItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.actionCard, { backgroundColor: item.backgroundColor }]}
            onPress={item.onPress}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons 
                name={item.icon} 
                size={24} 
                color={item.iconColor} 
              />
            </View>
            <Text style={styles.actionTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
    textAlign: 'center',
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  actionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    textAlign: 'center',
  },
});

export default QuickActions;
