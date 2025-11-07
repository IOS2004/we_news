import { Transaction } from "../services/walletService";
import { Colors } from "../constants/theme";

/**
 * Wallet Utility Functions
 * Centralized business logic for wallet operations
 */

/**
 * Check if wallet has sufficient balance for a transaction
 */
export const checkSufficientBalance = (
  requiredAmount: number,
  walletBalance: number
): { sufficient: boolean; shortfall: number } => {
  const sufficient = walletBalance >= requiredAmount;
  const shortfall = sufficient ? 0 : requiredAmount - walletBalance;

  return {
    sufficient,
    shortfall,
  };
};

/**
 * Format currency amount with rupee symbol
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

/**
 * Format currency without decimals
 */
export const formatCurrencyInt = (amount: number): string => {
  return `₹${Math.floor(amount)}`;
};

/**
 * Calculate service charge (10% with minimum ₹5)
 */
export const calculateServiceCharge = (amount: number): number => {
  const MIN_SERVICE_CHARGE = 5;
  const SERVICE_CHARGE_PERCENTAGE = 0.1; // 10%

  if (amount === 0) return 0;

  const charge = Math.round(amount * SERVICE_CHARGE_PERCENTAGE * 100) / 100;
  return Math.max(charge, MIN_SERVICE_CHARGE);
};

/**
 * Calculate total amount including service charge
 */
export const calculateTotalWithServiceCharge = (
  baseAmount: number
): {
  baseAmount: number;
  serviceCharge: number;
  totalAmount: number;
} => {
  const serviceCharge = calculateServiceCharge(baseAmount);
  const totalAmount = baseAmount + serviceCharge;

  return {
    baseAmount,
    serviceCharge,
    totalAmount,
  };
};

/**
 * Get transaction type display name
 */
export const formatTransactionType = (
  type: Transaction["transactionType"]
): string => {
  const typeMap: Record<Transaction["transactionType"], string> = {
    credit: "Credit",
    debit: "Debit",
    refund: "Refund",
    cashback: "Cashback",
  };

  return typeMap[type] || type;
};

/**
 * Get transaction icon name (Ionicons)
 */
export const getTransactionIcon = (
  type: Transaction["transactionType"]
): string => {
  const iconMap: Record<Transaction["transactionType"], string> = {
    credit: "arrow-down-circle",
    debit: "arrow-up-circle",
    refund: "refresh-circle",
    cashback: "gift",
  };

  return iconMap[type] || "cash";
};

/**
 * Get transaction color based on type
 */
export const getTransactionColor = (
  type: Transaction["transactionType"]
): string => {
  const colorMap: Record<Transaction["transactionType"], string> = {
    credit: Colors.success,
    debit: Colors.error,
    refund: Colors.warning,
    cashback: Colors.primary,
  };

  return colorMap[type] || Colors.textSecondary;
};

/**
 * Get transaction status color
 */
export const getTransactionStatusColor = (
  status: Transaction["status"]
): string => {
  const colorMap: Record<Transaction["status"], string> = {
    success: Colors.success,
    pending: Colors.warning,
    failed: Colors.error,
  };

  return colorMap[status] || Colors.textSecondary;
};

/**
 * Get transaction status icon
 */
export const getTransactionStatusIcon = (
  status: Transaction["status"]
): string => {
  const iconMap: Record<Transaction["status"], string> = {
    success: "checkmark-circle",
    pending: "time",
    failed: "close-circle",
  };

  return iconMap[status] || "help-circle";
};

/**
 * Format transaction date from Firebase timestamp
 */
export const formatTransactionDate = (transaction: Transaction): string => {
  try {
    const date = new Date(transaction.createdAt._seconds * 1000);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return "N/A";
  }
};

/**
 * Format transaction time from Firebase timestamp
 */
export const formatTransactionTime = (transaction: Transaction): string => {
  try {
    const date = new Date(transaction.createdAt._seconds * 1000);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "N/A";
  }
};

/**
 * Format transaction date and time
 */
export const formatTransactionDateTime = (transaction: Transaction): string => {
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
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (transaction: Transaction): string => {
  try {
    const date = new Date(transaction.createdAt._seconds * 1000);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      return formatTransactionDate(transaction);
    }
  } catch (error) {
    return "N/A";
  }
};

/**
 * Validate amount input
 */
