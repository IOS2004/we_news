# Wallet Integration Plan - Mobile App

## Overview

This document outlines the complete plan to integrate real wallet functionality into the mobile app, mirroring the web frontend implementation. The goal is to:

1. Remove all mock data from wallet and dashboard
2. Use wallet balance for all transactions (trades, plans, etc.)
3. Redirect to web frontend for add money operations
4. Implement withdrawal functionality
5. Set earnings display to ₹0

## Architecture

### Payment Flow

```
Mobile App → Wallet Balance Check → Sufficient?
                                    ↓ Yes: Proceed with transaction
                                    ↓ No: Open WebView to Web Frontend Add Money Page
                                         ↓ User adds money via web
                                         ↓ Success callback → Close WebView → Refresh Wallet → Retry transaction
```

### Key Principles

- **Single Source of Truth**: Wallet balance from backend API (`/api/wallet/`)
- **Web-based Payment**: All payment gateway interactions happen on web frontend
- **Mobile-based Spending**: All purchases (trades, plans) deduct from wallet balance
- **Security**: JWT token passed to WebView for authenticated sessions

## Implementation Phases

### Phase 1: Core Services Setup (Tasks 1-3, 15)

**Priority: CRITICAL**

#### 1.1 Create Wallet Service

**File**: `frontend/services/walletService.ts`

```typescript
import api from "./api";

export interface Wallet {
  walletId: string;
  balance: number;
  formattedBalance: string;
  status: "active" | "inactive" | "suspended";
  canTransact: boolean;
}

export interface Transaction {
  id: string;
  walletId: string;
  transactionType: "credit" | "debit" | "refund" | "cashback";
  amount: number;
  description: string;
  status: "pending" | "success" | "failed";
  transactionReference?: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  gstAmount?: number;
  discountAmount?: number;
  originalAmount?: number;
}

export const walletService = {
  // Get wallet details with balance
  async getWallet(): Promise<Wallet> {
    const response = await api.get("/wallet");
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch wallet");
    }
    return response.data.data;
  },

  // Get wallet balance only (lightweight)
  async getBalance(): Promise<number> {
    const response = await api.get("/wallet/balance");
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch balance");
    }
    return response.data.data.balance;
  },

  // Get transaction history
  async getTransactions(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: "credit" | "debit" | "refund" | "cashback";
      status?: "pending" | "success" | "failed";
    }
  ): Promise<{ data: Transaction[]; total: number }> {
    const params: any = { limit, skip: (page - 1) * limit };
    if (filters?.type) params.type = filters.type;
    if (filters?.status) params.status = filters.status;

    const response = await api.get("/wallet/transactions", { params });
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch transactions");
    }

    return {
      data: response.data.data.transactions || [],
      total: response.data.data.totalTransactions || 0,
    };
  },

  // Check if wallet can pay for amount
  async canPay(amount: number): Promise<boolean> {
    try {
      const response = await api.get("/wallet/can-pay", {
        params: { amount },
      });
      return response.data.success && response.data.data.canPay;
    } catch (error) {
      return false;
    }
  },

  // Process payment from wallet
  async processPayment(data: {
    amount: number;
    description: string;
    serviceId?: string;
    bookingId?: string;
  }): Promise<any> {
    const response = await api.post("/wallet/pay", data);
    if (!response.data.success) {
      throw new Error(response.data.message || "Payment failed");
    }
    return response.data.data;
  },
};
```

#### 1.2 Create Withdrawal Service

**File**: `frontend/services/withdrawalService.ts`

