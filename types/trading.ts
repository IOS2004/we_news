/**
 * Trading Types - Matching Backend API Structure
 * Based on backend/models/TradingRound.js and TradingOrder.js
 */

export type GameType = "color" | "number";
export type RoundStatus =
  | "upcoming"
  | "active"
  | "open"
  | "closed"
  | "settled"
  | "cancelled";
export type OrderStatus = "placed" | "won" | "lost" | "refunded";

/**
 * Trading Round - matches backend TradingRound model
 */
export interface TradingRound {
  id: string;
  roundId?: string; // Backend sometimes returns this
  gameType: GameType;
  roundType?: "colour" | "number"; // Alternative name used by backend
  roundNumber: number;
  status: RoundStatus;
  options: string[]; // ['Red', 'Blue', ...] or ['0', '1', ..., '9']
  multipliers: Record<string, number>; // { 'Red': 10, 'Blue': 10, ... }
  startsAt: string | Date | null;
  startTime?: any; // Web frontend uses this
  endsAt: string | Date;
  resultDeclarationTime?: any; // Web frontend uses this
  winningOption: string | null;
  settledAt: string | Date | null;
  totalTrades?: number; // Number of trades placed
  createdBy: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Selection in an order
 */
export interface OrderSelection {
  option: string; // 'Red', 'Blue' or '0', '1', etc
  amount: number;
}

/**
 * Trading Order - matches backend TradingOrder model
 */
export interface TradingOrder {
  id: string;
  userId: string;
  roundId: string;
  gameType: GameType;
  selections: OrderSelection[];
  totalAmount: number;
  status: OrderStatus;
  payout: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface RoundsListResponse {
  rounds: TradingRound[];
}

export interface RoundDetailResponse {
  round: TradingRound;
}

export interface PlaceOrderRequest {
  roundId: string;
  selections: OrderSelection[];
}

export interface PlaceOrderResponse {
  order: TradingOrder;
  wallet: {
    balance: number;
    userId: string;
  };
}

export interface MyOrdersResponse {
  orders: TradingOrder[];
}

/**
 * Color configuration for UI
 */
export interface ColorConfig {
  id: string;
  name: string;
  color: string;
  textColor: string;
  multiplier?: number;
}

/**
 * Available trading colors (matching backend defaults)
 */
export const TRADING_COLORS: ColorConfig[] = [
  { id: "Red", name: "Red", color: "#DC2626", textColor: "#FFFFFF" },
  { id: "Blue", name: "Blue", color: "#2563EB", textColor: "#FFFFFF" },
  { id: "Green", name: "Green", color: "#16A34A", textColor: "#FFFFFF" },
  { id: "Yellow", name: "Yellow", color: "#EAB308", textColor: "#000000" },
  { id: "Orange", name: "Orange", color: "#EA580C", textColor: "#FFFFFF" },
  { id: "Pink", name: "Pink", color: "#EC4899", textColor: "#FFFFFF" },
  { id: "Black", name: "Black", color: "#1F2937", textColor: "#FFFFFF" },
  { id: "White", name: "White", color: "#F3F4F6", textColor: "#000000" },
  { id: "Violet", name: "Violet", color: "#8B5CF6", textColor: "#FFFFFF" },
  { id: "Brown", name: "Brown", color: "#92400E", textColor: "#FFFFFF" },
  { id: "Cyan", name: "Cyan", color: "#06B6D4", textColor: "#FFFFFF" },
  { id: "Gray", name: "Gray", color: "#6B7280", textColor: "#FFFFFF" },
];

/**
 * Helper to get color config by name
 */
export const getColorConfig = (colorName: string): ColorConfig | undefined => {
  return TRADING_COLORS.find(
    (c) => c.id.toLowerCase() === colorName.toLowerCase()
  );
};

/**
 * Helper to calculate time remaining in seconds
 */
export const calculateTimeRemaining = (endTime: string | Date): number => {
  try {
    const endDate = typeof endTime === "string" ? new Date(endTime) : endTime;
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    return Math.max(0, Math.floor(diff / 1000));
  } catch (error) {
    console.error("Error calculating time remaining:", error);
    return 0;
  }
};

/**
 * Helper to format time in MM:SS
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Check if round is currently accepting bets
 */
export const isRoundOpen = (round: TradingRound): boolean => {
  if (round.status !== "open") return false;
  if (!round.endsAt) return false;

  const timeRemaining = calculateTimeRemaining(round.endsAt);
  return timeRemaining > 0;
};
