import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import { Button, InputField, ScreenWrapper } from '../../components/common';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Gradients, Layout } from '../../constants/theme';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const handleSignIn = () => {
    // For demo purposes, directly navigate to the main tabs
    // In a real app, you would validate credentials here
    router.replace('/(tabs)/home');
  };

  const handleSignUpNavigation = () => {
    router.push('/(auth)/sign-up');
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    console.log('Navigate to forgot password');
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
            {/* Logo/Brand Section */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <Ionicons name="newspaper" size={48} color={Colors.textOnDark} />
              </View>
              <Text style={styles.appName}>WE NEWS</Text>
              <Text style={styles.tagline}>Stay informed, earn rewards</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Welcome Back!</Text>
                <Text style={styles.welcomeSubtitle}>Sign in to continue your journey</Text>
              </View>

              <View style={styles.inputsContainer}>
                <InputField 
                  label="" 
                  placeholder="Email or Phone"
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
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                  leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />}
                  rightIcon={<Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={Colors.textSecondary} />}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />
              </View>

              <TouchableOpacity 
                style={styles.forgotPasswordContainer}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <View style={styles.buttonContainer}>
                <Button title="Sign In" onPress={handleSignIn} />
              </View>

              <View style={styles.signUpSection}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleSignUpNavigation}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
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
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.whiteTransparent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnDark,
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: Colors.tagline,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 40,
    marginTop: 20,
    ...Shadows.lg,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  inputsContainer: {
    marginBottom: 24,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: Typography.fontWeight.semibold,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  signUpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  signUpLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  // Legacy styles for backward compatibility
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: 24,
  },
  link: {
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 16,
  },
});
