import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Button, Header, InputField, ScreenWrapper } from '../../components/common';

const { width, height } = Dimensions.get('window');

export default function SignInScreen() {
  const handleSignIn = () => {
    // For demo purposes, directly navigate to the main tabs
    // In a real app, you would validate credentials here
    router.replace('/(tabs)/home');
  };

  const handleSignUpNavigation = () => {
    router.push('/(auth)/sign-up');
  };

  return (
    <ScreenWrapper>
      <Header title="Sign In" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.welcomeSection}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>WE NEWS</Text>
            </View>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue to your account</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <InputField 
                label="Email or Phone" 
                placeholder="Enter your email or phone"
              />
            </View>
            <View style={styles.inputContainer}>
              <InputField 
                label="Password" 
                placeholder="Enter your password" 
                secureTextEntry
              />
            </View>
            
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <Button title="Sign In" onPress={handleSignIn} />
            </View>
          </View>

          <View style={styles.signUpSection}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>
            
            <TouchableOpacity onPress={handleSignUpNavigation} style={styles.signUpButton}>
              <Text style={styles.signUpText}>
                Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    minHeight: height - 100,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#f8f9fa',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 30,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 32,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 8,
  },
  signUpSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999999',
    fontSize: 14,
    fontWeight: '500',
  },
  signUpButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  signUpText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  signUpLink: {
    color: '#007bff',
    fontWeight: '600',
  },
});
