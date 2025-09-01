import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/common';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export default function ProfileScreen() {
  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const handleLogout = () => {
    // In a real app, you would clear user session here
    router.replace('/(auth)/sign-in');
  };

  const handleViewProfile = () => {
    console.log('View profile pressed');
  };

  return (
    <ScreenWrapper style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>RS</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>Rahul Sharma</Text>
              <TouchableOpacity style={styles.viewProfileButton} onPress={handleViewProfile}>
                <Text style={styles.viewProfileText}>View profile</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Earnings & Plans Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings & Plans</Text>
          <MenuItem 
            title="My Wallet" 
            icon="wallet-outline" 
            onPress={() => handleNavigation('/(tabs)/wallet')} 
          />
          <MenuItem 
            title="My Earnings" 
            icon="trending-up-outline" 
            onPress={() => handleNavigation('/(tabs)/earnings')} 
          />
          <MenuItem 
            title="My Plans" 
            icon="card-outline" 
            onPress={() => handleNavigation('/plans')} 
          />
          <MenuItem 
            title="My Withdrawals" 
            icon="arrow-down-circle-outline" 
            onPress={() => handleNavigation('/withdrawals')} 
          />
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <MenuItem 
            title="My Labels" 
            icon="pricetag-outline" 
            onPress={() => handleNavigation('/labels')} 
          />
        </View>

        {/* Community Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community</Text>
          <MenuItem 
            title="Community Feed" 
            icon="people-outline" 
            onPress={() => {}} 
          />
          <MenuItem 
            title="Community Benefits" 
            icon="gift-outline" 
            onPress={() => {}} 
          />
        </View>

        {/* Other Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other</Text>
          <MenuItem 
            title="Refer & Earn" 
            icon="share-outline" 
            onPress={() => {}} 
          />
          <MenuItem 
            title="Help & Support" 
            icon="help-circle-outline" 
            onPress={() => handleNavigation('/settings')} 
          />
          <MenuItem 
            title="Settings" 
            icon="settings-outline" 
            onPress={() => handleNavigation('/settings')} 
          />
          <MenuItem 
            title="Logout" 
            icon="log-out-outline" 
            onPress={handleLogout}
            isLogout 
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

interface MenuItemProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isLogout?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, icon, onPress, isLogout = false }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons 
          name={icon} 
          size={22} 
          color={isLogout ? Colors.error : Colors.textSecondary} 
        />
        <Text style={[styles.menuItemText, isLogout && styles.logoutText]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    padding: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  avatarText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnPrimary,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    marginRight: Spacing.xs,
  },
  section: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    // paddingBottom: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    marginLeft: Spacing.md,
  },
  logoutText: {
    color: Colors.error,
  },
});
