import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../common/Card';
import { Colors, Typography, Spacing } from '../../constants/theme';

const NotificationSettings: React.FC = () => {
  const [earningsNotifications, setEarningsNotifications] = useState(true);
  const [withdrawalNotifications, setWithdrawalNotifications] = useState(true);
  const [newsNotifications, setNewsNotifications] = useState(false);
  const [levelRewardNotifications, setLevelRewardNotifications] = useState(true);
  const [adNotifications, setAdNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);

  return (
    <Card style={styles.cardWithPadding}>
      <View style={styles.header}>
        <Ionicons name="notifications" size={24} color={Colors.primary} />
        <Text style={styles.headerTitle}>Notification Settings</Text>
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Daily Earnings</Text>
          <Text style={styles.settingDescription}>
            Get notified when daily earnings are credited
          </Text>
        </View>
        <Switch
          value={earningsNotifications}
          onValueChange={setEarningsNotifications}
          trackColor={{ false: '#E5E7EB', true: Colors.primary }}
          thumbColor={Colors.white}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Level Rewards</Text>
          <Text style={styles.settingDescription}>
            Notifications for level progression and rewards
          </Text>
        </View>
        <Switch
          value={levelRewardNotifications}
          onValueChange={setLevelRewardNotifications}
          trackColor={{ false: '#E5E7EB', true: Colors.primary }}
          thumbColor={Colors.white}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Withdrawal Updates</Text>
          <Text style={styles.settingDescription}>
            Status updates for withdrawal requests
          </Text>
        </View>
        <Switch
          value={withdrawalNotifications}
          onValueChange={setWithdrawalNotifications}
          trackColor={{ false: '#E5E7EB', true: Colors.primary }}
          thumbColor={Colors.white}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>New Ads Available</Text>
          <Text style={styles.settingDescription}>
            Notify when new ad videos are ready
          </Text>
        </View>
        <Switch
          value={adNotifications}
          onValueChange={setAdNotifications}
          trackColor={{ false: '#E5E7EB', true: Colors.primary }}
          thumbColor={Colors.white}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>News Updates</Text>
          <Text style={styles.settingDescription}>
            Breaking news and daily updates
          </Text>
        </View>
        <Switch
          value={newsNotifications}
          onValueChange={setNewsNotifications}
          trackColor={{ false: '#E5E7EB', true: Colors.primary }}
          thumbColor={Colors.white}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Promotional Offers</Text>
          <Text style={styles.settingDescription}>
            Special offers and promotional content
          </Text>
        </View>
        <Switch
          value={marketingNotifications}
          onValueChange={setMarketingNotifications}
          trackColor={{ false: '#E5E7EB', true: Colors.primary }}
          thumbColor={Colors.white}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.base,
  },
  cardWithPadding: {
    padding: Spacing.base,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingContent: {
    flex: 1,
    marginRight: Spacing.base,
  },
  settingLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  settingDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

export default NotificationSettings;
