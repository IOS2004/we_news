import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

interface AddMoneyCardProps {
  amount: number;
  method: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
  onPress?: () => void;
}

const AddMoneyCard: React.FC<AddMoneyCardProps> = ({
  amount,
  method,
  date,
  status,
  onPress,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return 'checkmark-circle';
      case 'pending':
        return 'time-outline';
      case 'failed':
        return 'close-circle';
      default:
        return 'time-outline';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'failed':
        return Colors.error;
      default:
        return Colors.warning;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'success':
        return 'Completed';
      case 'pending':
        return 'Processing';
      case 'failed':
        return 'Failed';
      default:
        return 'Processing';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="add-circle" size={24} color={Colors.success} />
        </View>
        <View style={styles.details}>
          <Text style={styles.title}>Money Added</Text>
          <Text style={styles.method}>{method}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={styles.amount}>+₹{amount.toLocaleString()}</Text>
        <View style={styles.statusContainer}>
          <Ionicons
            name={getStatusIcon() as any}
            size={14}
            color={getStatusColor()}
          />
          <Text style={[styles.status, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  method: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success,
    marginBottom: Spacing.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
});

export default AddMoneyCard;