```typescript
import api from "./api";

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  bankAccountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  status: "pending" | "approved" | "rejected" | "processing" | "completed";
  requestDate: string;
  processedDate?: string;
  rejectionReason?: string;
  adminNotes?: string;
}

export const withdrawalService = {
  // Request withdrawal
  async requestWithdrawal(data: {
    amount: number;
    bankAccountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  }): Promise<{ withdrawalRequest: WithdrawalRequest; newBalance: number }> {
    const response = await api.post("/withdrawals/request", data);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to request withdrawal");
    }
    return response.data.data;
  },

  // Get user's withdrawal history
  async getMyWithdrawals(
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<WithdrawalRequest[]> {
    const params: any = { page, limit };
    if (status) params.status = status;

    const response = await api.get("/withdrawals/my-requests", { params });
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch withdrawals");
    }
    return response.data.data || [];
  },

  // Get pending withdrawals count
  async getPendingCount(): Promise<number> {
    const withdrawals = await this.getMyWithdrawals(1, 100, "pending");
    return withdrawals.length;
  },
};
```

#### 1.3 Update WalletContext

**File**: `frontend/contexts/WalletContext.tsx`

**Changes**:

1. Remove all mock transaction data
2. Integrate `walletService` for real API calls
3. Add proper loading/error states
4. Implement `refreshWallet()` and `refreshTransactions()`
5. Auto-refresh after critical operations

```typescript
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { walletService, Wallet, Transaction } from "../services/walletService";
import { useAuth } from "./AuthContext";

interface WalletContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refreshWallet: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  deductFromWallet: (amount: number, description: string) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshWallet = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);
      const walletData = await walletService.getWallet();
      setWallet(walletData);
    } catch (err: any) {
      console.error("Failed to fetch wallet:", err);
      setError(err.message || "Failed to load wallet");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const refreshTransactions = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const { data } = await walletService.getTransactions(1, 50);
      setTransactions(data);
    } catch (err: any) {
      console.error("Failed to fetch transactions:", err);
    }
  }, [isAuthenticated]);

  const deductFromWallet = useCallback(
    async (amount: number, description: string): Promise<boolean> => {
      try {
        await walletService.processPayment({ amount, description });
        await refreshWallet(); // Refresh to get updated balance
        return true;
      } catch (err: any) {
        console.error("Payment failed:", err);
        return false;
      }
    },
    [refreshWallet]
  );

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      refreshWallet();
      refreshTransactions();
    }
  }, [isAuthenticated]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions,
        isLoading,
        error,
        refreshWallet,
        refreshTransactions,
        deductFromWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
```

#### 1.4 Update Type Definitions

**File**: `frontend/types/wallet.ts`

```typescript
export interface Wallet {
  walletId: string;
  balance: number;
  formattedBalance: string;
  status: "active" | "inactive" | "suspended";
  canTransact: boolean;
}

export interface Transaction {
  id: string;
  walletId: string;
  transactionType: "credit" | "debit" | "refund" | "cashback";
  amount: number;
  description: string;
  status: "pending" | "success" | "failed";
  transactionReference?: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  gstAmount?: number;
  discountAmount?: number;
  originalAmount?: number;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  bankAccountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  status: "pending" | "approved" | "rejected" | "processing" | "completed";
  requestDate: string;
  processedDate?: string;
  rejectionReason?: string;
  adminNotes?: string;
}
```

---

### Phase 2: Dashboard & Wallet Page Updates (Tasks 4-5, 14, 16)

**Priority: HIGH**

#### 2.1 Update Dashboard

**File**: `frontend/app/(tabs)/(home)/dashboard.tsx`

**Changes**:

1. Replace mock balance with `wallet.balance` from WalletContext
2. Integrate real subscriptions from referral API
3. Show real transactions from WalletContext
4. Remove `getFallbackSubscriptions()` function
5. Remove mock notifications
6. Set all earnings to ₹0

```typescript
// Key changes:
const { wallet, transactions, refreshWallet } = useWallet();

// Replace mock balance
<Text style={styles.balanceAmount}>{wallet?.formattedBalance || "₹0.00"}</Text>;

// Set earnings to ₹0
const todayEarnings = 0;
const weekEarnings = 0;
const monthEarnings = 0;

// Use real transactions
<RecentTransactions
  transactions={transactions.slice(0, 5)}
  onViewAll={() => router.push("/(tabs)/(home)/wallet")}
/>;
```

