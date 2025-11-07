import api from "./api";

// Withdrawal interfaces
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
  transactionId?: string;
}

export interface WithdrawalRequestData {
  amount: number;
  bankAccountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export interface WithdrawalApiResponse {
  success: boolean;
  message: string;
  data: {
    withdrawalRequest: WithdrawalRequest;
    newBalance: number;
  };
}

export interface WithdrawalListResponse {
  success: boolean;
  message: string;
  data: WithdrawalRequest[];
}

/**
 * Withdrawal Service
 * Handles all withdrawal-related API operations
 */
export const withdrawalService = {
  /**
   * Request a new withdrawal
   * Requires bank account details
   */
  async requestWithdrawal(
    data: WithdrawalRequestData
  ): Promise<{ withdrawalRequest: WithdrawalRequest; newBalance: number }> {
    try {
      const response = await api.post<WithdrawalApiResponse>(
        "/withdrawals/request",
        data
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to request withdrawal"
        );
      }

      return response.data.data;
    } catch (error: any) {
      console.error("Withdrawal service - requestWithdrawal error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit withdrawal request"
      );
    }
  },

  /**
   * Get user's withdrawal history
   * Supports pagination and status filtering
   */
  async getMyWithdrawals(
    page: number = 1,
    limit: number = 20,
    status?: "pending" | "approved" | "rejected" | "processing" | "completed"
  ): Promise<WithdrawalRequest[]> {
    try {
      const params: any = { page, limit };
      if (status) {
        params.status = status;
      }

      const response = await api.get<WithdrawalListResponse>(
        "/withdrawals/my-requests",
        {
          params,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch withdrawals");
      }

      return response.data.data || [];
    } catch (error: any) {
      console.error("Withdrawal service - getMyWithdrawals error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch withdrawal history"
      );
    }
  },

  /**
   * Get pending withdrawals count
   */
  async getPendingCount(): Promise<number> {
    try {
      const withdrawals = await this.getMyWithdrawals(1, 100, "pending");
      return withdrawals.length;
    } catch (error) {
      console.error("Withdrawal service - getPendingCount error:", error);
      return 0;
    }
  },

  /**
   * Get all pending withdrawals
   */
  async getPendingWithdrawals(): Promise<WithdrawalRequest[]> {
    try {
      return await this.getMyWithdrawals(1, 100, "pending");
    } catch (error) {
      console.error("Withdrawal service - getPendingWithdrawals error:", error);
      return [];
    }
  },

  /**
   * Cancel a withdrawal request (if supported by backend)
   */
  async cancelWithdrawal(withdrawalId: string): Promise<void> {
    try {
      const response = await api.delete(`/withdrawals/${withdrawalId}`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to cancel withdrawal");
      }
    } catch (error: any) {
      console.error("Withdrawal service - cancelWithdrawal error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to cancel withdrawal request"
      );
    }
  },

  /**
   * Format withdrawal date
   */
  formatWithdrawalDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  },

  /**
   * Get status display name
   */
  getStatusLabel(status: WithdrawalRequest["status"]): string {
    const labels = {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      processing: "Processing",
      completed: "Completed",
    };
    return labels[status] || status;
  },

  /**
   * Get status color for UI
   */
  getStatusColor(status: WithdrawalRequest["status"]): string {
    const colors = {
      pending: "#F59E0B",
      approved: "#22C55E",
      rejected: "#EF4444",
      processing: "#3B82F6",
      completed: "#10B981",
    };
    return colors[status] || "#6B7280";
  },

  /**
   * Get status icon name (Ionicons)
   */
  getStatusIcon(status: WithdrawalRequest["status"]): string {
    const icons = {
      pending: "time",
      approved: "checkmark-circle",
      rejected: "close-circle",
      processing: "sync",
      completed: "checkmark-done-circle",
    };
    return icons[status] || "help-circle";
  },

  /**
   * Validate bank account number format
   */
  validateAccountNumber(accountNumber: string): boolean {
    // Basic validation: 9-18 digits
    return /^\d{9,18}$/.test(accountNumber);
  },

  /**
   * Validate IFSC code format
   */
  validateIFSC(ifscCode: string): boolean {
    // IFSC format: 4 letters + 7 characters (letters/digits)
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase());
  },

  /**
   * Mask account number for display
   * Shows only last 4 digits
   */
  maskAccountNumber(accountNumber: string): string {
    if (accountNumber.length <= 4) return accountNumber;
    return `****${accountNumber.slice(-4)}`;
  },

  /**
   * Calculate processing time estimate
   */
  getProcessingTimeEstimate(status: WithdrawalRequest["status"]): string {
    switch (status) {
      case "pending":
        return "24-48 hours";
      case "processing":
        return "2-6 hours";
      case "approved":
        return "Processing payment";
      case "completed":
        return "Completed";
      case "rejected":
        return "Not processed";
      default:
        return "Unknown";
    }
  },
};

export default withdrawalService;
