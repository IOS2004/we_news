import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import { Button, InputField, ScreenWrapper, Logo } from '../../components/common';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Gradients, Layout } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../utils/toast';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDeveloperLoading, setIsDeveloperLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  
  const { signIn, isLoading, error, developerSignIn } = useAuth();

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      showToast.warning({
        title: 'Missing Information',
        message: 'Please fill in all fields',
      });
      return;
    }

    const success = await signIn({ email: email.trim(), password });
    
    if (success) {
      router.replace('/(tabs)/(news)');
    }
    // Error handling is now done through toast notifications in AuthContext
  };

  const handleDeveloperSignIn = async () => {
    setIsDeveloperLoading(true);
    const success = await developerSignIn();
    
    if (success) {
      router.replace('/(tabs)/(news)');
    }
    setIsDeveloperLoading(false);
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
                <Logo size={48} />
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
                <Button 
                  title="Sign In" 
                  onPress={handleSignIn} 
                  loading={isLoading}
                />
              </View>

              <View style={styles.signUpSection}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleSignUpNavigation}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              {/* Developer Access Button */}
              {__DEV__ && (
                <View style={styles.developerSection}>
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Developer Mode</Text>
                    <View style={styles.dividerLine} />
                  </View>
                  <TouchableOpacity 
                    style={styles.developerButton}
                    onPress={handleDeveloperSignIn}
                    disabled={isDeveloperLoading}
                  >
                    <LinearGradient
                      colors={['#FF6B6B', '#FF8E8E']}
                      style={styles.developerGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Ionicons name="code-outline" size={20} color={Colors.white} />
                      <Text style={styles.developerButtonText}>
                        {isDeveloperLoading ? 'Signing in...' : 'Developer Access'}
                      </Text>
                      <View style={styles.developerBadge}>
                        <Text style={styles.developerBadgeText}>DEV</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                  <Text style={styles.developerNote}>
                    Sign in with dummy data for testing (Development only)
                  </Text>
                </View>
              )}
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
  
  // Developer section styles
  developerSection: {
    marginTop: 32,
    paddingTop: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    textTransform: 'uppercase',
  },
  developerButton: {
    borderRadius: BorderRadius.base,
    overflow: 'hidden',
    marginBottom: 12,
    ...Shadows.md,
  },
  developerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    position: 'relative',
  },
  developerButtonText: {
    fontSize: 16,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
    marginLeft: 8,
  },
  developerBadge: {
    position: 'absolute',
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  developerBadgeText: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  developerNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
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
