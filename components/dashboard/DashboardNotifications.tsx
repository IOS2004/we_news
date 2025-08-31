import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Card from '../common/Card';

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
  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <Card>
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
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#666',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
});

export default DashboardNotifications;
