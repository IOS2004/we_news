import React from 'react';
import { View, Text, StyleSheet, Linking, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../common/Card';
import { Colors, Typography, Spacing } from '../../constants/theme';

const SupportSection: React.FC = () => {
  const handleEmailSupport = () => {
    const email = 'support@wenews.com';
    const subject = 'Support Request';
    const body = 'Please describe your issue here...';
    
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Email app not available');
        }
      })
      .catch(() => Alert.alert('Error', 'Unable to open email app'));
  };

  const handleCallSupport = () => {
    const phoneNumber = 'tel:+911234567890';
    
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          Alert.alert(
            'Call Support',
            'This will open your phone app to call support. Continue?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Call', onPress: () => Linking.openURL(phoneNumber) }
            ]
          );
        } else {
          Alert.alert('Error', 'Phone app not available');
        }
      })
      .catch(() => Alert.alert('Error', 'Unable to open phone app'));
  };

  const handleFAQ = () => {
    Alert.alert('FAQ', 'FAQ section will be available soon!');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy Policy will be displayed here.');
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="help-circle" size={24} color={Colors.primary} />
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>
      
      <TouchableOpacity style={styles.supportItem} onPress={handleEmailSupport}>
        <View style={styles.supportContent}>
          <Text style={styles.supportLabel}>📧 Email Support</Text>
          <Text style={styles.supportDescription}>
            Get help via email - Response within 24 hours
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.supportItem} onPress={handleCallSupport}>
        <View style={styles.supportContent}>
          <Text style={styles.supportLabel}>📞 Phone Support</Text>
          <Text style={styles.supportDescription}>
            Call us: +91 1234567890 (Mon-Fri, 9 AM - 6 PM)
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.supportItem} onPress={handleFAQ}>
        <View style={styles.supportContent}>
          <Text style={styles.supportLabel}>❓ FAQ</Text>
          <Text style={styles.supportDescription}>
            Find answers to common questions
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.supportItem} onPress={handlePrivacyPolicy}>
        <View style={styles.supportContent}>
          <Text style={styles.supportLabel}>🔒 Privacy Policy</Text>
          <Text style={styles.supportDescription}>
            Learn how we protect your data
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>App Version: 1.0.0</Text>
        <Text style={styles.infoText}>Build: 100</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.base,
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
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  supportContent: {
    flex: 1,
    marginRight: Spacing.base,
  },
  supportLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  supportDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  infoSection: {
    marginTop: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: 'center',
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs / 2,
  },
});

export default SupportSection;
