import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Card from '../common/Card';

const NotificationSettings: React.FC = () => {
  const [earningsNotifications, setEarningsNotifications] = useState(true);
  const [withdrawalNotifications, setWithdrawalNotifications] = useState(true);
  const [newsNotifications, setNewsNotifications] = useState(false);
  const [levelRewardNotifications, setLevelRewardNotifications] = useState(true);
  const [adNotifications, setAdNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  return (
    <Card>
      <Text style={styles.title}>Notification Settings</Text>
      <Text style={styles.subtitle}>Choose what notifications you want to receive</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earnings & Rewards</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Daily Earnings</Text>
            <Text style={styles.settingDescription}>
              Get notified when daily earnings are credited
            </Text>
          </View>
          <Switch
            value={earningsNotifications}
            onValueChange={setEarningsNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={earningsNotifications ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Level Rewards</Text>
            <Text style={styles.settingDescription}>
              Notifications for level progression and rewards
            </Text>
          </View>
          <Switch
            value={levelRewardNotifications}
            onValueChange={setLevelRewardNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={levelRewardNotifications ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Withdrawal Updates</Text>
            <Text style={styles.settingDescription}>
              Status updates for withdrawal requests
            </Text>
          </View>
          <Switch
            value={withdrawalNotifications}
            onValueChange={setWithdrawalNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={withdrawalNotifications ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activities</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>New Ads Available</Text>
            <Text style={styles.settingDescription}>
              Notify when new ad videos are ready
            </Text>
          </View>
          <Switch
            value={adNotifications}
            onValueChange={setAdNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={adNotifications ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>News Updates</Text>
            <Text style={styles.settingDescription}>
              Breaking news and daily updates
            </Text>
          </View>
          <Switch
            value={newsNotifications}
            onValueChange={setNewsNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={newsNotifications ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Marketing</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Promotions & Offers</Text>
            <Text style={styles.settingDescription}>
              Special offers and promotional content
            </Text>
          </View>
          <Switch
            value={marketingNotifications}
            onValueChange={setMarketingNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={marketingNotifications ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Methods</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              In-app notifications
            </Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={pushNotifications ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Email Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive notifications via email
            </Text>
          </View>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={emailNotifications ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>SMS Notifications</Text>
            <Text style={styles.settingDescription}>
              Important updates via SMS
            </Text>
          </View>
          <Switch
            value={smsNotifications}
            onValueChange={setSmsNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={smsNotifications ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#007bff',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default NotificationSettings;
