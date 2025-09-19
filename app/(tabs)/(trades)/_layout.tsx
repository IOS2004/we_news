import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TradingTabsLayout() {
  const CustomTabBar = (props: any) => {
    return (
      <View style={styles.tabBarContainer}>
        {/* Trading Tabs */}
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
                  color: isFocused ? '#6366F1' : '#999',
                  size: 20,
                })}
                <Text style={[
                  styles.tabLabel,
                  { color: isFocused ? '#6366F1' : '#999' }
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Orange TRADES Button */}
        <TouchableOpacity style={styles.tradesButton}>
          <Ionicons name="trending-up" size={16} color="white" />
          <Text style={styles.tradesButtonText}>TRADES</Text>
        </TouchableOpacity>
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
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 20,
    paddingTop: 12,
  },
  tabsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  tradesButton: {
    backgroundColor: '#F97316',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
  },
  tradesButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});