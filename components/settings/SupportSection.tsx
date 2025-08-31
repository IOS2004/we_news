import React from 'react';
import { View, Text, StyleSheet, Linking, Alert } from 'react-native';
import Card from '../common/Card';
import Button from '../common/Button';

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

  const handleWhatsAppSupport = () => {
    const phoneNumber = '1234567890';
    const message = 'Hello, I need help with my WeNews account.';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Error', 'WhatsApp not installed');
        }
      })
      .catch(() => Alert.alert('Error', 'Unable to open WhatsApp'));
  };

  const handleFAQ = () => {
    Alert.alert('FAQ', 'FAQ section will be available soon!');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy Policy will be displayed here.');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Terms of Service will be displayed here.');
  };

  return (
    <Card>
      <Text style={styles.title}>Help & Support</Text>
      <Text style={styles.subtitle}>Get help when you need it</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Support</Text>
        
        <View style={styles.contactOption}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>📧 Email Support</Text>
            <Text style={styles.contactDescription}>
              Get help via email - Response within 24 hours
            </Text>
          </View>
          <Button title="Email" onPress={handleEmailSupport} variant="secondary" />
        </View>

        <View style={styles.contactOption}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>📞 Phone Support</Text>
            <Text style={styles.contactDescription}>
              Call us: +91 1234567890 (Mon-Fri, 9 AM - 6 PM)
            </Text>
          </View>
          <Button title="Call" onPress={handleCallSupport} variant="secondary" />
        </View>

        <View style={styles.contactOption}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>💬 WhatsApp Support</Text>
            <Text style={styles.contactDescription}>
              Quick chat support via WhatsApp
            </Text>
          </View>
          <Button title="Chat" onPress={handleWhatsAppSupport} variant="secondary" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Self Help</Text>
        
        <View style={styles.helpOptions}>
          <Button title="Frequently Asked Questions" onPress={handleFAQ} variant="secondary" />
          <Button title="User Guide" onPress={() => Alert.alert('User Guide', 'User guide coming soon!')} variant="secondary" />
          <Button title="Video Tutorials" onPress={() => Alert.alert('Tutorials', 'Video tutorials coming soon!')} variant="secondary" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        
        <View style={styles.legalOptions}>
          <Button title="Privacy Policy" onPress={handlePrivacyPolicy} variant="secondary" />
          <Button title="Terms of Service" onPress={handleTermsOfService} variant="secondary" />
          <Button title="Refund Policy" onPress={() => Alert.alert('Refund Policy', 'Refund policy coming soon!')} variant="secondary" />
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Support Hours</Text>
        <Text style={styles.infoText}>Monday - Friday: 9:00 AM - 6:00 PM IST</Text>
        <Text style={styles.infoText}>Saturday: 10:00 AM - 4:00 PM IST</Text>
        <Text style={styles.infoText}>Sunday: Closed</Text>
        <Text style={styles.infoText}>Emergency support available 24/7 via email</Text>
      </View>

      <View style={styles.feedbackSection}>
        <Text style={styles.feedbackTitle}>Help us improve!</Text>
        <Text style={styles.feedbackText}>
          Your feedback helps us provide better support. Rate your experience and let us know how we can improve.
        </Text>
        <Button 
          title="Send Feedback" 
          onPress={() => Alert.alert('Feedback', 'Feedback form coming soon!')} 
        />
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#007bff',
  },
  contactOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactInfo: {
    flex: 1,
    marginRight: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: '#666',
  },
  helpOptions: {
    gap: 12,
  },
  legalOptions: {
    gap: 12,
  },
  infoSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
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
  feedbackSection: {
    backgroundColor: '#e8f4fd',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default SupportSection;
