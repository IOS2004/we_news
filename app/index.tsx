import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  // Check if user is authenticated
  // For demo purposes, we'll redirect to auth for new users
  const isAuthenticated = false; // This would come from your auth context/storage
  
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/sign-in" />;
  }
}
