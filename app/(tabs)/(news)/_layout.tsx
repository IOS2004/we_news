import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/theme';
import { DoubleTapAppSwitcher } from '../../../components/common';

export default function NewsTabsLayout() {
  const CustomTabBar = (props: any) => {
    return (
      <View style={styles.tabBarContainer}>
        {/* Double-Tap App Mode Switcher */}
        <View style={styles.switcherSection}>
          <DoubleTapAppSwitcher />
        </View>

        {/* News Tabs */}
        <View style={styles.tabsSection}>
          {props.state.routes.map((route: any, index: number) => {
            const { options } = props.descriptors[route.key];
            const label = options.tabBarLabel || options.title || route.name;
            const isFocused = props.state.index === index;

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
        options={{
          title: 'News',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="trending" 
        options={{
          title: 'Trending',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="categories" 
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="bookmarks" 
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark" size={size} color={color} />
          ),
        }}
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