import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import Card from '../common/Card';
import Button from '../common/Button';

const AppSettings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [dataUsage, setDataUsage] = useState('wifi'); // 'wifi', 'cellular', 'both'
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('INR');

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all temporary data and may improve app performance. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          }
        }
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all app settings to default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setDarkMode(false);
            setAutoUpdate(true);
            setDataUsage('wifi');
            setLanguage('English');
            setCurrency('INR');
            Alert.alert('Success', 'Settings reset to default');
          }
        }
      ]
    );
  };

  return (
    <Card>
      <Text style={styles.title}>App Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Use dark theme for better night viewing
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Updates</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Auto Update News</Text>
            <Text style={styles.settingDescription}>
              Automatically refresh news content
            </Text>
          </View>
          <Switch
            value={autoUpdate}
            onValueChange={setAutoUpdate}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={autoUpdate ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Data Usage</Text>
            <Text style={styles.settingDescription}>
              Currently: {dataUsage === 'wifi' ? 'WiFi Only' : dataUsage === 'cellular' ? 'Cellular Only' : 'WiFi & Cellular'}
            </Text>
          </View>
          <Button
            title="Change"
            onPress={() => {
              Alert.alert(
                'Data Usage',
                'Choose your preferred data usage setting',
                [
                  { text: 'WiFi Only', onPress: () => setDataUsage('wifi') },
                  { text: 'Cellular Only', onPress: () => setDataUsage('cellular') },
                  { text: 'Both', onPress: () => setDataUsage('both') },
                  { text: 'Cancel', style: 'cancel' }
                ]
              );
            }}
            variant="secondary"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Language</Text>
            <Text style={styles.settingDescription}>
              Current: {language}
            </Text>
          </View>
          <Button
            title="Change"
            onPress={() => {
              Alert.alert(
                'Language',
                'Choose your preferred language',
                [
                  { text: 'English', onPress: () => setLanguage('English') },
                  { text: 'हिंदी', onPress: () => setLanguage('Hindi') },
                  { text: 'Cancel', style: 'cancel' }
                ]
              );
            }}
            variant="secondary"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Currency</Text>
            <Text style={styles.settingDescription}>
              Current: {currency}
            </Text>
          </View>
          <Button
            title="Change"
            onPress={() => {
              Alert.alert(
                'Currency',
                'Choose your preferred currency',
                [
                  { text: 'INR (₹)', onPress: () => setCurrency('INR') },
                  { text: 'USD ($)', onPress: () => setCurrency('USD') },
                  { text: 'Cancel', style: 'cancel' }
                ]
              );
            }}
            variant="secondary"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage</Text>
        
        <View style={styles.actionButtons}>
          <Button
            title="Clear Cache"
            onPress={handleClearCache}
            variant="secondary"
          />
          
          <Button
            title="Reset All Settings"
            onPress={handleResetSettings}
            variant="secondary"
          />
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>App Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version:</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Build:</Text>
          <Text style={styles.infoValue}>2025.08.31</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Platform:</Text>
          <Text style={styles.infoValue}>React Native</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  actionButtons: {
    gap: 12,
  },
  infoSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AppSettings;
