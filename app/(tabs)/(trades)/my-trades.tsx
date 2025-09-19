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

interface Trade {
  id: string;
  plan: string;
  numbers: number[];
  tradeAmount: number;
  type: 'number' | 'color';
  colors?: string[];
}

export default function MyTrades() {
  const [trades, setTrades] = useState<Trade[]>([
    {
      id: '1',
      plan: '₹10',
      numbers: [1, 7, 14, 22, 35],
      tradeAmount: 50,
      type: 'number'
    },
    {
      id: '2',
      plan: '₹20',
      numbers: [5, 12, 99],
      tradeAmount: 60,
      type: 'number'
    },
    {
      id: '3',
      plan: '₹50',
      numbers: [42],
      tradeAmount: 50,
      type: 'number'
    }
  ]);

  const grandTotal = trades.reduce((sum, trade) => sum + trade.tradeAmount, 0);

  const handleDeleteTrade = (tradeId: string) => {
    Alert.alert(
      "Delete Trade",
      "Are you sure you want to remove this trade?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTrades(prev => prev.filter(trade => trade.id !== tradeId));
          }
        }
      ]
    );
  };

  const handlePlaceOrder = () => {
    if (trades.length === 0) {
      Alert.alert("No Trades", "Please add some trades before placing order");
      return;
    }

    Alert.alert(
      "Place Order",
      `Place order for ${trades.length} trades with total amount ₹${grandTotal}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            Alert.alert("Success", "Order placed successfully!");
            setTrades([]); // Clear trades after placing order
          }
        }
      ]
    );
  };

  const renderTradeCard = (trade: Trade) => (
    <View key={trade.id} style={styles.tradeCard}>
      <View style={styles.tradeHeader}>
        <View style={styles.planBadge}>
          <Text style={styles.planText}>Plan: {trade.plan}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteTrade(trade.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.tradeContent}>
        <Text style={styles.numbersLabel}>Numbers:</Text>
        <View style={styles.numbersContainer}>
          {trade.numbers.map((number, index) => (
            <View key={index} style={styles.numberChip}>
              <Text style={styles.numberText}>{number}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.tradeFooter}>
        <Text style={styles.tradeAmountLabel}>Trade Amount</Text>
        <Text style={styles.tradeAmount}>₹{trade.tradeAmount}</Text>
      </View>
    </View>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Trade List</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {trades.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="list-outline" size={64} color="#CCCCCC" />
              <Text style={styles.emptyText}>No trades added yet</Text>
              <Text style={styles.emptySubtext}>Add some trades to get started</Text>
            </View>
          ) : (
            trades.map(renderTradeCard)
          )}
        </ScrollView>

        {/* Bottom Section */}
        {trades.length > 0 && (
          <View style={styles.bottomSection}>
            <View style={styles.grandTotalContainer}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalAmount}>₹{grandTotal}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.placeOrderButton}
              onPress={handlePlaceOrder}
            >
              <Text style={styles.placeOrderText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  addButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  tradeCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tradeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  planBadge: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  planText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 4,
  },
  tradeContent: {
    marginBottom: 16,
  },
  numbersLabel: {
    color: "#AAAAAA",
    fontSize: 14,
    marginBottom: 8,
  },
  numbersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  numberChip: {
    backgroundColor: "#3A3A3A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 32,
    alignItems: "center",
  },
  numberText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  tradeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#3A3A3A",
  },
  tradeAmountLabel: {
    color: "#AAAAAA",
    fontSize: 14,
  },
  tradeAmount: {
    color: "#22C55E",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    color: "#AAAAAA",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 16,
  },
  emptySubtext: {
    color: "#666666",
    fontSize: 14,
    marginTop: 8,
  },
  bottomSection: {
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  grandTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  grandTotalLabel: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  grandTotalAmount: {
    color: "#22C55E",
    fontSize: 20,
    fontWeight: "700",
  },
  placeOrderButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  placeOrderText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});