import { useEffect, useCallback } from "react";
import socketService, { SocketRoundEvent } from "../services/socketService";
import { showToast } from "../utils/toast";

interface UseTradingSocketProps {
  gameType?: "color" | "number";
  onRoundCreated?: (round: SocketRoundEvent) => void;
  onRoundUpdated?: (round: SocketRoundEvent) => void;
  onRoundClosed?: (round: SocketRoundEvent) => void;
  onRoundFinalized?: (round: SocketRoundEvent) => void;
  enabled?: boolean;
}

/**
 * Hook to manage trading socket connections and events
 * Matches web frontend implementation
 */
export const useTradingSocket = ({
  gameType,
  onRoundCreated,
  onRoundUpdated,
  onRoundClosed,
  onRoundFinalized,
  enabled = true,
}: UseTradingSocketProps) => {
  // Handle round finalized (result declared)
  const handleRoundFinalized = useCallback(
    (round: SocketRoundEvent) => {
      console.log("[useTradingSocket] Round finalized received:", round);

      const winningOption = round.winningOption || "Unknown";
      const multiplier = round.winningOption
        ? round.multipliers?.[round.winningOption]
        : "?";

      // Show toast notification
      showToast.success({
        title: `Result Declared! 🎉`,
        message: `Round ${round.roundNumber}\nWinner: ${winningOption} (${multiplier}x)`,
      });

      // Call custom handler if provided
      if (onRoundFinalized) {
        onRoundFinalized(round);
      }
    },
    [onRoundFinalized]
  );

  // Handle round closed (trading ended)
  const handleRoundClosed = useCallback(
    (round: SocketRoundEvent) => {
      console.log("[useTradingSocket] Round closed received:", round);

      showToast.info({
        title: "Trading Closed!",
        message: "Waiting for result...",
      });

      if (onRoundClosed) {
        onRoundClosed(round);
      }
    },
    [onRoundClosed]
  );

  // Handle round created
  const handleRoundCreated = useCallback(
    (round: SocketRoundEvent) => {
      console.log("[useTradingSocket] Round created received:", round);

      if (onRoundCreated) {
        onRoundCreated(round);
      }
    },
    [onRoundCreated]
  );

  // Handle round updated
  const handleRoundUpdated = useCallback(
    (round: SocketRoundEvent) => {
      console.log("[useTradingSocket] Round updated received:", round);

      if (onRoundUpdated) {
        onRoundUpdated(round);
      }
    },
    [onRoundUpdated]
  );

  useEffect(() => {
    if (!enabled) return;

    const initSocket = async () => {
      try {
        // Connect socket
        await socketService.connect();
        console.log("[useTradingSocket] Socket connected");

        // Join trading room if gameType is specified
        if (gameType) {
          socketService.joinTradingRoom(gameType);
        }

        // Setup event listeners
        socketService.onRoundCreated(handleRoundCreated);
        socketService.onRoundUpdated(handleRoundUpdated);
        socketService.onRoundClosed(handleRoundClosed);
        socketService.onRoundFinalized(handleRoundFinalized);
      } catch (error) {
        console.error("[useTradingSocket] Socket connection error:", error);
      }
    };

    initSocket();

    // Cleanup on unmount
    return () => {
      if (gameType) {
        socketService.leaveTradingRoom(gameType);
      }
      socketService.removeAllTradingListeners();
    };
  }, [
    enabled,
    gameType,
    handleRoundCreated,
    handleRoundUpdated,
    handleRoundClosed,
    handleRoundFinalized,
  ]);

  return {
    // You can add additional return values here if needed
    isConnected: socketService.isConnected(),
  };
};

export default useTradingSocket;
