import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button, Header, ScreenWrapper } from '../../components/common';
import { ProfileMenuItem } from '../../components/profile';

export default function ProfileScreen() {
  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const handleLogout = () => {
    // In a real app, you would clear user session here
    router.replace('/(auth)/sign-in');
  };

  return (
    <ScreenWrapper>
      <Header title="Profile" />
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>RS</Text>
          </View>
          <Text style={styles.name}>Rahul Sharma</Text>
          <Text style={styles.email}>rahul@example.com</Text>
          <Text style={styles.memberSince}>Member since: Aug 2025</Text>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹5,000</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>L3</Text>
            <Text style={styles.statLabel}>Current Level</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Silver</Text>
            <Text style={styles.statLabel}>Plan</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <ProfileMenuItem 
            title="Plans & Subscriptions" 
            icon="newspaper-outline" 
            onPress={() => handleNavigation('/plans')} 
          />
          <ProfileMenuItem 
            title="Earnings & Rewards" 
            icon="trending-up-outline" 
            onPress={() => handleNavigation('/(tabs)/earnings')} 
          />
          <ProfileMenuItem 
            title="Labels & Achievements" 
            icon="ribbon-outline" 
            onPress={() => handleNavigation('/labels')} 
          />
          <ProfileMenuItem 
            title="Withdrawal History" 
            icon="wallet-outline" 
            onPress={() => handleNavigation('/withdrawals')} 
          />
          <ProfileMenuItem 
            title="Settings" 
            icon="settings-outline" 
            onPress={() => handleNavigation('/settings')} 
          />
          <ProfileMenuItem 
            title="Help & Support" 
            icon="help-circle-outline" 
            onPress={() => {}} 
          />
          <ProfileMenuItem 
            title="Refer Friends" 
            icon="share-outline" 
            onPress={() => {}} 
          />
        </View>

        <View style={styles.logoutButtonContainer}>
          <Button title="Logout" onPress={handleLogout} variant="secondary" />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  memberSince: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 8,
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
  menuSection: {
    backgroundColor: '#fff',
  },
  logoutButtonContainer: {
    margin: 16,
  },
});