export const validateAmount = (
  amount: number,
  minAmount: number = 1,
  maxAmount?: number
): { valid: boolean; error?: string } => {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: "Please enter a valid amount" };
  }

  if (amount < minAmount) {
    return {
      valid: false,
      error: `Minimum amount is ${formatCurrency(minAmount)}`,
    };
  }

  if (maxAmount && amount > maxAmount) {
    return {
      valid: false,
      error: `Maximum amount is ${formatCurrency(maxAmount)}`,
    };
  }

  return { valid: true };
};

/**
 * Get transaction category from description
 */
export const categorizeTransaction = (description: string): string => {
  const desc = description.toLowerCase();

  if (
    desc.includes("trading") ||
    desc.includes("bet") ||
    desc.includes("game")
  ) {
    return "Trading";
  } else if (desc.includes("withdrawal") || desc.includes("withdraw")) {
    return "Withdrawal";
  } else if (
    desc.includes("topup") ||
    desc.includes("deposit") ||
    desc.includes("add money")
  ) {
    return "Deposit";
  } else if (desc.includes("bonus") || desc.includes("reward")) {
    return "Bonus";
  } else if (desc.includes("plan") || desc.includes("subscription")) {
    return "Subscription";
  } else if (desc.includes("refund")) {
    return "Refund";
  } else {
    return "Other";
  }
};

/**
 * Get category icon
 */
export const getCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    Trading: "trending-up",
    Withdrawal: "arrow-down",
    Deposit: "arrow-up",
    Bonus: "gift",
    Subscription: "card",
    Refund: "refresh",
    Other: "cash",
  };

  return iconMap[category] || "cash";
};

/**
 * Format large numbers (e.g., 1000 -> 1K)
 */
export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toString();
  }
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Generate insufficient balance error message
 */
export const getInsufficientBalanceMessage = (
  requiredAmount: number,
  currentBalance: number
): string => {
  const shortfall = requiredAmount - currentBalance;
  return `Insufficient balance! You need ${formatCurrency(
    shortfall
  )} more. Current balance: ${formatCurrency(currentBalance)}`;
};

/**
 * Filter transactions by type
 */
export const filterTransactionsByType = (
  transactions: Transaction[],
  type: Transaction["transactionType"] | "all"
): Transaction[] => {
  if (type === "all") {
    return transactions;
  }
  return transactions.filter((tx) => tx.transactionType === type);
};

/**
 * Filter transactions by status
 */
export const filterTransactionsByStatus = (
  transactions: Transaction[],
  status: Transaction["status"] | "all"
): Transaction[] => {
  if (status === "all") {
    return transactions;
  }
  return transactions.filter((tx) => tx.status === status);
};

/**
 * Filter transactions by date range
 */
export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] => {
  return transactions.filter((tx) => {
    const txDate = new Date(tx.createdAt._seconds * 1000);
    return txDate >= startDate && txDate <= endDate;
  });
};

/**
 * Calculate total for filtered transactions
 */
export const calculateTransactionTotal = (
  transactions: Transaction[],
  type?: Transaction["transactionType"]
): number => {
  let filtered = transactions;

  if (type) {
    filtered = transactions.filter((tx) => tx.transactionType === type);
  }

  return filtered
    .filter((tx) => tx.status === "success")
    .reduce((total, tx) => total + tx.amount, 0);
};

/**
 * Sort transactions by date (newest first)
 */
export const sortTransactionsByDate = (
  transactions: Transaction[],
  ascending: boolean = false
): Transaction[] => {
  return [...transactions].sort((a, b) => {
    const dateA = a.createdAt._seconds;
    const dateB = b.createdAt._seconds;
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export default {
  checkSufficientBalance,
  formatCurrency,
  formatCurrencyInt,
  calculateServiceCharge,
  calculateTotalWithServiceCharge,
  formatTransactionType,
  getTransactionIcon,
  getTransactionColor,
  getTransactionStatusColor,
  getTransactionStatusIcon,
  formatTransactionDate,
  formatTransactionTime,
  formatTransactionDateTime,
  getRelativeTime,
  validateAmount,
  categorizeTransaction,
  getCategoryIcon,
  formatCompactNumber,
  calculatePercentage,
  getInsufficientBalanceMessage,
  filterTransactionsByType,
  filterTransactionsByStatus,
  filterTransactionsByDateRange,
  calculateTransactionTotal,
  sortTransactionsByDate,
};
