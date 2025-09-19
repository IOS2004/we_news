import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../components/common";

interface Transaction {
  id: string;
  type: 'trade' | 'winning' | 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function Wallet() {
  const [balance] = useState(1250);
  const [activeFilter, setActiveFilter] = useState<'all' | 'winnings' | 'trades'>('all');
  const [timeFilter, setTimeFilter] = useState('Last 7 days');
  
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'trade',
      amount: -100,
      description: 'Number Trade - Round #12',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: '2',
      type: 'winning',
      amount: 250,
      description: 'Winning - Round #11',
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: '3',
      type: 'trade',
      amount: -100,
      description: 'Number Trade - Round #10',
      date: '2024-01-13',
      status: 'completed'
    },
    {
      id: '4',
      type: 'trade',
      amount: -100,
      description: 'Number Trade - Round #9',
      date: '2024-01-12',
      status: 'completed'
    },
    {
      id: '5',
      type: 'winning',
      amount: 250,
      description: 'Winning - Round #8',
      date: '2024-01-11',
      status: 'completed'
    }
  ]);

  const filteredTransactions = transactions.filter(transaction => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'winnings') return transaction.type === 'winning';
    if (activeFilter === 'trades') return transaction.type === 'trade';
    return true;
  });

  const handleAddFunds = () => {
    Alert.alert("Add Funds", "Add funds functionality will be implemented");
  };

  const handleWithdraw = () => {
    Alert.alert("Withdraw", "Withdraw functionality will be implemented");
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'trade':
        return { icon: 'arrow-down', color: '#EF4444' };
      case 'winning':
        return { icon: 'arrow-up', color: '#22C55E' };
      case 'deposit':
        return { icon: 'add', color: '#22C55E' };
      case 'withdrawal':
        return { icon: 'remove', color: '#EF4444' };
      default:
        return { icon: 'swap-horizontal', color: '#AAAAAA' };
    }
  };

  const renderTransaction = (transaction: Transaction) => {
    const { icon, color } = getTransactionIcon(transaction.type);
    
    return (
      <View key={transaction.id} style={styles.transactionItem}>
        <View style={[styles.transactionIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        
        <View style={styles.transactionContent}>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
        
        <Text style={[
          styles.transactionAmount,
          { color: transaction.amount > 0 ? '#22C55E' : '#EF4444' }
        ]}>
          {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
        </Text>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Wallet</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Balance Section */}
          <View style={styles.balanceSection}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Balance 💰</Text>
            </View>
            <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.addFundsButton} onPress={handleAddFunds}>
                <Text style={styles.addFundsText}>Add Funds</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
                <Text style={styles.withdrawText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Transactions Section */}
          <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>Transactions Log</Text>
            
            {/* Filter Tabs */}
            <View style={styles.filterTabs}>
              <TouchableOpacity
                style={[styles.filterTab, activeFilter === 'all' && styles.activeFilterTab]}
                onPress={() => setActiveFilter('all')}
              >
                <Text style={[
                  styles.filterTabText,
                  activeFilter === 'all' && styles.activeFilterTabText
                ]}>All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterTab, activeFilter === 'winnings' && styles.activeFilterTab]}
                onPress={() => setActiveFilter('winnings')}
              >
                <Text style={[
                  styles.filterTabText,
                  activeFilter === 'winnings' && styles.activeFilterTabText
                ]}>Winnings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterTab, activeFilter === 'trades' && styles.activeFilterTab]}
                onPress={() => setActiveFilter('trades')}
              >
                <Text style={[
                  styles.filterTabText,
                  activeFilter === 'trades' && styles.activeFilterTabText
                ]}>Trades</Text>
              </TouchableOpacity>
            </View>

            {/* Time Filter */}
            <TouchableOpacity style={styles.timeFilter}>
              <Text style={styles.timeFilterText}>{timeFilter}</Text>
              <Ionicons name="chevron-down" size={16} color="#AAAAAA" />
            </TouchableOpacity>

            {/* Transactions List */}
            <View style={styles.transactionsList}>
              {filteredTransactions.map(renderTransaction)}
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#1A1A1A",
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  balanceSection: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: "center",
  },
  balanceHeader: {
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#AAAAAA",
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: "700",
    color: "white",
    marginBottom: 32,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  addFundsButton: {
    flex: 1,
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  addFundsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: "#3A3A3A",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  withdrawText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  transactionsSection: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 20,
    paddingTop: 24,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 20,
  },
  filterTabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    backgroundColor: "#3A3A3A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeFilterTab: {
    backgroundColor: "#4A90E2",
  },
  filterTabText: {
    color: "#AAAAAA",
    fontSize: 14,
    fontWeight: "500",
  },
  activeFilterTabText: {
    color: "white",
  },
  timeFilter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginBottom: 16,
  },
  timeFilterText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  transactionsList: {
    gap: 16,
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionContent: {
    flex: 1,
  },
  transactionDescription: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  transactionDate: {
    color: "#AAAAAA",
    fontSize: 14,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
});