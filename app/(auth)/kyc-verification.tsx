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
                label="" 
                placeholder="Aadhar Card"
                value={aadharNumber}
                onChangeText={setAadharNumber}
                keyboardType="numeric"
                maxLength={12}
                leftIcon={<Ionicons name="card-outline" size={20} color={Colors.textSecondary} />}
              />

              <InputField 
                label="" 
                placeholder="PAN Number"
                value={panNumber}
                onChangeText={setPanNumber}
                autoCapitalize="characters"
                maxLength={10}
                leftIcon={<Ionicons name="document-text-outline" size={20} color={Colors.textSecondary} />}
              />

              <InputField 
                label="" 
                placeholder="Bank Account Number"
                value={bankAccount}
                onChangeText={setBankAccount}
                keyboardType="numeric"
                leftIcon={<Ionicons name="card-outline" size={20} color={Colors.textSecondary} />}
              />

              <InputField 
                label="" 
                placeholder="IFSC Code"
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
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 0
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: Spacing.lg,
  },
  headerSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: Spacing.lg,
    top: Spacing.xl,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnDark,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textOnDark,
    textAlign: 'center',
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    marginTop: 0,
    flex: 1,
    // --- FIX: Added horizontal padding here ---
    paddingHorizontal: Spacing.lg,
  },
  titleSection: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputsContainer: {
    marginBottom: Spacing.xl,
    // --- FIX: Removed horizontal padding from here ---
  },
  documentsSection: {
    marginBottom: Spacing['2xl'],
    // --- FIX: Removed horizontal padding from here ---
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xl,
    textAlign: 'left',
  },
  uploadCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  uploadedCard: {
    backgroundColor: Colors.surfaceSecondary,
    borderColor: Colors.success,
  },
  uploadIcon: {
    marginRight: Spacing.md,
  },
  uploadText: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  uploadSubtitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  buttonContainer: {
    marginTop: Spacing['2xl'],
    paddingBottom: Spacing.lg,
    // --- FIX: Removed horizontal padding from here ---
  },
});