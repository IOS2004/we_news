import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button, Header, InputField, ScreenWrapper } from '../../components/common';

export default function SignUpScreen() {
  const handleSignUp = () => {
    // For demo purposes, navigate to KYC verification after sign up
    // In a real app, you would validate and create the account here
    router.push('/(auth)/kyc-verification');
  };

  const handleSignInNavigation = () => {
    router.push('/(auth)/sign-in');
  };

  return (
    <ScreenWrapper>
      <Header title="Sign Up" canGoBack />
      <View style={styles.container}>
        <Text style={styles.title}>Create an Account</Text>
        <InputField label="Name" placeholder="Enter your full name" />
        <InputField label="Email" placeholder="Enter your email" keyboardType="email-address" />
        <InputField label="Phone" placeholder="Enter your phone number" keyboardType="phone-pad" />
        <InputField label="Password" placeholder="Enter your password" secureTextEntry />
        <InputField label="Referral Code (Optional)" placeholder="Enter referral code" />
        <Button title="Sign Up" onPress={handleSignUp} />
        <TouchableOpacity onPress={handleSignInNavigation}>
          <Text style={styles.link}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 16,
  },
});
