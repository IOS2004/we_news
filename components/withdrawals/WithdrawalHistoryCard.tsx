import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '../common/Card';

interface WithdrawalHistory {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  transactionId?: string;
  bankAccount: string;
  processingDate?: string;
}

const WithdrawalHistoryCard: React.FC = () => {
  const withdrawalHistory: WithdrawalHistory[] = [
    {
      id: '1',
      amount: 1000,
      date: '2025-08-29',
      status: 'completed',
      transactionId: 'TXN123456789',
      bankAccount: '****1234',
      processingDate: '2025-08-30',
    },
    {
      id: '2',
      amount: 500,
      date: '2025-08-25',
      status: 'approved',
      transactionId: 'TXN123456788',
      bankAccount: '****1234',
      processingDate: '2025-08-26',
    },
    {
      id: '3',
      amount: 750,
      date: '2025-08-20',
      status: 'pending',
      bankAccount: '****1234',
    },
    {
      id: '4',
      amount: 300,
      date: '2025-08-15',
      status: 'rejected',
      bankAccount: '****1234',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#28a745';
      case 'approved':
        return '#007bff';
      case 'pending':
        return '#ffc107';
      case 'rejected':
        return '#dc3545';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const renderHistoryItem = ({ item }: { item: WithdrawalHistory }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <View style={styles.amountSection}>
          <Text style={styles.amount}>₹{item.amount}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.detailsSection}>
        <Text style={styles.detailLabel}>Bank Account: {item.bankAccount}</Text>
        {item.transactionId && (
          <Text style={styles.detailLabel}>Transaction ID: {item.transactionId}</Text>
        )}
        {item.processingDate && (
          <Text style={styles.detailLabel}>Processed on: {item.processingDate}</Text>
        )}
      </View>

      {item.status === 'pending' && (
        <View style={styles.pendingNote}>
          <Text style={styles.pendingText}>⏳ Processing in progress...</Text>
        </View>
      )}

      {item.status === 'rejected' && (
        <View style={styles.rejectedNote}>
          <Text style={styles.rejectedText}>❌ Contact support for details</Text>
        </View>
      )}
    </View>
  );

  const totalWithdrawn = withdrawalHistory
    .filter(item => item.status === 'completed')
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingAmount = withdrawalHistory
    .filter(item => item.status === 'pending' || item.status === 'approved')
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card>
      <Text style={styles.title}>Withdrawal History</Text>
      
      <View style={styles.summarySection}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>₹{totalWithdrawn}</Text>
          <Text style={styles.summaryLabel}>Total Withdrawn</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>₹{pendingAmount}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{withdrawalHistory.length}</Text>
          <Text style={styles.summaryLabel}>Total Requests</Text>
        </View>
      </View>

      <FlatList
        data={withdrawalHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No withdrawal history found</Text>
          </View>
        }
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  historyItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountSection: {
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsSection: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  pendingNote: {
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#ffc107',
  },
  pendingText: {
    fontSize: 12,
    color: '#856404',
  },
  rejectedNote: {
    backgroundColor: '#f8d7da',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#dc3545',
  },
  rejectedText: {
    fontSize: 12,
    color: '#721c24',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default WithdrawalHistoryCard;
