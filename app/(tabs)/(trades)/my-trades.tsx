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
import { Colors, Typography, Spacing, BorderRadius } from "../../../constants/theme";

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
          <Text style={styles.title}>My Trades</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {trades.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="list-outline" size={64} color={Colors.textLight} />
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
              <Ionicons name="checkmark-circle" size={20} color={Colors.white} style={{ marginRight: Spacing.xs }} />
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
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  addButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.base,
  },
  tradeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tradeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.base,
  },
  planBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },
  planText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  tradeContent: {
    marginBottom: Spacing.base,
  },
  numbersLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.sm,
  },
  numbersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  numberChip: {
    backgroundColor: Colors.buttonSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
    minWidth: 32,
    alignItems: "center",
  },
  numberText: {
    color: Colors.text,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  tradeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tradeAmountLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
  },
  tradeAmount: {
    color: Colors.success,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
    marginTop: Spacing.base,
  },
  emptySubtext: {
    color: Colors.textLight,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.sm,
  },
  bottomSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  grandTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.base,
    paddingHorizontal: Spacing.xs,
  },
  grandTotalLabel: {
    color: Colors.text,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
  },
  grandTotalAmount: {
    color: Colors.success,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  placeOrderButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.base,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  placeOrderText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});