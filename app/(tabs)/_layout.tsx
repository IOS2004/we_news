import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textLight,
    }}>
      <Tabs.Screen 
        name="(home)" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="(news)" 
        options={{
          title: 'News',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={size} color={color} />
          ),
        }}
      />
      
      {/* Legacy routes - hidden but accessible for navigation */}
      <Tabs.Screen name="home" options={{ href: null }} />
      <Tabs.Screen name="earnings" options={{ href: null }} />
      <Tabs.Screen name="wallet" options={{ href: null }} />
      <Tabs.Screen name="plans" options={{ href: null }} />
      <Tabs.Screen name="news" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
