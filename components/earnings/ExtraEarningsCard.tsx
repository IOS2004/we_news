import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import Button from '../common/Button';

interface ExtraEarningsCardProps {
  adVideoEarnings: number;
  appInstallEarnings: number;
  availableAds: number;
  availableApps: number;
}

const ExtraEarningsCard: React.FC<ExtraEarningsCardProps> = ({
  adVideoEarnings,
  appInstallEarnings,
  availableAds,
  availableApps
}) => {
  return (
    <Card>
      <Text style={styles.title}>Extra Earnings</Text>
      <Text style={styles.subtitle}>Boost your income with these activities</Text>
      
      <View style={styles.earningOption}>
        <View style={styles.optionIcon}>
          <Text style={styles.iconText}>📺</Text>
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Watch Ad Videos</Text>
          <Text style={styles.optionDescription}>
            Earn ₹2-5 per video • {availableAds} videos available
          </Text>
          <Text style={styles.earningsToday}>
            Today's earnings: ₹{adVideoEarnings}
          </Text>
        </View>
        <Button 
          title="Watch Now" 
          onPress={() => {}} 
          variant="secondary"
        />
      </View>

      <View style={styles.earningOption}>
        <View style={styles.optionIcon}>
          <Text style={styles.iconText}>📱</Text>
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Install Partner Apps</Text>
          <Text style={styles.optionDescription}>
            Earn ₹10-50 per app • {availableApps} apps available
          </Text>
          <Text style={styles.earningsToday}>
            Today's earnings: ₹{appInstallEarnings}
          </Text>
        </View>
        <Button 
          title="Browse Apps" 
          onPress={() => {}} 
          variant="secondary"
        />
      </View>

      <View style={styles.tipSection}>
        <Text style={styles.tipTitle}>💡 Tip</Text>
        <Text style={styles.tipText}>
          Complete all daily activities to maximize your earnings potential!
        </Text>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Extra Earnings Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Today:</Text>
          <Text style={styles.summaryValue}>₹{adVideoEarnings + appInstallEarnings}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>This Week:</Text>
          <Text style={styles.summaryValue}>₹{(adVideoEarnings + appInstallEarnings) * 7}</Text>
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
  earningOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  optionContent: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  earningsToday: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: 'bold',
  },
  tipSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
  },
  summarySection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
});

export default ExtraEarningsCard;
