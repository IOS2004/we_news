import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import { Button, InputField, ScreenWrapper, Logo } from '../../components/common';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Gradients, Layout } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const lastNameRef = useRef<TextInput>(null);
  const usernameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const referralRef = useRef<TextInput>(null);

  const { signUp, isLoading, error } = useAuth();

  const handleSignUp = async () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    const signUpData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
      ...(referralCode.trim() && { referralCode: referralCode.trim() })
    };

    const success = await signUp(signUpData);
    
    if (success) {
      // After successful backend signup, redirect to KYC verification
      router.push('/(auth)/kyc-verification');
    } else if (error) {
      Alert.alert('Sign Up Failed', error);
    }
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
              <Logo size={48} />
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
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                leftIcon={<Ionicons name="person-outline" size={20} color={Colors.textSecondary} />}
              />

              <InputField 
                ref={lastNameRef}
                label="" 
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => usernameRef.current?.focus()}
                leftIcon={<Ionicons name="person-outline" size={20} color={Colors.textSecondary} />}
              />

              <InputField 
                ref={usernameRef}
                label="" 
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                leftIcon={<Ionicons name="at-outline" size={20} color={Colors.textSecondary} />}
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
                onSubmitEditing={() => passwordRef.current?.focus()}
                leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />}
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
              <Button 
                title="Sign Up" 
                onPress={handleSignUp} 
                loading={isLoading}
              />
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
