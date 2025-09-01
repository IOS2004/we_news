import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../common/Card';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
}

interface DashboardNotificationsProps {
  notifications: Notification[];
}

const DashboardNotifications: React.FC<DashboardNotificationsProps> = ({ notifications }) => {
  const getNotificationIcon = (title: string) => {
    if (title.toLowerCase().includes('earning')) {
      return 'wallet';
    } else if (title.toLowerCase().includes('ad') || title.toLowerCase().includes('video')) {
      return 'play-circle';
    } else if (title.toLowerCase().includes('level') || title.toLowerCase().includes('reward')) {
      return 'trophy';
    }
    return 'notifications';
  };

  const getNotificationColor = (title: string) => {
    if (title.toLowerCase().includes('earning')) {
      return Colors.success;
    } else if (title.toLowerCase().includes('ad') || title.toLowerCase().includes('video')) {
      return Colors.info;
    } else if (title.toLowerCase().includes('level') || title.toLowerCase().includes('reward')) {
      return Colors.warning;
    }
    return Colors.primary;
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={[styles.iconContainer, { backgroundColor: `${getNotificationColor(item.title)}15` }]}>
        <Ionicons 
          name={getNotificationIcon(item.title) as any} 
          size={20} 
          color={getNotificationColor(item.title)} 
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={notifications.slice(0, 3)} // Show only first 3
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 0,
    marginBottom: Spacing.xl,
    marginHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  viewAll: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notificationContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  notificationTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    lineHeight: Typography.fontSize.xs * 1.4,
  },
  notificationTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textLight,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
    marginLeft: 52, // Align with content, accounting for icon + margin
  },
});

export default DashboardNotifications;
