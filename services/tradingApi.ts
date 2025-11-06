/**
 * Trading API Service for Mobile App
 * Integrates with backend trading endpoints
 * Based on backend/routes/trading.js and backend/controllers/tradingController.js
 */

import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TradingRound,
  TradingOrder,
  ApiResponse,
  RoundsListResponse,
  RoundDetailResponse,
  PlaceOrderRequest,
  PlaceOrderResponse,
  MyOrdersResponse,
  GameType,
  RoundStatus,
  OrderSelection,
} from "../types/trading";

// API Configuration
const getApiBaseUrl = () => {
  return (
    process.env.EXPO_PUBLIC_API_BASE_URL || "https://wenews.onrender.com/api"
  );
};

const API_BASE_URL = getApiBaseUrl();
const TOKEN_STORAGE_KEY = "auth_token";

/**
 * Trading API Client
 */
class TradingApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/trading`;
  }

  /**
   * Get auth headers with token
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /**
   * Handle API errors
   */
  private handleError(error: any, context: string): never {
    if (__DEV__) {
      console.error(`[TradingAPI] ${context}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }

    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message);
  }

  /**
   * GET /api/trading/active-rounds
   * Get active trading rounds
   *
   * @param roundType - 'colour' or 'number'
   */
  async listActiveRounds(
    roundType?: "colour" | "number"
  ): Promise<TradingRound[]> {
    try {
      const headers = await this.getAuthHeaders();
      const params: any = {};
      if (roundType) params.roundType = roundType;

      const response = await axios.get<ApiResponse<TradingRound[]>>(
        `${this.baseURL}/active-rounds`,
        { headers, params }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      this.handleError(error, "listActiveRounds");
    }
  }

  /**
   * GET /api/trading/upcoming-rounds
   * Get upcoming trading rounds
   *
   * @param roundType - 'colour' or 'number'
   * @param limit - Number of rounds to return
   */
  async listUpcomingRounds(
    roundType?: "colour" | "number",
    limit?: number
  ): Promise<TradingRound[]> {
    try {
      const headers = await this.getAuthHeaders();
      const params: any = {};
      if (roundType) params.roundType = roundType;
      if (limit) params.limit = limit;

      const response = await axios.get<ApiResponse<TradingRound[]>>(
        `${this.baseURL}/upcoming-rounds`,
        { headers, params }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      this.handleError(error, "listUpcomingRounds");
    }
  }

  /**
   * GET /api/trading/rounds/:roundId
   * Get details of a specific round
   *
   * @param roundId - Round ID
   */
  async getRound(roundId: string): Promise<TradingRound | null> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get<ApiResponse<TradingRound>>(
        `${this.baseURL}/rounds/${roundId}`,
        { headers }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      this.handleError(error, "getRound");
    }
  }

  /**
   * POST /api/trading/place-trade
   * Place a trade in an active round
   *
   * @param roundId - Round ID
   * @param tradeType - 'colour' or 'number'
   * @param selection - Selected option (color name or number)
   * @param amount - Bet amount
   */
  async placeTrade(
    roundId: string,
    tradeType: "colour" | "number",
    selection: string | number,
    amount: number
  ): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();

      const payload = {
        roundId,
        tradeType,
        selection,
        amount,
      };

      const response = await axios.post<ApiResponse<any>>(
        `${this.baseURL}/place-trade`,
        payload,
        { headers }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || "Failed to place trade");
    } catch (error) {
      this.handleError(error, "placeTrade");
    }
  }

  /**
   * POST /api/trading/place-trades-batch
   * Place multiple trades in a single API call
   *
   * @param trades - Array of trade objects
   */
  async placeTradesBatch(
    trades: Array<{
      roundId: string;
      tradeType: "colour" | "number";
      selection: string | number;
      amount: number;
    }>
  ): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await axios.post<ApiResponse<any>>(
        `${this.baseURL}/place-trades-batch`,
        { trades },
        { headers }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || "Failed to place batch trades");
    } catch (error) {
      this.handleError(error, "placeTradesBatch");
    }
  }

  /**
   * Legacy method for backward compatibility
   * Maps to the new placeTrade method
   */
  async placeOrder(
    roundId: string,
    selections: OrderSelection[]
  ): Promise<PlaceOrderResponse | null> {
    try {
      // For now, place each selection as individual trade
      // In future, use place-trades-batch
      if (!selections || selections.length === 0) {
        throw new Error("At least one selection is required");
      }

      // Get round details to determine trade type
      const round = await this.getRound(roundId);
      if (!round) {
        throw new Error("Round not found");
      }

      const tradeType = round.roundType || "colour";

      // Place all trades
      const results = [];
      for (const sel of selections) {
        const result = await this.placeTrade(
          roundId,
          tradeType,
          sel.option,
          sel.amount
        );
        results.push(result);
      }

      return {
        order: results[0],
        wallet: results[0]?.wallet || { balance: 0 },
      };
    } catch (error) {
      this.handleError(error, "placeOrder");
    }
  }

  /**
   * GET /api/trading/my-trades
   * Get user's all trades across all rounds
   *
   * @param page - Page number (default: 1)
   * @param limit - Results per page (default: 20)
   */
  async myOrders(params?: {
    page?: number;
    limit?: number;
  }): Promise<TradingOrder[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get<ApiResponse<TradingOrder[]>>(
        `${this.baseURL}/my-trades`,
        {
          headers,
          params: {
            page: params?.page || 1,
            limit: params?.limit || 50,
          },
        }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      this.handleError(error, "myOrders");
    }
  }

  /**
   * Get active rounds (open status)
   * Used by RoundsContext
   */
  async getActiveRounds(
    roundType: "colour" | "number"
  ): Promise<ApiResponse<TradingRound[]>> {
    try {
      const rounds = await this.listActiveRounds(roundType);
      return {
        success: true,
        message: "Active rounds fetched successfully",
        data: rounds,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to fetch active rounds",
        data: [],
      };
    }
  }

  /**
   * Get upcoming rounds
   * Used by RoundsContext
   */
  async getUpcomingRounds(
    roundType: "colour" | "number",
    limit: number = 10
  ): Promise<ApiResponse<TradingRound[]>> {
    try {
      const rounds = await this.listUpcomingRounds(roundType, limit);
      return {
        success: true,
        message: "Upcoming rounds fetched successfully",
        data: rounds,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to fetch upcoming rounds",
        data: [],
      };
    }
  }

  /**
   * Convenience method: Get active/open color rounds
   */
  async getActiveColorRounds(): Promise<TradingRound[]> {
    return this.listActiveRounds("colour");
  }

  /**
   * Convenience method: Get active/open number rounds
   */
  async getActiveNumberRounds(): Promise<TradingRound[]> {
    return this.listActiveRounds("number");
  }
}

// Export singleton instance
export const tradingApi = new TradingApiService();

// Export class for testing
export default TradingApiService;
