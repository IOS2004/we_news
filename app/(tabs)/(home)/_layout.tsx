import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/theme';
import { DoubleTapAppSwitcher } from '../../../components/common';

export default function HomeTabsLayout() {
  const CustomTabBar = (props: any) => {
    return (
      <View style={styles.tabBarContainer}>
        {/* Double-Tap App Mode Switcher */}
        <View style={styles.switcherSection}>
          <DoubleTapAppSwitcher />
        </View>

        {/* Home Tabs */}
        <View style={styles.tabsSection}>
          {props.state.routes.map((route: any, index: number) => {
            const { options } = props.descriptors[route.key];
            const label = options.tabBarLabel || options.title || route.name;
            const isFocused = props.state.index === index;

            // Skip hidden routes (index, add-money, withdrawals)
            if (route.name === 'index' || route.name === 'add-money' || route.name === 'withdrawals') {
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
                  color: isFocused ? Colors.primary : '#8e8e93',
                  size: 20,
                })}
                <Text style={[
                  styles.tabLabel,
                  { color: isFocused ? Colors.primary : '#8e8e93' }
                ]}>
                  {typeof label === 'string' ? label : route.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#666',
      }}
      tabBar={CustomTabBar}
    >
      <Tabs.Screen 
        name="index" 
        options={{ href: null }}
      />
      <Tabs.Screen 
        name="dashboard" 
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="earnings" 
        options={{
          title: 'Earnings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="wallet" 
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="plans" 
        options={{
          title: 'Plans',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="diamond" size={size} color={color} />
          ),
        }}
      />
      {/* Hidden screens - accessible only through wallet page */}
      <Tabs.Screen 
        name="add-money" 
        options={{ href: null }}
      />
      <Tabs.Screen 
        name="withdrawals" 
        options={{ href: null }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderTopColor: '#e5e5e5',
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    height: 60,
  },
  switcherSection: {
    marginRight: 8,
  },
  tabsSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 1,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
});