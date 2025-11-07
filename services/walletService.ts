import api from "./api";

// Wallet interfaces
export interface Wallet {
  walletId: string;
  balance: number;
  formattedBalance: string;
  status: "active" | "inactive" | "suspended";
  canTransact: boolean;
  totalTransactions?: number;
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

export interface WalletApiResponse {
  success: boolean;
  message: string;
  data: {
    walletId: string;
    balance: number;
    formattedBalance: string;
    status: string;
    transactions: Transaction[];
    totalTransactions: number;
    canTransact: boolean;
  };
}

export interface TransactionsApiResponse {
  success: boolean;
  message: string;
  data: {
    transactions: Transaction[];
    totalTransactions: number;
  };
}

export interface PaymentRequest {
  amount: number;
  description: string;
  serviceId?: string;
  bookingId?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    newBalance: number;
    transaction: Transaction;
  };
}

/**
 * Wallet Service
 * Handles all wallet-related API operations
 */
export const walletService = {
  /**
   * Get complete wallet details including balance and recent transactions
   */
  async getWallet(): Promise<Wallet> {
    try {
      const response = await api.get<WalletApiResponse>("/wallet");

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch wallet");
      }

      return {
        walletId: response.data.data.walletId,
        balance: response.data.data.balance,
        formattedBalance: response.data.data.formattedBalance,
        status: response.data.data.status as
          | "active"
          | "inactive"
          | "suspended",
        canTransact: response.data.data.canTransact,
        totalTransactions: response.data.data.totalTransactions,
      };
    } catch (error: any) {
      console.error("Wallet service - getWallet error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch wallet details"
      );
    }
  },

  /**
   * Get wallet balance only (lightweight endpoint)
   */
  async getBalance(): Promise<number> {
    try {
      const response = await api.get<{
        success: boolean;
        message: string;
        data: { balance: number; formattedBalance: string };
      }>("/wallet/balance");

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch balance");
      }

      return response.data.data.balance;
    } catch (error: any) {
      console.error("Wallet service - getBalance error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch wallet balance"
      );
    }
  },

  /**
   * Get transaction history with optional filters and pagination
   */
  async getTransactions(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: "credit" | "debit" | "refund" | "cashback";
      status?: "pending" | "success" | "failed";
    }
  ): Promise<{ data: Transaction[]; total: number }> {
    try {
      const params: any = {
        limit,
        skip: (page - 1) * limit,
      };

      if (filters?.type) {
        params.type = filters.type;
      }
      if (filters?.status) {
        params.status = filters.status;
      }

      const response = await api.get<TransactionsApiResponse>(
        "/wallet/transactions",
        {
          params,
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch transactions"
        );
      }

      return {
        data: response.data.data.transactions || [],
        total: response.data.data.totalTransactions || 0,
      };
    } catch (error: any) {
      console.error("Wallet service - getTransactions error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch transaction history"
      );
    }
  },

  /**
   * Check if wallet has sufficient balance for a payment
   */
  async canPay(amount: number): Promise<boolean> {
    try {
      const response = await api.get<{
        success: boolean;
        message: string;
        data: { canPay: boolean; balance: number };
      }>("/wallet/can-pay", {
        params: { amount },
      });

      return response.data.success && response.data.data.canPay;
    } catch (error: any) {
      console.error("Wallet service - canPay error:", error);
      // Return false on error (don't block user, let them try)
      return false;
    }
  },

  /**
   * Process payment from wallet
   * Used for trades, plan purchases, and other services
   */
  async processPayment(
    paymentData: PaymentRequest
  ): Promise<PaymentResponse["data"]> {
    try {
      const response = await api.post<PaymentResponse>(
        "/wallet/pay",
        paymentData
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Payment failed");
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Wallet service - processPayment error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to process payment from wallet"
      );
    }
  },

  /**
   * Request refund to wallet
   */
  async requestRefund(data: {
    originalTransactionId: string;
    amount: number;
    reason: string;
  }): Promise<any> {
    try {
      const response = await api.post("/wallet/refund", data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Refund request failed");
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Wallet service - requestRefund error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to request refund"
      );
    }
  },

  /**
   * Format transaction date from Firebase timestamp
   */
  formatTransactionDate(transaction: Transaction): string {
    try {
      const date = new Date(transaction.createdAt._seconds * 1000);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "N/A";
    }
  },

  /**
   * Get transaction type display name
   */
  getTransactionTypeLabel(type: Transaction["transactionType"]): string {
    const labels = {
      credit: "Credit",
      debit: "Debit",
      refund: "Refund",
      cashback: "Cashback",
    };
    return labels[type] || type;
  },

  /**
   * Get transaction status color
   */
  getTransactionStatusColor(status: Transaction["status"]): string {
    const colors = {
      success: "#22C55E",
      pending: "#F59E0B",
      failed: "#EF4444",
    };
    return colors[status] || "#6B7280";
  },
};

export default walletService;
