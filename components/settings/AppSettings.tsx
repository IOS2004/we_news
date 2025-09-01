import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../common/Card';
import Button from '../common/Button';
import { Colors, Typography, Spacing } from '../../constants/theme';

const AppSettings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [dataUsage, setDataUsage] = useState('wifi');
  const [language, setLanguage] = useState('English');

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all temporary data and may improve app performance. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => Alert.alert('Success', 'Cache cleared successfully')
        }
      ]
    );
  };

  const handleDataUsageChange = () => {
    Alert.alert(
      'Data Usage',
      'Choose how the app should use data:',
      [
        { text: 'WiFi Only', onPress: () => setDataUsage('wifi') },
        { text: 'WiFi & Cellular', onPress: () => setDataUsage('both') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Language',
      'Choose your preferred language:',
      [
        { text: 'English', onPress: () => setLanguage('English') },
        { text: 'Hindi', onPress: () => setLanguage('Hindi') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <Card style={styles.cardWithPadding}>
      <View style={styles.header}>
        <Ionicons name="settings" size={24} color={Colors.primary} />
        <Text style={styles.headerTitle}>App Settings</Text>
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Text style={styles.settingDescription}>
            Use dark theme for better night viewing
          </Text>
        </View>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#E5E7EB', true: Colors.primary }}
          thumbColor={Colors.white}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Auto Update News</Text>
          <Text style={styles.settingDescription}>
            Automatically refresh news content
          </Text>
        </View>
        <Switch
          value={autoUpdate}
          onValueChange={setAutoUpdate}
          trackColor={{ false: '#E5E7EB', true: Colors.primary }}
          thumbColor={Colors.white}
        />
      </View>

      <TouchableOpacity style={styles.settingItem} onPress={handleDataUsageChange}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Data Usage</Text>
          <Text style={styles.settingDescription}>
            Current: {dataUsage === 'wifi' ? 'WiFi Only' : 'WiFi & Cellular'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Language</Text>
          <Text style={styles.settingDescription}>
            Current: {language}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.actionSection}>
        <Button
          title="Clear Cache"
          onPress={handleClearCache}
          variant="secondary"
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.base,
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  cardWithPadding: {
    padding: Spacing.lg,
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
  actionSection: {
    marginTop: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});

export default AppSettings;