#### 2.2 Update Wallet Page

**File**: `frontend/app/(tabs)/(home)/wallet.tsx`

**Changes**:

1. Remove ALL mock transaction data
2. Use `walletService.getTransactions()` for real data
3. Remove hardcoded earning stats
4. Implement pull-to-refresh
5. Add transaction filters

```typescript
const { wallet, transactions, refreshWallet, refreshTransactions, isLoading } =
  useWallet();
const [filter, setFilter] = useState<"all" | "credit" | "debit" | "refund">(
  "all"
);

// Filter transactions
const filteredTransactions = transactions.filter((tx) => {
  if (filter === "all") return true;
  return tx.transactionType === filter;
});

// Pull to refresh
const [refreshing, setRefreshing] = useState(false);
const onRefresh = async () => {
  setRefreshing(true);
  await Promise.all([refreshWallet(), refreshTransactions()]);
  setRefreshing(false);
};

// Replace mock stats
const totalCredit = transactions
  .filter((t) => t.transactionType === "credit" && t.status === "success")
  .reduce((sum, t) => sum + t.amount, 0);

const totalDebit = transactions
  .filter((t) => t.transactionType === "debit" && t.status === "success")
  .reduce((sum, t) => sum + t.amount, 0);
```

---

### Phase 3: Add Money & Withdrawal Features (Tasks 6-7)

**Priority: HIGH**

#### 3.1 Create Add Money WebView Screen

**File**: `frontend/app/(tabs)/(home)/add-money.tsx`

```typescript
import React, { useState, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenWrapper } from "../../../components/common";
import { useWallet } from "../../../contexts/WalletContext";
import { Colors } from "../../../constants/theme";

// Web frontend URL - UPDATE THIS to your deployed web frontend URL
const WEB_FRONTEND_URL = "https://your-web-frontend.com";

export default function AddMoney() {
  const router = useRouter();
  const { refreshWallet } = useWallet();
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  // Handle WebView messages from web frontend
  const handleMessage = async (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      if (message.type === "PAYMENT_SUCCESS") {
        // Payment successful, refresh wallet and go back
        Alert.alert(
          "Success",
          `₹${message.amount} added to your wallet successfully!`,
          [
            {
              text: "OK",
              onPress: async () => {
                await refreshWallet();
                router.back();
              },
            },
          ]
        );
      } else if (message.type === "PAYMENT_FAILED") {
        Alert.alert(
          "Payment Failed",
          message.message || "Payment could not be processed"
        );
      } else if (message.type === "CLOSE_WEBVIEW") {
        router.back();
      }
    } catch (error) {
      console.error("Error handling WebView message:", error);
    }
  };

  // Build WebView URL with JWT token
  const getWebViewUrl = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        Alert.alert("Error", "Please login again");
        router.replace("/(auth)/signin");
        return "";
      }

      // Pass token and return URL to web frontend
      return `${WEB_FRONTEND_URL}/add-money?token=${encodeURIComponent(
        token
      )}&source=mobile`;
    } catch (error) {
      console.error("Error getting token:", error);
      return "";
    }
  };

  const [webViewUrl, setWebViewUrl] = useState("");

  useEffect(() => {
    getWebViewUrl().then((url) => setWebViewUrl(url));
  }, []);

  if (!webViewUrl) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: webViewUrl }}
          onMessage={handleMessage}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          )}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
});
```

**Web Frontend Changes Required**:
Update `web-frontend/src/pages/AddMoney.tsx` to:

1. Accept token from URL query params
2. Post messages back to mobile app:

```typescript
// After successful payment
window.ReactNativeWebView?.postMessage(
  JSON.stringify({
    type: "PAYMENT_SUCCESS",
    amount: addedAmount,
  })
);

// On payment failure
window.ReactNativeWebView?.postMessage(
  JSON.stringify({
    type: "PAYMENT_FAILED",
    message: errorMessage,
  })
);

// On close/cancel
window.ReactNativeWebView?.postMessage(
  JSON.stringify({
    type: "CLOSE_WEBVIEW",
  })
);
```

