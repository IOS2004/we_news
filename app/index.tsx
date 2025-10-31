import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/theme';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: Colors.background 
      }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/(news)" />;
  } else {
    return <Redirect href="/(auth)/sign-in" />;
  }
}
