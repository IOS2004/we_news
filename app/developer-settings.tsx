import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header, Card } from '../components/common';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { useDeveloperSettings } from '../contexts/DeveloperContext';

export default function DeveloperSettingsScreen() {
  const { settings, updateSetting, getActiveTiers, resetSettings } = useDeveloperSettings();

  const resetAllSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all developer settings to default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: resetSettings
        }
      ]
    );
  };

  const exportSettings = () => {
    const settingsJson = JSON.stringify(settings, null, 2);
    Alert.alert('Settings Export', settingsJson);
  };

  const getActiveTierNames = () => {
    const tiers = getActiveTiers();
    if (tiers.length === 0) return 'None';
    if (tiers.length === 1) return tiers[0].charAt(0).toUpperCase() + tiers[0].slice(1);
    return tiers.map((tier: string) => tier.charAt(0).toUpperCase() + tier.slice(1)).join(', ');
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Header 
        title="Developer Settings" 
        canGoBack={true}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <Ionicons name="warning" size={20} color={Colors.warning} />
          <Text style={styles.warningText}>
            Developer only! Changes affect app behavior for testing purposes.
          </Text>
        </View>

        {/* Current Active Tier */}
        <Card style={styles.currentTierCard}>
          <View style={styles.currentTierHeader}>
            <Text style={styles.currentTierTitle}>Active Plans</Text>
            <View style={styles.currentTierBadge}>
              <Text style={styles.currentTierText}>{getActiveTierNames()}</Text>
            </View>
          </View>
          <Text style={styles.currentTierDescription}>
            Currently simulating {getActiveTierNames()} contribution plan(s)
          </Text>
        </Card>

        {/* Tier Subscriptions */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Contribution Plans</Text>
          <Text style={styles.sectionDescription}>
            Simulate multiple contribution plans (multiple plans can be active simultaneously)
          </Text>
          
          <SettingItem
            title="Bronze Contribution Plan"
            description="₹99/month • Basic growth rate"
            icon="medal"
            iconColor="#CD7F32"
            value={settings.bronzeTier}
            onValueChange={(value) => updateSetting('bronzeTier', value)}
          />
          
          <SettingItem
            title="Silver Contribution Plan"
            description="₹299/month • Enhanced growth rate"
            icon="trophy"
            iconColor="#C0C0C0"
            value={settings.silverTier}
            onValueChange={(value) => updateSetting('silverTier', value)}
          />
          
          <SettingItem
            title="Gold Contribution Plan"
            description="₹599/month • Premium growth rate"
            icon="star"
            iconColor="#FFD700"
            value={settings.goldTier}
            onValueChange={(value) => updateSetting('goldTier', value)}
          />
          
          <SettingItem
            title="Platinum Contribution Plan"
            description="₹999/month • Ultimate growth rate"
            icon="diamond"
            iconColor="#E5E4E2"
            value={settings.platinumTier}
            onValueChange={(value) => updateSetting('platinumTier', value)}
          />
        </Card>

        {/* Feature Flags */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Feature Flags</Text>
          <Text style={styles.sectionDescription}>
            Enable/disable experimental features
          </Text>
          
          <SettingItem
            title="Beta Features"
            description="Access to unreleased features"
            icon="flask"
            iconColor={Colors.primary}
            value={settings.betaFeatures}
            onValueChange={(value) => updateSetting('betaFeatures', value)}
          />
          
          <SettingItem
            title="Debug Mode"
            description="Show debug information and logs"
            icon="bug"
            iconColor={Colors.error}
            value={settings.debugMode}
            onValueChange={(value) => updateSetting('debugMode', value)}
          />
          
          <SettingItem
            title="Mock API Data"
            description="Use mock data instead of real API calls"
            icon="server"
            iconColor={Colors.warning}
            value={settings.mockApiData}
            onValueChange={(value) => updateSetting('mockApiData', value)}
          />
          
          <SettingItem
            title="Performance Metrics"
            description="Display performance indicators"
            icon="speedometer"
            iconColor={Colors.success}
            value={settings.showPerformanceMetrics}
            onValueChange={(value) => updateSetting('showPerformanceMetrics', value)}
          />
        </Card>

        {/* Earnings Simulation */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Simulation</Text>
          <Text style={styles.sectionDescription}>
            Simulate different earning scenarios
          </Text>
          
          <SettingItem
            title="High Earnings Mode"
            description="Show inflated earning amounts"
            icon="trending-up"
            iconColor={Colors.success}
            value={settings.simulateHighEarnings}
            onValueChange={(value) => updateSetting('simulateHighEarnings', value)}
          />
          
          <SettingItem
            title="Low Earnings Mode"
            description="Show minimal earning amounts"
            icon="trending-down"
            iconColor={Colors.error}
            value={settings.simulateLowEarnings}
            onValueChange={(value) => updateSetting('simulateLowEarnings', value)}
          />
          
          <SettingItem
            title="Test Transactions"
            description="Show dummy transaction history"
            icon="list"
            iconColor={Colors.textSecondary}
            value={settings.showTestTransactions}
            onValueChange={(value) => updateSetting('showTestTransactions', value)}
          />
        </Card>

        {/* UI Testing */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>UI Testing</Text>
          <Text style={styles.sectionDescription}>
            Visual debugging and testing options
          </Text>
          
          <SettingItem
            title="Placeholder Content"
            description="Show loading placeholders"
            icon="duplicate"
            iconColor={Colors.textSecondary}
            value={settings.showPlaceholderContent}
            onValueChange={(value) => updateSetting('showPlaceholderContent', value)}
          />
          
          <SettingItem
            title="Animations"
            description="Enable/disable UI animations"
            icon="play"
            iconColor={Colors.primary}
            value={settings.enableAnimations}
            onValueChange={(value) => updateSetting('enableAnimations', value)}
          />
          
          <SettingItem
            title="Component Borders"
            description="Show borders around components"
            icon="square-outline"
            iconColor={Colors.warning}
            value={settings.showComponentBorders}
            onValueChange={(value) => updateSetting('showComponentBorders', value)}
          />
        </Card>

        {/* Actions */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={exportSettings}>
            <Ionicons name="download" size={20} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Export Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.resetButton]} onPress={resetAllSettings}>
            <Ionicons name="refresh" size={20} color={Colors.error} />
            <Text style={[styles.actionButtonText, styles.resetButtonText]}>Reset All Settings</Text>
          </TouchableOpacity>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💡 These settings only affect the development environment
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

interface SettingItemProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  description,
  icon,
  iconColor,
  value,
  onValueChange
}) => {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: `${iconColor}15` }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={value ? Colors.white : Colors.textSecondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: Spacing.xl * 2,
  },
  
  // Warning Banner
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.warning}15`,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  warningText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    color: Colors.warning,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },

  // Current Tier Card
  currentTierCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  currentTierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  currentTierTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  currentTierBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  currentTierText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  currentTierDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },

  // Sections
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },

  // Setting Items
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },

  // Actions
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  actionButtonText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
  },
  resetButton: {
    backgroundColor: `${Colors.error}10`,
    borderWidth: 1,
    borderColor: `${Colors.error}30`,
  },
  resetButtonText: {
    color: Colors.error,
  },

  // Footer
  footer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
