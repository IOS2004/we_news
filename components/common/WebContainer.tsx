import { Platform, StyleSheet, View } from 'react-native';
import React from 'react';

interface WebContainerProps {
  children: React.ReactNode;
}

export function WebContainer({ children }: WebContainerProps) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.webContainer}>
      <View style={styles.contentWrapper}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 1200,
    backgroundColor: '#ffffff',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 40px rgba(0, 0, 0, 0.1)',
    }),
  },
});
