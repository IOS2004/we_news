import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import { Button, InputField, ScreenWrapper } from '../../components/common';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Gradients, Layout } from '../../constants/theme';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const referralRef = useRef<TextInput>(null);

  const handleSignUp = () => {
    // For demo purposes, navigate to KYC verification after sign up
    // In a real app, you would validate and create the account here
    router.push('/(auth)/kyc-verification');
  };

  const handleSignInNavigation = () => {
    router.push('/(auth)/sign-in');
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
        <KeyboardAwareScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={20}
          extraHeight={120}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={24} color={Colors.textOnDark} />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Ionicons name="newspaper" size={48} color={Colors.textOnDark} />
            </View>
            <Text style={styles.appName}>WE NEWS</Text>
            <Text style={styles.tagline}>Join the community today</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Create Account</Text>
              <Text style={styles.welcomeSubtitle}>Sign up to get started with your journey</Text>
            </View>

            <View style={styles.inputsContainer}>
              <InputField 
                label="" 
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                leftIcon={<Ionicons name="person-outline" size={20} color={Colors.textSecondary} />}
              />

              <InputField 
                ref={emailRef}
                label="" 
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
                leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />}
              />

              <InputField 
                ref={phoneRef}
                label="" 
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                leftIcon={<Ionicons name="call-outline" size={20} color={Colors.textSecondary} />}
              />

              <InputField 
                ref={passwordRef}
                label="" 
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="next"
                onSubmitEditing={() => referralRef.current?.focus()}
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />}
                rightIcon={<Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={Colors.textSecondary} />}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <InputField 
                ref={referralRef}
                label="" 
                placeholder="Referral Code (Optional)"
                value={referralCode}
                onChangeText={setReferralCode}
                autoCapitalize="characters"
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
                leftIcon={<Ionicons name="gift-outline" size={20} color={Colors.textSecondary} />}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button title="Sign Up" onPress={handleSignUp} />
            </View>

            <View style={styles.signInSection}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignInNavigation}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    paddingHorizontal: 0,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: Spacing.lg,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    zIndex: 1,
    padding: Spacing.sm,
  },
  logoContainer: {
    width: Layout.iconSize['3xl'] + Spacing.base,
    height: Layout.iconSize['3xl'] + Spacing.base,
    borderRadius: (Layout.iconSize['3xl'] + Spacing.base) / 2,
    backgroundColor: Colors.whiteTransparent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
    marginTop: Spacing['2xl'],
  },
  appName: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnDark,
    marginBottom: Spacing.sm,
    letterSpacing: Typography.letterSpacing.wide,
  },
  tagline: {
    fontSize: Typography.fontSize.base,
    color: Colors.tagline,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius['3xl'],
    borderTopRightRadius: BorderRadius['3xl'],
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['2xl'],
    paddingBottom: Spacing['4xl'],
    marginTop: Spacing.lg,
    ...Shadows.lg,
    minHeight: 500,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  welcomeTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  inputsContainer: {
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    marginBottom: Spacing.xl,
  },
  signInSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  signInLink: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  // Legacy styles for backward compatibility
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.base,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  link: {
    color: Colors.primary,
    textAlign: 'center',
    marginTop: Spacing.base,
  },
});
