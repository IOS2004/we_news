import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header } from '../../../components/common';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../constants/theme';
import { useWallet } from '../../../contexts/WalletContext';
import withdrawalService, { WithdrawalRequest } from '../../../services/withdrawalService';
import { formatCurrency, checkSufficientBalance } from '../../../utils/walletUtils';
import { showToast } from '../../../utils/toast';

// Minimum withdrawal amount
const MIN_WITHDRAWAL_AMOUNT = 100;
const MAX_WITHDRAWAL_AMOUNT = 50000;

export default function WithdrawalsScreen() {
  const { balance, refreshWallet } = useWallet();

  // Form state
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(true);

  // Load withdrawal history
  useEffect(() => {
    loadWithdrawalHistory();
  }, []);

  const loadWithdrawalHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const history = await withdrawalService.getMyWithdrawals(1, 20);
      setWithdrawals(history);
    } catch (error: any) {
      console.error('Error loading withdrawal history:', error);
      showToast.error({
        title: 'Error',
        message: 'Failed to load withdrawal history',
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadWithdrawalHistory(), refreshWallet()]);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Validate form
  const validateForm = (): { valid: boolean; error?: string } => {
    // Amount validation
    const withdrawalAmount = parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      return { valid: false, error: 'Please enter a valid amount' };
    }

    if (withdrawalAmount < MIN_WITHDRAWAL_AMOUNT) {
      return {
        valid: false,
        error: `Minimum withdrawal amount is ${formatCurrency(MIN_WITHDRAWAL_AMOUNT)}`,
      };
    }

    if (withdrawalAmount > MAX_WITHDRAWAL_AMOUNT) {
      return {
        valid: false,
        error: `Maximum withdrawal amount is ${formatCurrency(MAX_WITHDRAWAL_AMOUNT)}`,
      };
    }

    // Balance check
    const balanceCheck = checkSufficientBalance(withdrawalAmount, balance);
    if (!balanceCheck.sufficient) {
      return {
        valid: false,
        error: `Insufficient balance. You need ${formatCurrency(balanceCheck.shortfall)} more`,
      };
    }

    // Account number validation
    if (!withdrawalService.validateAccountNumber(accountNumber)) {
      return {
        valid: false,
        error: 'Please enter a valid account number (9-18 digits)',
      };
    }

    // IFSC validation
    if (!withdrawalService.validateIFSC(ifscCode)) {
      return {
        valid: false,
        error: 'Please enter a valid IFSC code (e.g., SBIN0001234)',
      };
    }

    // Account holder name validation
    if (!accountHolderName.trim() || accountHolderName.trim().length < 3) {
      return {
        valid: false,
        error: 'Please enter valid account holder name',
      };
    }

    // Bank name validation
    if (!bankName.trim() || bankName.trim().length < 3) {
      return {
        valid: false,
        error: 'Please enter valid bank name',
      };
    }

    return { valid: true };
  };

  // Handle withdrawal request
  const handleWithdrawal = async () => {
    // Validate form
    const validation = validateForm();
    if (!validation.valid) {
      Alert.alert('Validation Error', validation.error);
      return;
    }

    const withdrawalAmount = parseFloat(amount);

    // Confirm withdrawal
    Alert.alert(
      'Confirm Withdrawal',
      `You are about to request a withdrawal of ${formatCurrency(withdrawalAmount)} to your bank account.\n\nAccount: ${withdrawalService.maskAccountNumber(accountNumber)}\nIFSC: ${ifscCode}\n\nProcessing time: 1-3 business days`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: submitWithdrawal,
        },
      ]
    );
  };

  // Submit withdrawal
  const submitWithdrawal = async () => {
    try {
      setIsSubmitting(true);

      const result = await withdrawalService.requestWithdrawal({
        amount: parseFloat(amount),
        bankAccountNumber: accountNumber,
        accountHolderName: accountHolderName.trim(),
        ifscCode: ifscCode.toUpperCase().trim(),
      });

      // Clear form
      setAmount('');
      setAccountNumber('');
      setAccountHolderName('');
      setIfscCode('');
      setBankName('');

      // Refresh wallet and history
      await Promise.all([refreshWallet(), loadWithdrawalHistory()]);

      // Show success
      showToast.success({
        title: 'Withdrawal Requested',
        message: `Your withdrawal request of ${formatCurrency(result.withdrawalRequest.amount)} has been submitted successfully. You'll receive the amount in 1-3 business days.`,
      });

      // Switch to history view
      setShowForm(false);
    } catch (error: any) {
      console.error('Error requesting withdrawal:', error);
      Alert.alert(
        'Withdrawal Failed',
        error.message || 'Failed to process withdrawal request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel withdrawal
  const handleCancelWithdrawal = async (withdrawalId: string) => {
    Alert.alert(
      'Cancel Withdrawal',
      'Are you sure you want to cancel this withdrawal request? The amount will be credited back to your wallet.',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await withdrawalService.cancelWithdrawal(withdrawalId);
              await Promise.all([refreshWallet(), loadWithdrawalHistory()]);

              showToast.success({
                title: 'Withdrawal Cancelled',
                message: 'Your withdrawal request has been cancelled',
              });
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel withdrawal');
            }
          },
        },
      ]
    );
  };

  // Render withdrawal card
  const renderWithdrawalCard = (withdrawal: WithdrawalRequest) => {
    const statusColor = withdrawalService.getStatusColor(withdrawal.status);
    const statusIcon = withdrawalService.getStatusIcon(withdrawal.status);
    const statusLabel = withdrawalService.getStatusLabel(withdrawal.status);

    return (
      <View key={withdrawal.id} style={styles.withdrawalCard}>
        <View style={styles.withdrawalHeader}>
          <View style={styles.withdrawalInfo}>
            <Text style={styles.withdrawalAmount}>{formatCurrency(withdrawal.amount)}</Text>
            <Text style={styles.withdrawalDate}>
              {new Date(withdrawal.requestDate).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Ionicons name={statusIcon as any} size={12} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.withdrawalDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account:</Text>
            <Text style={styles.detailValue}>
              {withdrawalService.maskAccountNumber(withdrawal.bankAccountNumber)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>IFSC:</Text>
            <Text style={styles.detailValue}>{withdrawal.ifscCode}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Holder:</Text>
            <Text style={styles.detailValue}>{withdrawal.accountHolderName}</Text>
          </View>
        </View>

        {withdrawal.status === 'pending' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelWithdrawal(withdrawal.id)}
          >
            <Text style={styles.cancelButtonText}>Cancel Request</Text>
          </TouchableOpacity>
        )}

        {withdrawal.status === 'rejected' && withdrawal.rejectionReason && (
          <View style={styles.rejectionReason}>
            <Ionicons name="alert-circle" size={16} color={Colors.error} />
            <Text style={styles.rejectionText}>{withdrawal.rejectionReason}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Header title="Withdrawals" />

      {/* Tab Toggle */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, showForm && styles.activeTab]}
          onPress={() => setShowForm(true)}
        >
          <Text style={[styles.tabText, showForm && styles.activeTabText]}>New Withdrawal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, !showForm && styles.activeTab]}
          onPress={() => setShowForm(false)}
        >
          <Text style={[styles.tabText, !showForm && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {showForm ? (
          // Withdrawal Form
          <View style={styles.formContainer}>
            {/* Balance Card */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
              <Text style={styles.balanceHint}>
                Min: {formatCurrency(MIN_WITHDRAWAL_AMOUNT)} • Max:{' '}
                {formatCurrency(MAX_WITHDRAWAL_AMOUNT)}
              </Text>
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Withdrawal Amount *</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  editable={!isSubmitting}
                />
              </View>
            </View>

            {/* Account Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Number *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter account number"
                keyboardType="numeric"
                value={accountNumber}
                onChangeText={setAccountNumber}
                editable={!isSubmitting}
                maxLength={18}
              />
            </View>

            {/* Account Holder Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Holder Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter account holder name"
                value={accountHolderName}
                onChangeText={setAccountHolderName}
                editable={!isSubmitting}
                autoCapitalize="words"
              />
            </View>

            {/* IFSC Code */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>IFSC Code *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter IFSC code (e.g., SBIN0001234)"
                value={ifscCode}
                onChangeText={(text) => setIfscCode(text.toUpperCase())}
                editable={!isSubmitting}
                autoCapitalize="characters"
                maxLength={11}
              />
            </View>

            {/* Bank Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bank Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter bank name"
                value={bankName}
                onChangeText={setBankName}
                editable={!isSubmitting}
                autoCapitalize="words"
              />
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color={Colors.info} />
              <Text style={styles.infoText}>
                Withdrawal requests are processed within 1-3 business days. Please ensure your bank
                details are correct.
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleWithdrawal}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.textOnPrimary} />
              ) : (
                <Text style={styles.submitButtonText}>Request Withdrawal</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          // Withdrawal History
          <View style={styles.historyContainer}>
            {isLoadingHistory ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading withdrawal history...</Text>
              </View>
            ) : withdrawals.length > 0 ? (
              withdrawals.map(renderWithdrawalCard)
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="cash-outline" size={64} color={Colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Withdrawals Yet</Text>
                <Text style={styles.emptyText}>
                  Your withdrawal requests will appear here
                </Text>
                <TouchableOpacity
                  style={styles.newWithdrawalButton}
                  onPress={() => setShowForm(true)}
                >
                  <Text style={styles.newWithdrawalButtonText}>Request Withdrawal</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    ...Shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.textOnPrimary,
    fontWeight: Typography.fontWeight.bold,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: Spacing.lg,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  balanceLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textOnPrimary + 'CC',
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnPrimary,
    marginBottom: Spacing.xs,
  },
  balanceHint: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textOnPrimary + '99',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    ...Shadows.sm,
  },
  currencySymbol: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    paddingVertical: Spacing.md,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    ...Shadows.sm,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.info + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.info,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnPrimary,
  },
  historyContainer: {
    padding: Spacing.lg,
  },
  loadingContainer: {
    paddingVertical: Spacing['3xl'],
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  withdrawalCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  withdrawalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  withdrawalInfo: {
    flex: 1,
  },
  withdrawalAmount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  withdrawalDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  withdrawalDetails: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.error,
  },
  rejectionReason: {
    flexDirection: 'row',
    backgroundColor: Colors.error + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  rejectionText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
    lineHeight: 20,
  },
  emptyState: {
    paddingVertical: Spacing['3xl'],
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  newWithdrawalButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  newWithdrawalButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
