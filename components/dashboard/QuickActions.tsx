import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import Button from '../common/Button';

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
  return (
    <Card>
      <Text style={styles.title}>Quick Actions</Text>
      <Text style={styles.subtitle}>Boost your earnings with these activities</Text>
      
      <View style={styles.actionsGrid}>
        <View style={styles.actionRow}>
          <View style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Text style={styles.iconText}>📺</Text>
            </View>
            <Text style={styles.actionTitle}>Watch Ads</Text>
            <Text style={styles.actionSubtitle}>Earn ₹2-5</Text>
            <Button 
              title="Watch Now" 
              onPress={onWatchAds} 
              variant="secondary"
            />
          </View>
          
          <View style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Text style={styles.iconText}>📱</Text>
            </View>
            <Text style={styles.actionTitle}>Install Apps</Text>
            <Text style={styles.actionSubtitle}>Earn ₹10-50</Text>
            <Button 
              title="Browse" 
              onPress={onInstallApps} 
              variant="secondary"
            />
          </View>
        </View>

        <View style={styles.actionRow}>
          <View style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Text style={styles.iconText}>📊</Text>
            </View>
            <Text style={styles.actionTitle}>View Earnings</Text>
            <Text style={styles.actionSubtitle}>Track progress</Text>
            <Button 
              title="View Details" 
              onPress={onViewEarnings} 
              variant="secondary"
            />
          </View>
          
          <View style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Text style={styles.iconText}>🏆</Text>
            </View>
            <Text style={styles.actionTitle}>Labels</Text>
            <Text style={styles.actionSubtitle}>Unlock rewards</Text>
            <Button 
              title="View Labels" 
              onPress={onViewLabels} 
              variant="secondary"
            />
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
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
  actionsGrid: {
    gap: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default QuickActions;
