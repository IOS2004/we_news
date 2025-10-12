import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header, Button } from '../components/common';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { showToast } from '../utils/toast';
import walletApi, { TopupRequest } from '../services/walletApi';
import { processCashfreePaymentSimple } from '../utils/cashfree';

// Predefined amounts for quick selection
const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

// Payment methods
const paymentMethods = [
  {
    id: 'cashfree',
    name: 'UPI',
    icon: 'phone-portrait-outline',
    description: 'Pay using UPI ID or QR code',
    isAvailable: true,
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: 'card-outline',
    description: 'Visa, Mastercard, RuPay',
    isAvailable: true,
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: 'card-outline',
    description: 'Pay using your bank account',
    isAvailable: true,
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    icon: 'wallet-outline',
    description: 'Paytm, PhonePe, GooglePay',
    isAvailable: true,
  },
];

export default function AddMoneyScreen() {
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cashfree');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    // All payment methods use cashfree gateway
    setSelectedPaymentMethod('cashfree');
  };

  const handleAddMoney = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast.error({
        title: 'Invalid Amount',
        message: 'Please enter a valid amount'
      });
      return;
    }

    if (parseFloat(amount) < 10) {
      showToast.error({
        title: 'Minimum Amount',
        message: 'Minimum amount to add is ₹10'
      });
      return;
    }

    if (parseFloat(amount) > 100000) {
      showToast.error({
        title: 'Maximum Amount',
        message: 'Maximum amount to add is ₹1,00,000'
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Call wallet topup API
      const topupRequest: TopupRequest = {
        amount: parseFloat(amount),
        paymentMethod: 'cashfree',
      };

      console.log('Initiating wallet topup:', topupRequest);

      const response = await walletApi.topup(topupRequest);

      console.log('Topup API response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Failed to initiate payment');
      }

      // Extract payment details from response
      const { transactionId, amounts, paymentResponse, userDetails } = response.data;
      
      // Log the full paymentResponse to debug
      console.log('Payment Response:', JSON.stringify(paymentResponse, null, 2));
      console.log('Payment Data:', JSON.stringify(paymentResponse.paymentData, null, 2));
      
      const { payment_session_id, order_id, customer_details } = paymentResponse.paymentData;

      // Validate payment session ID
      if (!payment_session_id) {
        console.error('Payment session ID is missing!');
        console.error('Available keys:', Object.keys(paymentResponse.paymentData));
        throw new Error('Payment session ID not received from server');
      }

      console.log('Opening Cashfree payment gateway...');
      console.log('Transaction ID:', transactionId);
      console.log('Final Amount:', amounts.finalAmount);
      console.log('Payment Session ID:', payment_session_id);

      // Open Cashfree payment gateway with proper error handling
      try {
        await processCashfreePaymentSimple(
          transactionId,
          payment_session_id,
          {
            onSuccess: async (data) => {
              console.log('Payment successful:', data);
              setIsProcessing(false);
              
              showToast.success({
                title: 'Payment Successful!',
                message: `₹${amounts.creditAmount} has been added to your wallet.`
              });

              // Reset form
              setAmount('');
              setSelectedPaymentMethod('cashfree');

              // Navigate back after short delay
              setTimeout(() => {
                router.back();
              }, 1500);
            },
            onFailure: (error) => {
              console.error('Payment failed:', error);
              setIsProcessing(false);
              
              showToast.error({
                title: 'Payment Failed',
                message: error.error?.message || 'Payment was not completed. Please try again.'
              });
            },
            onError: (error) => {
              console.error('Payment error:', error);
              setIsProcessing(false);
              
              showToast.error({
                title: 'Payment Error',
                message: 'An error occurred during payment. Please try again.'
              });
            },
          }
        );
      } catch (sdkError: any) {
        console.error('Cashfree SDK initialization error:', sdkError);
        setIsProcessing(false);
        
        showToast.error({
          title: 'SDK Error',
          message: sdkError.message || 'Failed to initialize payment gateway. Please try again.'
        });
      }
    } catch (error: any) {
      console.error('Wallet topup error:', error);
      setIsProcessing(false);
      
      showToast.error({
        title: 'Error',
        message: error.response?.data?.message || error.message || 'Failed to initiate payment. Please try again.'
      });
    }
  };

  const handlePaymentSuccess = async () => {
    // This function is no longer needed as Cashfree handles the payment
    // Kept for backward compatibility
  };

  const handlePaymentFailure = (errorMessage: string) => {
    // This function is no longer needed as Cashfree handles the payment
    // Kept for backward compatibility
  };

  const handlePaymentClose = () => {
    // This function is no longer needed as Cashfree handles the payment
    // Kept for backward compatibility
  };

  const formatAmount = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts[1];
    }
    
    return numericValue;
  };

  return (
    <ScreenWrapper style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Money</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Amount Input Section */}
        <View style={styles.amountSection}>
          <Text style={styles.sectionTitle}>Enter Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={(text) => setAmount(formatAmount(text))}
              placeholder="0"
              keyboardType="numeric"
              maxLength={8}
            />
          </View>
          <Text style={styles.amountLimits}>Minimum: ₹10 | Maximum: ₹1,00,000</Text>
        </View>

        {/* Quick Amount Selection */}
        <View style={styles.quickAmountSection}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAmountGrid}>
            {quickAmounts.map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.quickAmountButton,
                  amount === value.toString() && styles.quickAmountButtonSelected,
                ]}
                onPress={() => handleQuickAmount(value)}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    amount === value.toString() && styles.quickAmountTextSelected,
                  ]}
                >
                  ₹{value.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethodSection}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod === 'cashfree' && styles.paymentMethodCardSelected,
                !method.isAvailable && styles.paymentMethodCardDisabled,
              ]}
              onPress={() => method.isAvailable && handlePaymentMethodSelect(method.id)}
              disabled={!method.isAvailable}
            >
              <View style={styles.paymentMethodLeft}>
                <View style={[
                  styles.paymentMethodIcon,
                  selectedPaymentMethod === 'cashfree' && styles.paymentMethodIconSelected,
                ]}>
                  <Ionicons
                    name={method.icon as any}
                    size={24}
                    color={selectedPaymentMethod === 'cashfree' ? Colors.textOnPrimary : Colors.primary}
                  />
                </View>
                <View style={styles.paymentMethodInfo}>
                  <Text style={[
                    styles.paymentMethodName,
                    !method.isAvailable && styles.paymentMethodNameDisabled,
                  ]}>
                    {method.name}
                  </Text>
                  <Text style={[
                    styles.paymentMethodDescription,
                    !method.isAvailable && styles.paymentMethodDescriptionDisabled,
                  ]}>
                    {method.description}
                  </Text>
                </View>
              </View>
              {selectedPaymentMethod === 'cashfree' && (
                <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
              )}
              {!method.isAvailable && (
                <Text style={styles.comingSoonText}>Coming Soon</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Info */}
        <View style={styles.securitySection}>
          <View style={styles.securityHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.success} />
            <Text style={styles.securityTitle}>Secure Payment</Text>
          </View>
          <Text style={styles.securityDescription}>
            Your payment information is encrypted and secure. We use industry-standard security protocols to protect your data.
          </Text>
        </View>

        {/* Add Money Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={isProcessing ? 'Processing...' : `Pay ₹${amount || '0'}`}
            onPress={handleAddMoney}
            disabled={!amount || isProcessing}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.primary,
    ...Shadows.md,
  },
  backButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.whiteTransparent,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnPrimary,
  },
  helpButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.whiteTransparent,
  },
  scrollView: {
    flex: 1,
  },
  amountSection: {
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
  currencySymbol: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    padding: 0,
  },
  amountLimits: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  quickAmountSection: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    width: '48%',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  quickAmountButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  quickAmountText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  quickAmountTextSelected: {
    color: Colors.primary,
  },
  paymentMethodSection: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    marginBottom: Spacing.md,
  },
  paymentMethodCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  paymentMethodCardDisabled: {
    opacity: 0.6,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  paymentMethodIconSelected: {
    backgroundColor: Colors.primary,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  paymentMethodNameDisabled: {
    color: Colors.textSecondary,
  },
  paymentMethodDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  paymentMethodDescriptionDisabled: {
    color: Colors.textSecondary,
    opacity: 0.7,
  },
  comingSoonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.warning,
    fontWeight: Typography.fontWeight.medium,
  },
  securitySection: {
    backgroundColor: Colors.success + '10',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  securityTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.success,
    marginLeft: Spacing.sm,
  },
  securityDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
