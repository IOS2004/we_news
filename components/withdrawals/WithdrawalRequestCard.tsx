import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Card from '../common/Card';
import Button from '../common/Button';
import InputField from '../common/InputField';

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
    <Card>
      <Text style={styles.title}>Request Withdrawal</Text>
      
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>₹{availableBalance.toFixed(2)}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Withdrawal Information</Text>
        <Text style={styles.infoText}>• Minimum withdrawal: ₹{minimumWithdrawal}</Text>
        <Text style={styles.infoText}>• Processing time: 24-48 hours</Text>
        <Text style={styles.infoText}>• No withdrawal charges</Text>
        <Text style={styles.infoText}>• Requires admin approval</Text>
      </View>

      <View style={styles.formSection}>
        <InputField
          label="Withdrawal Amount (₹)"
          placeholder={`Minimum ₹${minimumWithdrawal}`}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        
        <InputField
          label="Bank Account Number"
          placeholder="Enter your bank account number"
          value={bankAccount}
          onChangeText={setBankAccount}
          keyboardType="numeric"
        />
        
        <InputField
          label="IFSC Code"
          placeholder="Enter bank IFSC code"
          value={ifscCode}
          onChangeText={setIfscCode}
        />
      </View>

      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Withdrawal Amount:</Text>
          <Text style={styles.summaryValue}>₹{amount || '0'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Processing Fee:</Text>
          <Text style={styles.summaryValue}>₹0</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>You will receive:</Text>
          <Text style={styles.totalValue}>₹{amount || '0'}</Text>
        </View>
      </View>

      <Button 
        title="Submit Withdrawal Request" 
        onPress={handleWithdrawalRequest}
        loading={loading}
        disabled={!amount || !bankAccount || !ifscCode}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  balanceSection: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
  },
  infoSection: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
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
  formSection: {
    marginBottom: 16,
  },
  summarySection: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
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
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
});

export default WithdrawalRequestCard;