#### 3.2 Create Withdrawal Screen

**File**: `frontend/app/(tabs)/(home)/withdrawals.tsx`

```typescript
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../components/common";
import { useWallet } from "../../../contexts/WalletContext";
import {
  withdrawalService,
  WithdrawalRequest,
} from "../../../services/withdrawalService";
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
} from "../../../constants/theme";

const MIN_WITHDRAWAL = 100;

export default function Withdrawals() {
  const { wallet, refreshWallet } = useWallet();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  // Form state
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  useEffect(() => {
    loadWithdrawals();
  }, [filter]);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      const data = await withdrawalService.getMyWithdrawals(
        1,
        50,
        filter === "all" ? undefined : filter
      );
      setWithdrawals(data);
    } catch (error: any) {
      console.error("Error loading withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadWithdrawals(), refreshWallet()]);
    setRefreshing(false);
  };

  const handleSubmitWithdrawal = async () => {
    // Validation
    const withdrawAmount = parseFloat(amount);

    if (!amount || isNaN(withdrawAmount) || withdrawAmount < MIN_WITHDRAWAL) {
      Alert.alert(
        "Invalid Amount",
        `Minimum withdrawal amount is ₹${MIN_WITHDRAWAL}`
      );
      return;
    }

    if (withdrawAmount > (wallet?.balance || 0)) {
      Alert.alert(
        "Insufficient Balance",
        "You don't have enough balance for this withdrawal"
      );
      return;
    }

    if (!accountNumber || accountNumber.length < 9) {
      Alert.alert("Invalid Account", "Please enter a valid account number");
      return;
    }

    if (!ifscCode || ifscCode.length !== 11) {
      Alert.alert(
        "Invalid IFSC",
        "Please enter a valid 11-character IFSC code"
      );
      return;
    }

    if (!accountHolder) {
      Alert.alert("Invalid Name", "Please enter account holder name");
      return;
    }

    Alert.alert(
      "Confirm Withdrawal",
      `₹${withdrawAmount} will be deducted from your wallet and transferred to your bank account. This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setLoading(true);
            try {
              await withdrawalService.requestWithdrawal({
                amount: withdrawAmount,
                bankAccountNumber: accountNumber,
                ifscCode: ifscCode.toUpperCase(),
                accountHolderName: accountHolder,
              });

              Alert.alert(
                "Withdrawal Requested",
                "Your withdrawal request has been submitted successfully. It will be processed within 24-48 hours."
              );

              // Reset form
              setAmount("");
              setAccountNumber("");
              setIfscCode("");
              setAccountHolder("");
              setShowForm(false);

              // Refresh data
              await loadWithdrawals();
              await refreshWallet();
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.message || "Failed to request withdrawal"
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return Colors.success;
      case "pending":
      case "processing":
        return Colors.warning;
      case "rejected":
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "checkmark-circle";
      case "pending":
      case "processing":
        return "time";
      case "rejected":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const filteredWithdrawals = withdrawals.filter((w) => {
    if (filter === "all") return true;
    return w.status === filter;
  });

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Withdrawals</Text>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>
              {wallet?.formattedBalance || "₹0.00"}
            </Text>
          </View>
        </View>

        {/* Request Withdrawal Button */}
        {!showForm && (
          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => setShowForm(true)}
          >
            <Ionicons name="arrow-down-circle" size={20} color={Colors.white} />
            <Text style={styles.requestButtonText}>Request Withdrawal</Text>
          </TouchableOpacity>
        )}

        {/* Withdrawal Form */}
        {showForm && (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Withdrawal Request</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Amount (Min ₹{MIN_WITHDRAWAL})</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                keyboardType="numeric"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Bank Account Number</Text>
              <TextInput
                style={styles.input}
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="Enter account number"
                keyboardType="numeric"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>IFSC Code</Text>
              <TextInput
                style={styles.input}
                value={ifscCode}
                onChangeText={(text) => setIfscCode(text.toUpperCase())}
                placeholder="Enter IFSC code"
                maxLength={11}
                autoCapitalize="characters"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Account Holder Name</Text>
              <TextInput
                style={styles.input}
                value={accountHolder}
                onChangeText={setAccountHolder}
                placeholder="Enter account holder name"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitWithdrawal}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Submit Request</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {["all", "pending", "approved", "rejected"].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f as any)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === f && styles.filterTabTextActive,
                ]}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Withdrawals List */}
        <View style={styles.listContainer}>
          {loading && !refreshing ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={styles.loader}
            />
          ) : filteredWithdrawals.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="document-text-outline"
                size={60}
                color={Colors.textSecondary}
              />
              <Text style={styles.emptyText}>No withdrawal requests found</Text>
            </View>
          ) : (
            filteredWithdrawals.map((withdrawal) => (
              <View key={withdrawal.id} style={styles.withdrawalCard}>
                <View style={styles.withdrawalHeader}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(withdrawal.status) },
                    ]}
                  >
                    <Ionicons
                      name={getStatusIcon(withdrawal.status)}
                      size={14}
                      color={Colors.white}
                    />
                    <Text style={styles.statusText}>
                      {withdrawal.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.withdrawalAmount}>
                    -₹{withdrawal.amount.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.withdrawalDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Account</Text>
                    <Text style={styles.detailValue}>
                      ****{withdrawal.bankAccountNumber.slice(-4)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>IFSC</Text>
                    <Text style={styles.detailValue}>
                      {withdrawal.ifscCode}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>
                      {new Date(withdrawal.requestDate).toLocaleDateString()}
                    </Text>
                  </View>
                  {withdrawal.rejectionReason && (
                    <View style={styles.rejectionBox}>
                      <Text style={styles.rejectionText}>
                        Reason: {withdrawal.rejectionReason}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

// Styles would go here...
```

---

### Phase 4: Trading & Plan Purchase Integration (Tasks 8-9)

**Priority: HIGH**

#### 4.1 Update Trading Flows

**Files**:

- `frontend/app/(tabs)/(trades)/color-trading.tsx`
- `frontend/app/(tabs)/(trades)/number-trading.tsx`
- `frontend/app/(tabs)/(trades)/cart.tsx`

**Key Changes**:

```typescript
// Before placing trade
const { wallet, deductFromWallet } = useWallet();
const router = useRouter();

// Check balance
if (!wallet || wallet.balance < totalAmount) {
  Alert.alert(
    "Insufficient Balance",
    `You need ₹${totalAmount} but have ${wallet.formattedBalance}. Add money to continue.`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Add Money",
        onPress: () => router.push("/(tabs)/(home)/add-money"),
      },
    ]
  );
  return;
}

// Place trade - backend will deduct from wallet
try {
  const response = await tradingApi.placeTrade(tradeData);

  if (response.success) {
    // Refresh wallet to show updated balance
    await refreshWallet();
    Alert.alert("Success", "Trade placed successfully!");
  }
} catch (error: any) {
  Alert.alert("Error", error.message || "Failed to place trade");
}
```

#### 4.2 Update Plan Purchase Flow

**File**: Create `frontend/services/planService.ts`

```typescript
import api from "./api";

export const planService = {
  // Purchase plan using wallet balance
  async purchasePlan(planId: string, amount: number): Promise<any> {
    const response = await api.post("/plans/purchase", {
      planId,
      amount,
      paymentMethod: "wallet",
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to purchase plan");
    }

    return response.data.data;
  },

  // Get available plans
  async getPlans(): Promise<any[]> {
    const response = await api.get("/plans");
    return response.data.data || [];
  },
};
```

**Update plan purchase screens**:

```typescript
// Check wallet balance before purchase
const handlePurchase = async (plan: any) => {
  if (!wallet || wallet.balance < plan.price) {
    Alert.alert(
      "Insufficient Balance",
      "Please add money to your wallet to purchase this plan.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add Money",
          onPress: () => router.push("/(tabs)/(home)/add-money"),
        },
      ]
    );
    return;
  }

  Alert.alert("Confirm Purchase", `Purchase ${plan.name} for ₹${plan.price}?`, [
    { text: "Cancel", style: "cancel" },
    {
      text: "Confirm",
      onPress: async () => {
        try {
          await planService.purchasePlan(plan.id, plan.price);
          await refreshWallet();
          Alert.alert("Success", "Plan purchased successfully!");
        } catch (error: any) {
          Alert.alert("Error", error.message);
        }
      },
    },
  ]);
};
```

---

### Phase 5: UI Polish & Navigation (Tasks 13, 18)

**Priority: MEDIUM**

#### 5.1 Add Balance to Header

**File**: Update `frontend/app/(tabs)/_layout.tsx` or create a header component

```typescript
import { useWallet } from "../../contexts/WalletContext";

function WalletHeaderButton() {
  const { wallet, refreshWallet } = useWallet();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.walletButton}
      onPress={() => router.push("/(tabs)/(home)/wallet")}
    >
      <Ionicons name="wallet" size={20} color={Colors.primary} />
      <Text style={styles.balanceText}>{wallet?.formattedBalance || "₹0"}</Text>
      <TouchableOpacity onPress={refreshWallet}>
        <Ionicons name="refresh" size={16} color={Colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
```

#### 5.2 Add Transaction Filters

Already covered in wallet.tsx Phase 2.2

---

### Phase 6: Testing & Validation (Tasks 17, 19-20)

**Priority: HIGH**

#### Test Checklist:

1. **Wallet Balance Display**

   - [ ] Dashboard shows real balance
   - [ ] Wallet page shows real balance
   - [ ] Balance updates after trades
   - [ ] Balance updates after add money
   - [ ] Balance updates after withdrawal request

2. **Add Money Flow**

   - [ ] WebView opens web frontend correctly
   - [ ] JWT token is passed properly
   - [ ] Payment success closes WebView and refreshes balance
   - [ ] Payment failure shows error message
   - [ ] Cancel/back closes WebView

3. **Trading with Wallet**

   - [ ] Insufficient balance shows add money prompt
   - [ ] Successful trade deducts from wallet
   - [ ] Failed trade doesn't deduct from wallet
   - [ ] Cart checkout validates balance
   - [ ] Batch trades work correctly

4. **Plan Purchase**

   - [ ] Balance check before purchase
   - [ ] Successful purchase deducts correctly
   - [ ] Plan activates after purchase
   - [ ] Subscription shows in dashboard

5. **Withdrawal**

   - [ ] Form validation works
   - [ ] Withdrawal request submits
   - [ ] Balance deducts on submission
   - [ ] Request appears in history
   - [ ] Status updates show correctly

6. **Transaction History**

   - [ ] Transactions load from API
   - [ ] Filters work correctly
   - [ ] Pagination works (if implemented)
   - [ ] Pull-to-refresh works
   - [ ] Transaction details are accurate

7. **Error Handling**
   - [ ] Network errors show gracefully
   - [ ] 401 errors redirect to login
   - [ ] Invalid data shows validation errors
   - [ ] Loading states work correctly

---

## Backend Requirements Checklist

Ensure these endpoints exist and work:

- [ ] `GET /api/wallet/` - Get wallet details
- [ ] `GET /api/wallet/balance` - Get balance only
- [ ] `GET /api/wallet/transactions` - Get transaction history
- [ ] `GET /api/wallet/can-pay?amount=X` - Check if can pay
- [ ] `POST /api/wallet/pay` - Process payment from wallet
- [ ] `POST /api/withdrawals/request` - Request withdrawal
- [ ] `GET /api/withdrawals/my-requests` - Get user withdrawals
- [ ] `POST /api/plans/purchase` - Purchase plan with wallet
- [ ] Trading APIs deduct from wallet automatically

---

## Environment Configuration

### Mobile App

**File**: `frontend/.env`

```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.137.1:5000/api
EXPO_PUBLIC_WEB_FRONTEND_URL=https://your-web-frontend.com
```

### Web Frontend Updates

**File**: `web-frontend/src/pages/AddMoney.tsx`

Add message posting for mobile app:

```typescript
useEffect(() => {
  // Check if opened from mobile app
  const urlParams = new URLSearchParams(window.location.search);
  const isMobile = urlParams.get("source") === "mobile";

  if (isMobile && window.ReactNativeWebView) {
    // Payment success handler
    const handlePaymentSuccess = (amount: number) => {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "PAYMENT_SUCCESS",
          amount,
        })
      );
    };

    // Add to your payment success logic
  }
}, []);
```

---

## Security Considerations

1. **Token Security**

   - JWT tokens passed via HTTPS only
   - Tokens expire and refresh properly
   - WebView uses secure context

2. **Balance Validation**

   - Always validate on backend
   - Never trust client-side balance
   - Use atomic transactions

3. **Withdrawal Validation**

   - Verify account details format
   - Admin approval required
   - Maximum withdrawal limits
   - Minimum balance requirements

4. **Error Messages**
   - Don't expose sensitive data
   - Generic error messages for security
   - Log details server-side only

---

## Rollout Plan

### Week 1: Core Services & Context

- Days 1-2: Create walletService.ts and withdrawalService.ts
- Days 3-4: Update WalletContext with real API integration
- Day 5: Update type definitions and test services

### Week 2: UI Updates

- Days 1-2: Update Dashboard and Wallet pages
- Days 3-4: Create Add Money WebView screen
- Day 5: Create Withdrawals screen

### Week 3: Purchase Flow Integration

- Days 1-2: Update trading purchase flows
- Days 3-4: Update plan purchase flows
- Day 5: Add wallet balance to navigation

### Week 4: Testing & Polish

- Days 1-2: Comprehensive testing
- Days 3-4: Bug fixes and edge cases
- Day 5: Final testing and deployment

---

## Success Metrics

- [ ] Zero mock data in production
- [ ] All transactions go through wallet
- [ ] Add money via web works 100%
- [ ] Withdrawal requests submit successfully
- [ ] Balance always accurate
- [ ] No transaction errors
- [ ] User can complete full flow without issues

---

## Support & Maintenance

### Common Issues

1. **Balance not updating**

   - Check `refreshWallet()` is called after transactions
   - Verify backend deducts correctly
   - Check API response structure

2. **WebView not loading**

   - Verify web frontend URL is correct
   - Check token is being passed
   - Ensure HTTPS is used

3. **Withdrawal not working**
   - Verify backend endpoint exists
   - Check validation rules match
   - Ensure user has sufficient balance

### Monitoring

- Log all wallet operations
- Track failed transactions
- Monitor withdrawal approval times
- Alert on balance mismatches

---

## Additional Features (Future)

1. **Transaction Receipts**

   - Generate PDF receipts
   - Email transaction confirmations
   - Download transaction history

2. **Auto-refill**

   - Set minimum balance threshold
   - Auto-redirect to add money

3. **Wallet Limits**

   - Daily spending limits
   - Transaction velocity checks
   - Fraud detection

4. **Multiple Payment Methods**
   - Save payment methods in web
   - One-click recharge
   - Recurring deposits

---

## Conclusion

This integration plan ensures:

- ✅ Complete removal of mock data
- ✅ Real-time wallet balance across app
- ✅ Secure payment flow via web
- ✅ Complete withdrawal functionality
- ✅ Unified purchase experience
- ✅ Professional error handling
- ✅ Comprehensive testing

Follow the phases in order, test thoroughly at each step, and maintain clean separation between mobile spending and web payment gateway integration.
