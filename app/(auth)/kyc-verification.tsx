import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button, InputField, ScreenWrapper } from '../../components/common';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Gradients, Layout } from '../../constants/theme';

export default function KycVerificationScreen() {
  const [aadharNumber, setAadharNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState({
    aadhar: false,
    pan: false,
  });

  const handleKycSubmit = () => {
    // For demo purposes, navigate to subscription fee after KYC
    // In a real app, you would submit KYC data for verification
    router.push('/(auth)/subscription-fee');
  };

  const handleDocumentUpload = (documentType: 'aadhar' | 'pan') => {
    // For demo purposes, just toggle the uploaded state
    setUploadedDocs(prev => ({
      ...prev,
      [documentType]: true,
    }));
    console.log(`Uploading ${documentType} document`);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <ScreenWrapper style={styles.screenWrapper}>
      <LinearGradient
        colors={Gradients.primary}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={24} color={Colors.textOnDark} />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Ionicons name="shield-checkmark" size={48} color={Colors.textOnDark} />
            </View>
            <Text style={styles.headerTitle}>KYC Verification</Text>
            <Text style={styles.headerSubtitle}>Verify your identity to continue</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Identity Verification</Text>
              <Text style={styles.subtitle}>Please provide your details for verification</Text>
            </View>

            <View style={styles.inputsContainer}>
              <InputField 
                label="Aadhar Number" 
                placeholder="Enter your 12-digit Aadhar number"
                value={aadharNumber}
                onChangeText={setAadharNumber}
                keyboardType="numeric"
                maxLength={12}
                leftIcon={<Ionicons name="card-outline" size={20} color={Colors.textSecondary} />}
              />

              <InputField 
                label="PAN Number" 
                placeholder="Enter your PAN number"
                value={panNumber}
                onChangeText={setPanNumber}
                autoCapitalize="characters"
                maxLength={10}
                leftIcon={<Ionicons name="document-text-outline" size={20} color={Colors.textSecondary} />}
              />

              <InputField 
                label="Bank Account Number" 
                placeholder="Enter your bank account number"
                value={bankAccount}
                onChangeText={setBankAccount}
                keyboardType="numeric"
                leftIcon={<Ionicons name="card-outline" size={20} color={Colors.textSecondary} />}
              />

              <InputField 
                label="IFSC Code" 
                placeholder="Enter your bank's IFSC code"
                value={ifscCode}
                onChangeText={setIfscCode}
                autoCapitalize="characters"
                maxLength={11}
                leftIcon={<Ionicons name="business-outline" size={20} color={Colors.textSecondary} />}
              />
            </View>

            {/* Document Upload Section */}
            <View style={styles.documentsSection}>
              <Text style={styles.sectionTitle}>Document Upload</Text>
              
              <TouchableOpacity 
                style={[styles.uploadCard, uploadedDocs.aadhar && styles.uploadedCard]}
                onPress={() => handleDocumentUpload('aadhar')}
              >
                <View style={styles.uploadIcon}>
                  <Ionicons 
                    name={uploadedDocs.aadhar ? "checkmark-circle" : "cloud-upload-outline"} 
                    size={32} 
                    color={uploadedDocs.aadhar ? Colors.success : Colors.primary} 
                  />
                </View>
                <View style={styles.uploadText}>
                  <Text style={styles.uploadTitle}>
                    {uploadedDocs.aadhar ? "Aadhar Card Uploaded" : "Upload Aadhar Card"}
                  </Text>
                  <Text style={styles.uploadSubtitle}>
                    {uploadedDocs.aadhar ? "Document uploaded successfully" : "Tap to upload your Aadhar card"}
                  </Text>
                </View>
                <Ionicons 
                  name={uploadedDocs.aadhar ? "checkmark" : "chevron-forward"} 
                  size={20} 
                  color={Colors.textSecondary} 
                />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.uploadCard, uploadedDocs.pan && styles.uploadedCard]}
                onPress={() => handleDocumentUpload('pan')}
              >
                <View style={styles.uploadIcon}>
                  <Ionicons 
                    name={uploadedDocs.pan ? "checkmark-circle" : "cloud-upload-outline"} 
                    size={32} 
                    color={uploadedDocs.pan ? Colors.success : Colors.primary} 
                  />
                </View>
                <View style={styles.uploadText}>
                  <Text style={styles.uploadTitle}>
                    {uploadedDocs.pan ? "PAN Card Uploaded" : "Upload PAN Card"}
                  </Text>
                  <Text style={styles.uploadSubtitle}>
                    {uploadedDocs.pan ? "Document uploaded successfully" : "Tap to upload your PAN card"}
                  </Text>
                </View>
                <Ionicons 
                  name={uploadedDocs.pan ? "checkmark" : "chevron-forward"} 
                  size={20} 
                  color={Colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <Button title="Submit for Verification" onPress={handleKycSubmit} />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
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
