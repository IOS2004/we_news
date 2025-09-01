import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button, InputField } from '../common';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

const WithdrawalRequestCard: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [loading, setLoading] = useState(false);

  const availableBalance = 1500;
  const minimumWithdrawal = 500;

  const handleWithdrawalRequest = async () => {
    const withdrawalAmount = parseFloat(amount);
    
    if (!amount || !bankAccount || !ifscCode) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (withdrawalAmount < minimumWithdrawal) {
      Alert.alert('Error', `Minimum withdrawal amount is ₹${minimumWithdrawal}`);
      return;
    }

    if (withdrawalAmount > availableBalance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success', 
        'Withdrawal request submitted successfully. It will be processed within 24-48 hours.',
        [{ text: 'OK', onPress: () => {
          setAmount('');
          setBankAccount('');
          setIfscCode('');
        }}]
      );
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Balance Overview Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>₹{availableBalance.toLocaleString()}</Text>
          </View>
          <View style={styles.balanceIcon}>
            <Ionicons name="wallet-outline" size={32} color={Colors.primary} />
          </View>
        </View>
        
        <View style={styles.balanceFooter}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatLabel}>Min. Withdrawal</Text>
            <Text style={styles.quickStatValue}>₹{minimumWithdrawal}</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatLabel}>Processing Time</Text>
            <Text style={styles.quickStatValue}>24-48 hrs</Text>
          </View>
        </View>
      </View>

      {/* Quick Amount Selection */}
      <View style={styles.quickAmountCard}>
        <Text style={styles.sectionTitle}>Quick Amount Selection</Text>
        <View style={styles.quickAmountGrid}>
          {[500, 1000, 1500].map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={[
                styles.quickAmountButton,
                parseInt(amount) === quickAmount && styles.selectedQuickAmount
              ]}
              onPress={() => setAmount(quickAmount.toString())}
              disabled={quickAmount > availableBalance}
            >
              <Text style={[
                styles.quickAmountText,
                parseInt(amount) === quickAmount && styles.selectedQuickAmountText,
                quickAmount > availableBalance && styles.disabledText
              ]}>
                ₹{quickAmount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Withdrawal Form */}
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Withdrawal Details</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Withdrawal Amount</Text>
          <InputField
            label=""
            placeholder={`Enter amount (Min. ₹${minimumWithdrawal})`}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.amountInput}
            leftIcon={<Ionicons name="wallet-outline" size={20} color={Colors.textSecondary} />}
          />
          {amount && parseFloat(amount) > availableBalance && (
            <Text style={styles.errorText}>Amount exceeds available balance</Text>
          )}
          {amount && parseFloat(amount) < minimumWithdrawal && parseFloat(amount) > 0 && (
            <Text style={styles.errorText}>Minimum withdrawal amount is ₹{minimumWithdrawal}</Text>
          )}
        </View>

        <InputField
          label="Bank Account Number"
          placeholder="Bank account number"
          value={bankAccount}
          onChangeText={setBankAccount}
          keyboardType="numeric"
          leftIcon={<Ionicons name="card-outline" size={20} color={Colors.textSecondary} />}
        />
        
        <InputField
          label="IFSC Code"
          placeholder="Enter bank IFSC code"
          value={ifscCode}
          onChangeText={setIfscCode}
          leftIcon={<Ionicons name="business-outline" size={20} color={Colors.textSecondary} />}
        />
      </View>

      {/* Transaction Summary */}
      {amount && (
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Transaction Summary</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Withdrawal Amount</Text>
              <Text style={styles.summaryValue}>₹{parseFloat(amount || '0').toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Processing Fee</Text>
              <Text style={styles.summaryValue}>₹0</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>You will receive</Text>
              <Text style={styles.summaryTotalValue}>₹{parseFloat(amount || '0').toLocaleString()}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Important Information */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Ionicons name="information-circle" size={20} color={Colors.info} />
          <Text style={styles.infoTitle}>Important Information</Text>
        </View>
        <View style={styles.infoList}>
          <Text style={styles.infoItem}>• Processing time: 24-48 business hours</Text>
          <Text style={styles.infoItem}>• No processing fees charged</Text>
          <Text style={styles.infoItem}>• Requires admin verification</Text>
          <Text style={styles.infoItem}>• Ensure bank details are correct</Text>
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.submitButton}>
        <Button 
          title="Submit Withdrawal Request" 
          onPress={handleWithdrawalRequest}
          loading={loading}
          disabled={!amount || !bankAccount || !ifscCode || parseFloat(amount || '0') < minimumWithdrawal || parseFloat(amount || '0') > availableBalance}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  
  // Balance Card Styles
  balanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  balanceIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  quickStatValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },

  // Quick Amount Selection
  quickAmountCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  quickAmountGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  selectedQuickAmount: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  quickAmountText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  selectedQuickAmountText: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
  },
  disabledText: {
    color: Colors.textLight,
  },

  // Form Styles
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 48,
    ...Shadows.sm,
  },
  currencySymbol: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  amountInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    height: 48,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    paddingVertical: 0,
  },
  errorText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  summaryContent: {
    gap: Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  summaryTotalLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  summaryTotalValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success,
  },

  // Info Card
  infoCard: {
    backgroundColor: Colors.info + '10',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.info + '30',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  infoTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.info,
  },
  infoList: {
    gap: Spacing.xs,
  },
  infoItem: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Button
  submitButton: {
    marginTop: Spacing.md,
  },
});

export default WithdrawalRequestCard;
