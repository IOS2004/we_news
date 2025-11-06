import api, { ApiResponse } from "./api";

// ============================================
// WALLET API TYPES & INTERFACES
// ============================================

/**
 * Wallet transaction from backend
 */
export interface WalletTransaction {
  id: string;
  walletId: string;
  transactionType: "credit" | "debit";
  amount: number;
  description: string;
  gstAmount?: number;
  discountAmount?: number;
  originalAmount?: number;
  status: "pending" | "completed" | "failed";
  transactionReference?: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

/**
 * Wallet details response from GET /api/wallet
 */
export interface WalletDetails {
  walletId: string;
  balance: number;
  formattedBalance: string;
  status: string;
  transactions: WalletTransaction[];
  totalTransactions: number;
  canTransact: boolean;
}

/**
 * Transaction query parameters
 */
export interface TransactionQuery {
  limit?: number;
  skip?: number;
  type?: "credit" | "debit";
  status?: "pending" | "completed" | "failed";
  startDate?: string;
  endDate?: string;
}

/**
 * Wallet topup request
 */
export interface TopupRequest {
  amount: number;
  paymentMethod: "phonepe" | "cashfree" | "razorpay";
  returnUrl?: string;
}

/**
 * Wallet topup response
 */
export interface TopupResponse {
  transactionId: string;
  orderId: string;
  amount: number;
  paymentUrl?: string;
  paymentSessionId?: string;
  status: string;
  message: string;
}

/**
 * Payment verification request
 */
export interface PaymentVerificationRequest {
  orderId: string;
  transactionId?: string;
  paymentStatus?: string;
}

/**
 * Withdrawal request
 */
export interface WithdrawalRequest {
  amount: number;
  paymentMethod: "bank_transfer" | "upi";
  paymentDetails: {
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    upiId?: string;
  };
}

/**
 * Withdrawal response
 */
export interface WithdrawalResponse {
  withdrawalId: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  message: string;
}

// ============================================
// WALLET API SERVICE
// ============================================

/**
 * Wallet API Service
 * Handles all wallet-related API calls
 */
const walletApi = {
  /**
   * Get wallet balance and details
   * Endpoint: GET /api/wallet
   */
  async getWalletDetails(): Promise<ApiResponse<WalletDetails>> {
    try {
      const response = await api.get<ApiResponse<WalletDetails>>("/wallet");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching wallet details:", error);
      throw (
        error.response?.data || {
          success: false,
          message: error.message || "Failed to fetch wallet details",
        }
      );
    }
  },

  /**
   * Get wallet balance only
   * Endpoint: GET /api/wallet/balance
   */
  async getBalance(): Promise<
    ApiResponse<{ balance: number; formattedBalance: string }>
  > {
    try {
      const response = await api.get<
        ApiResponse<{ balance: number; formattedBalance: string }>
      >("/wallet/balance");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching wallet balance:", error);
      throw (
        error.response?.data || {
          success: false,
          message: error.message || "Failed to fetch wallet balance",
        }
      );
    }
  },

  /**
   * Get wallet transactions with filters
   * Endpoint: GET /api/wallet/transactions
   */
  async getTransactions(params: TransactionQuery = {}): Promise<
    ApiResponse<{
      transactions: WalletTransaction[];
      totalTransactions: number;
      pagination: {
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
      };
    }>
  > {
    try {
      const response = await api.get("/wallet/transactions", { params });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching wallet transactions:", error);
      throw (
        error.response?.data || {
          success: false,
          message: error.message || "Failed to fetch transactions",
        }
      );
    }
  },

  /**
   * Initiate wallet topup
   * Endpoint: POST /api/wallet/topup
   */
  async topup(request: TopupRequest): Promise<ApiResponse<TopupResponse>> {
    try {
      const response = await api.post<ApiResponse<TopupResponse>>(
        "/wallet/topup",
        request
      );
      return response.data;
    } catch (error: any) {
      console.error("Error initiating wallet topup:", error);
      throw (
        error.response?.data || {
          success: false,
          message: error.message || "Failed to initiate topup",
        }
      );
    }
  },

  /**
   * Verify payment after completion
   * Endpoint: POST /api/wallet/verify-payment
   */
  async verifyPayment(request: PaymentVerificationRequest): Promise<
    ApiResponse<{
      verified: boolean;
      transaction: WalletTransaction;
    }>
  > {
    try {
      const response = await api.post("/wallet/verify-payment", request);
      return response.data;
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      throw (
        error.response?.data || {
          success: false,
          message: error.message || "Failed to verify payment",
        }
      );
    }
  },

  /**
   * Check if user can pay a specific amount
   * Endpoint: GET /api/wallet/can-pay
   */
  async canPay(
    amount: number
  ): Promise<ApiResponse<{ canPay: boolean; balance: number }>> {
    try {
      const response = await api.get("/wallet/can-pay", {
        params: { amount },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error checking payment ability:", error);
      throw (
        error.response?.data || {
          success: false,
          message: error.message || "Failed to check payment ability",
        }
      );
    }
  },

  /**
   * Request withdrawal
   * Endpoint: POST /api/wallet/withdrawal
   */
  async requestWithdrawal(
    request: WithdrawalRequest
  ): Promise<ApiResponse<WithdrawalResponse>> {
    try {
      const response = await api.post<ApiResponse<WithdrawalResponse>>(
        "/wallet/withdrawal",
        request
      );
      return response.data;
    } catch (error: any) {
      console.error("Error requesting withdrawal:", error);
      throw (
        error.response?.data || {
          success: false,
          message: error.message || "Failed to request withdrawal",
        }
      );
    }
  },

  /**
   * Get withdrawal history
   * Endpoint: GET /api/wallet/withdrawals
   */
  async getWithdrawals(params?: {
    limit?: number;
    skip?: number;
    status?: "pending" | "processing" | "completed" | "failed";
  }): Promise<
    ApiResponse<{
      withdrawals: any[];
      totalWithdrawals: number;
    }>
  > {
    try {
      const response = await api.get("/wallet/withdrawals", { params });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching withdrawals:", error);
      throw (
        error.response?.data || {
          success: false,
          message: error.message || "Failed to fetch withdrawals",
        }
      );
    }
  },

  /**
   * Get earnings breakdown
   * Endpoint: GET /api/wallet/earnings
   */
  async getEarnings(): Promise<
    ApiResponse<{
      totalEarnings: number;
      dailyEarnings: number;
      referralEarnings: number;
      investmentEarnings: number;
      todayEarnings: number;
      breakdown: {
        referral: number;
        investment: number;
        daily: number;
        other: number;
      };
    }>
  > {
    try {
      const response = await api.get("/wallet/earnings");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching earnings:", error);
      throw (
        error.response?.data || {
          success: false,
          message: error.message || "Failed to fetch earnings",
        }
      );
    }
  },
};

export default walletApi;
