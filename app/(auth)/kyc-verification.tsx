import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Header, InputField, ScreenWrapper } from '../../components/common';

export default function KycVerificationScreen() {
  const handleKycSubmit = () => {
    // For demo purposes, navigate to subscription fee after KYC
    // In a real app, you would submit KYC data for verification
    router.push('/(auth)/subscription-fee');
  };

  const handleDocumentUpload = (documentType: string) => {
    // For demo purposes, just show an alert or handle document upload
    console.log(`Uploading ${documentType}`);
  };

  return (
    <ScreenWrapper>
      <Header title="KYC Verification" canGoBack />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Verify Your Identity</Text>
        <InputField label="Aadhar Number" placeholder="Enter your Aadhar number" keyboardType="numeric" />
        <InputField label="PAN Number" placeholder="Enter your PAN number" />
        <InputField label="Bank Account Number" placeholder="Enter your bank account number" keyboardType="numeric" />
        <InputField label="IFSC Code" placeholder="Enter your bank's IFSC code" />
        <Button title="Upload Aadhar Card" onPress={() => handleDocumentUpload('Aadhar Card')} variant="secondary" />
        <Button title="Upload PAN Card" onPress={() => handleDocumentUpload('PAN Card')} variant="secondary" />
        <View style={{ height: 24 }} />
        <Button title="Submit for Verification" onPress={handleKycSubmit} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
});
