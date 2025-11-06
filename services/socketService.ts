import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Get API base URL from environment
const getApiBaseUrl = (): string => {
  return (
    process.env.EXPO_PUBLIC_API_BASE_URL || "https://wenews.onrender.com/api"
  );
};

const API_BASE_URL = getApiBaseUrl();

// Remove /api from the base URL for socket connection
const SOCKET_URL = API_BASE_URL.replace("/api", "");

// Match backend socket event payload structures
interface SocketRoundEvent {
  id: string;
  roundNumber: number;
  gameType: "color" | "number";
  status: "upcoming" | "open" | "closed" | "settled" | "cancelled";
  endsAt: string;
  resultDeclarationTime: string;
  options: string[];
  multipliers: Record<string, number>;
  winningOption?: string;
  totalPool?: number;
  createdAt: string;
  updatedAt: string;
}

interface TradeEvent {
  userId: string;
  roundId: string;
  gameType: "color" | "number";
  totalAmount: number;
}

interface CountdownEvent {
  roundId: string;
  gameType: "color" | "number";
  timeRemaining: number;
}

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private isConnecting = false;

  /**
   * Connect to Socket.IO server with authentication
   */
  async connect(): Promise<void> {
    if (this.socket?.connected || this.isConnecting) {
      console.log("[Socket] Already connected or connecting");
      return;
    }

    this.isConnecting = true;

    try {
      const token = await AsyncStorage.getItem("auth_token"); // Changed from 'token' to 'auth_token'

      if (!token) {
        console.warn(
          "[Socket] No auth token found, connecting without authentication"
        );
      }

      this.socket = io(SOCKET_URL, {
        auth: { token: token || undefined }, // Always send auth object
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: this.reconnectDelay,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.setupEventListeners();
      console.log("[Socket] Connection initiated to", SOCKET_URL);
    } catch (error) {
      console.error("[Socket] Connection error:", error);
      this.isConnecting = false;
      throw error;
    }
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect(): void {
    if (this.socket) {
      console.log("[Socket] Disconnecting...");
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
      this.isConnecting = false;
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Setup connection event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("[Socket] Connected successfully");
      this.isConnecting = false;
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
      this.isConnecting = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message);
      this.isConnecting = false;
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("[Socket] Max reconnection attempts reached");
        this.disconnect();
      }
    });

    this.socket.on("error", (error) => {
      console.error("[Socket] Socket error:", error);
    });
  }

  // ============================================
  // TRADING ROUND EVENT LISTENERS
  // ============================================

  /**
   * Listen for new trading rounds being created
   * Backend emits: round:created with full round object
   */
  onRoundCreated(callback: (round: SocketRoundEvent) => void): void {
    this.socket?.on("round:created", (round: SocketRoundEvent) => {
      console.log("[Socket] Round created:", round.id, round.gameType);
      callback(round);
    });
  }

  /**
   * Listen for trading round updates (status changes)
   * Backend emits: round:updated with full round object
   */
  onRoundUpdated(callback: (round: SocketRoundEvent) => void): void {
    this.socket?.on("round:updated", (round: SocketRoundEvent) => {
      console.log("[Socket] Round updated:", round.id, round.status);
      callback(round);
    });
  }

  /**
   * Listen for round closing (betting period ends)
   * Backend emits: round:closed with full round object
   */
  onRoundClosed(callback: (round: SocketRoundEvent) => void): void {
    this.socket?.on("round:closed", (round: SocketRoundEvent) => {
      console.log("[Socket] Round closed:", round.id);
      callback(round);
    });
  }

  /**
   * Listen for round finalization (results announced)
   * Backend emits: round:finalized with full round object
   */
  onRoundFinalized(callback: (round: SocketRoundEvent) => void): void {
    this.socket?.on("round:finalized", (round: SocketRoundEvent) => {
      console.log(
        "[Socket] Round finalized:",
        round.id,
        "Winner:",
        round.winningOption
      );
      callback(round);
    });
  }

  /**
   * Listen for trade placed events (someone placed a bet)
   * Backend emits: order:placed with { order, round }
   */
  onTradePlaced(
    callback: (data: { order: any; round: SocketRoundEvent }) => void
  ): void {
    this.socket?.on("order:placed", (data) => {
      console.log("[Socket] Order placed:", data.order?.id);
      callback(data);
    });
  }

  /**
   * Listen for countdown tick events (timer updates)
   * Backend emits: round:timer with { roundId, timeLeft }
   */
  onCountdownTick(
    callback: (data: { roundId: string; timeLeft: number }) => void
  ): void {
    this.socket?.on("round:timer", (data) => {
      console.log("[Socket] Timer tick:", data.roundId, data.timeLeft);
      callback(data);
    });
  }

  // ============================================
  // ROOM MANAGEMENT
  // ============================================

  /**
   * Join a trading room to receive updates for specific game type
   * Backend expects: join:trading with { gameType }
   * @param gameType - 'color' or 'number'
   */
  joinTradingRoom(gameType: "color" | "number"): void {
    this.socket?.emit("join:trading", { gameType });
    console.log("[Socket] Joined trading room:", gameType);
  }

  /**
   * Leave a trading room
   * Note: Backend doesn't have explicit leave, disconnect handles it
   * @param gameType - 'color' or 'number'
   */
  leaveTradingRoom(gameType: "color" | "number"): void {
    // Backend doesn't have explicit leave:trading event
    // Socket.IO handles cleanup on disconnect
    console.log(
      "[Socket] Would leave trading room:",
      gameType,
      "(handled by disconnect)"
    );
  }

  /**
   * Join a specific round room for detailed updates
   * Backend expects: join:round with { roundId }
   * @param roundId - The round ID
   */
  joinRoundRoom(roundId: string): void {
    this.socket?.emit("join:round", { roundId });
    console.log("[Socket] Joined round room:", roundId);
  }

  /**
   * Leave a specific round room
   * @param roundId - The round ID
   */
  leaveRoundRoom(roundId: string): void {
    // Backend doesn't have explicit leave:round event
    console.log(
      "[Socket] Would leave round room:",
      roundId,
      "(handled by disconnect)"
    );
  }

  // ============================================
  // REMOVE EVENT LISTENERS
  // ============================================

  /**
   * Remove specific event listener
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  /**
   * Remove all listeners for trading events
   */
  removeAllTradingListeners(): void {
    const events = [
      "round:created",
      "round:updated",
      "round:closed",
      "round:finalized",
      "order:placed",
      "round:timer",
    ];

    events.forEach((event) => {
      this.socket?.off(event);
    });

    console.log("[Socket] Removed all trading event listeners");
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
export type { SocketRoundEvent };
