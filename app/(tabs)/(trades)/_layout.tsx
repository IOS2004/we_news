import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DoubleTapAppSwitcher } from '../../../components/common';
import { Colors, Spacing, BorderRadius, Typography } from '../../../constants/theme';

export default function TradingTabsLayout() {
  const CustomTabBar = (props: any) => {
    return (
      <View style={styles.tabBarContainer}>
        <View style={styles.tabBarContent}>
          {/* TRADES Button on Left */}
          <DoubleTapAppSwitcher style={styles.tradesButton} />

          {/* Trading Tabs on Right */}
          <View style={styles.tabsSection}>
            {props.state.routes.map((route: any, index: number) => {
              const { options } = props.descriptors[route.key];
              const label = options.tabBarLabel || options.title || route.name;
              const isFocused = props.state.index === index;

              // Skip index route from tabs
              if (route.name === 'index') {
                return null;
              }

              const onPress = () => {
                const event = props.navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  props.navigation.navigate(route.name);
                }
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  style={styles.tabButton}
                >
                  {options.tabBarIcon && options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused ? Colors.primary : Colors.textSecondary,
                    size: 20,
                  })}
                  <Text style={[
                    styles.tabLabel,
                    { color: isFocused ? Colors.primary : Colors.textSecondary }
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <Tabs
      tabBar={CustomTabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen 
        name="color-trading" 
        options={{
          title: 'Colour Trading',
          tabBarLabel: 'Colour',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="color-palette" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="number-trading" 
        options={{
          title: 'Number Trading',
          tabBarLabel: 'Number',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="dice" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="my-trades" 
        options={{
          title: 'My Trades',
          tabBarLabel: 'Trades',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="wallet" 
        options={{
          title: 'Wallet',
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.md,
  },
  tabBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  tradesButton: {
    // DoubleTapAppSwitcher will handle its own styling
  },
  tabsSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: Spacing.xs,
  },
  tabLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    marginTop: Spacing.xs,
  },
});