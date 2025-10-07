import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface MockPaymentGatewayProps {
  visible: boolean;
  planName: string;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: (error: string) => void;
}

export default function MockPaymentGateway({
  visible,
  planName,
  amount,
  onClose,
  onSuccess,
  onFailure
}: MockPaymentGatewayProps) {
  const [processing, setProcessing] = useState(false);
  const [paymentStage, setPaymentStage] = useState<'select' | 'processing' | 'success' | 'failed'>('select');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      // Reset state when modal opens
      setPaymentStage('select');
      setSelectedMethod(null);
      setProcessing(false);
    }
  }, [visible]);

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: 'logo-google', color: '#00C853' },
    { id: 'card', name: 'Credit/Debit Card', icon: 'card', color: '#2196F3' },
    { id: 'netbanking', name: 'Net Banking', icon: 'business', color: '#FF5722' },
    { id: 'wallet', name: 'Digital Wallet', icon: 'wallet', color: '#9C27B0' },
  ];

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handlePayNow = () => {
    if (!selectedMethod) return;

    setProcessing(true);
    setPaymentStage('processing');

    // Simulate payment processing (2-3 seconds)
    setTimeout(() => {
      // 95% success rate simulation
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        setPaymentStage('success');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setPaymentStage('failed');
        setTimeout(() => {
          onFailure('Payment failed. Please try again.');
        }, 2000);
      }
      setProcessing(false);
    }, 2500);
  };

  const renderPaymentMethodSelection = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Complete Payment</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Choose your preferred payment method</Text>
      </View>

      {/* Payment Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Plan</Text>
          <Text style={styles.summaryValue}>{planName}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, styles.totalLabel]}>Total Amount</Text>
          <Text style={[styles.summaryValue, styles.totalValue]}>₹{amount.toLocaleString()}</Text>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.methodsContainer}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod === method.id && styles.methodCardSelected
            ]}
            onPress={() => handlePaymentMethodSelect(method.id)}
          >
            <View style={styles.methodContent}>
              <View style={[styles.methodIcon, { backgroundColor: `${method.color}20` }]}>
                <Ionicons name={method.icon as any} size={24} color={method.color} />
              </View>
              <Text style={styles.methodName}>{method.name}</Text>
            </View>
            <View style={[
              styles.radioButton,
              selectedMethod === method.id && styles.radioButtonSelected
            ]}>
              {selectedMethod === method.id && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pay Now Button */}
      <TouchableOpacity
        style={[styles.payButton, !selectedMethod && styles.payButtonDisabled]}
        disabled={!selectedMethod}
        onPress={handlePayNow}
      >
        <LinearGradient
          colors={selectedMethod ? [Colors.primary, '#1D4ED8'] : ['#9CA3AF', '#6B7280']}
          style={styles.payButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.payButtonText}>Pay ₹{amount.toLocaleString()}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Mock Payment Notice */}
      <View style={styles.mockNotice}>
        <Ionicons name="information-circle" size={16} color={Colors.warning} />
        <Text style={styles.mockNoticeText}>
          This is a mock payment gateway for testing. No real payment will be processed.
        </Text>
      </View>
    </View>
  );

  const renderProcessing = () => (
    <View style={styles.statusContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.statusTitle}>Processing Payment...</Text>
      <Text style={styles.statusSubtitle}>Please wait while we process your payment</Text>
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.statusContainer}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
      </View>
      <Text style={styles.statusTitle}>Payment Successful!</Text>
      <Text style={styles.statusSubtitle}>Your {planName} has been activated</Text>
      <View style={styles.successDetails}>
        <View style={styles.successDetailRow}>
          <Text style={styles.successDetailLabel}>Amount Paid</Text>
          <Text style={styles.successDetailValue}>₹{amount.toLocaleString()}</Text>
        </View>
        <View style={styles.successDetailRow}>
          <Text style={styles.successDetailLabel}>Transaction ID</Text>
          <Text style={styles.successDetailValue}>MOCK{Date.now().toString().slice(-8)}</Text>
        </View>
      </View>
    </View>
  );

  const renderFailed = () => (
    <View style={styles.statusContainer}>
      <View style={styles.failedIcon}>
        <Ionicons name="close-circle" size={80} color={Colors.error} />
      </View>
      <Text style={styles.statusTitle}>Payment Failed</Text>
      <Text style={styles.statusSubtitle}>Sorry, we couldn't process your payment</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => {
          setPaymentStage('select');
          setSelectedMethod(null);
        }}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {paymentStage === 'select' && renderPaymentMethodSelection()}
          {paymentStage === 'processing' && renderProcessing()}
          {paymentStage === 'success' && renderSuccess()}
          {paymentStage === 'failed' && renderFailed()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '90%',
    ...Shadows.lg,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  methodsContainer: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  methodName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  payButton: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: Spacing.sm,
  },
  mockNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.warning}15`,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  mockNoticeText: {
    flex: 1,
    fontSize: 12,
    color: Colors.warning,
    marginLeft: Spacing.xs,
  },
  statusContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  statusSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  successIcon: {
    marginBottom: Spacing.md,
  },
  successDetails: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  successDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  successDetailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  successDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  failedIcon: {
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
