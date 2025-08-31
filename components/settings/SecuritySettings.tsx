import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import Card from '../common/Card';
import Button from '../common/Button';
import InputField from '../common/InputField';

const SecuritySettings: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    Alert.alert('Success', 'Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Card>
      <Text style={styles.title}>Security Settings</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
          <Text style={styles.settingDescription}>
            Add an extra layer of security to your account
          </Text>
        </View>
        <Switch
          value={twoFactorEnabled}
          onValueChange={setTwoFactorEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={twoFactorEnabled ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Biometric Authentication</Text>
          <Text style={styles.settingDescription}>
            Use fingerprint or face recognition to unlock
          </Text>
        </View>
        <Switch
          value={biometricEnabled}
          onValueChange={setBiometricEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={biometricEnabled ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <View style={styles.passwordSection}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        
        <InputField
          label="Current Password"
          placeholder="Enter current password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />
        
        <InputField
          label="New Password"
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        
        <InputField
          label="Confirm New Password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        
        <Button
          title="Change Password"
          onPress={handlePasswordChange}
          disabled={!currentPassword || !newPassword || !confirmPassword}
        />
      </View>

      <View style={styles.securityInfo}>
        <Text style={styles.infoTitle}>Security Tips:</Text>
        <Text style={styles.infoText}>• Use a strong, unique password</Text>
        <Text style={styles.infoText}>• Enable two-factor authentication</Text>
        <Text style={styles.infoText}>• Never share your login credentials</Text>
        <Text style={styles.infoText}>• Log out from shared devices</Text>
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  passwordSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  securityInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default SecuritySettings;
