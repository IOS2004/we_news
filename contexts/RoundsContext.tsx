import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { tradingApi } from '../services/tradingApi';

// ============================================
// TYPES & INTERFACES
// ============================================

interface Round {
  id: string;
  roundId?: string;
  roundNumber: number;
  gameType: 'color' | 'number';
  roundType?: 'colour' | 'number';
  status: 'upcoming' | 'active' | 'open' | 'closed' | 'settled' | 'cancelled' | 'completed';
  startTime?: any;
  resultDeclarationTime?: any;
  totalTrades?: number;
  winningColor?: string;
  winningNumber?: number;
  [key: string]: any;
}

interface RoundsContextType {
  // Color rounds
  colorActiveRounds: Round[];
  colorUpcomingRounds: Round[];
  selectedColorRoundId: string | null;
  setSelectedColorRoundId: (id: string | null) => void;
  
  // Number rounds
  numberActiveRounds: Round[];
  numberUpcomingRounds: Round[];
  selectedNumberRoundId: string | null;
  setSelectedNumberRoundId: (id: string | null) => void;
  
  // Loading states
  isLoadingColorRounds: boolean;
  isLoadingNumberRounds: boolean;
  
  // Error states
  colorRoundsError: string | null;
  numberRoundsError: string | null;
  
  // Fetch functions
  fetchColorRounds: (forceRefresh?: boolean) => Promise<void>;
  fetchNumberRounds: (forceRefresh?: boolean) => Promise<void>;
  refreshAllRounds: () => Promise<void>;
  
  // Last fetch timestamps
  lastColorFetch: number | null;
  lastNumberFetch: number | null;
}

const RoundsContext = createContext<RoundsContextType | undefined>(undefined);

// Cache duration: 30 seconds
const CACHE_DURATION = 30 * 1000;

// ============================================
// ROUNDS PROVIDER
// ============================================

export const RoundsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Color rounds state
  const [colorActiveRounds, setColorActiveRounds] = useState<Round[]>([]);
  const [colorUpcomingRounds, setColorUpcomingRounds] = useState<Round[]>([]);
  const [selectedColorRoundId, setSelectedColorRoundId] = useState<string | null>(null);
  const [isLoadingColorRounds, setIsLoadingColorRounds] = useState(false);
  const [colorRoundsError, setColorRoundsError] = useState<string | null>(null);
  const [lastColorFetch, setLastColorFetch] = useState<number | null>(null);

  // Number rounds state
  const [numberActiveRounds, setNumberActiveRounds] = useState<Round[]>([]);
  const [numberUpcomingRounds, setNumberUpcomingRounds] = useState<Round[]>([]);
  const [selectedNumberRoundId, setSelectedNumberRoundId] = useState<string | null>(null);
  const [isLoadingNumberRounds, setIsLoadingNumberRounds] = useState(false);
  const [numberRoundsError, setNumberRoundsError] = useState<string | null>(null);
  const [lastNumberFetch, setLastNumberFetch] = useState<number | null>(null);

  /**
   * Fetch color rounds with cache check
   */
  const fetchColorRounds = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Check if we have cached data and it's still fresh
    if (!forceRefresh && lastColorFetch && (now - lastColorFetch) < CACHE_DURATION) {
      console.log('RoundsContext: Using cached color rounds data');
      return;
    }

    console.log('RoundsContext: Fetching color rounds...');
    setIsLoadingColorRounds(true);
    setColorRoundsError(null);
    
    try {
      const [upcomingResponse, activeResponse] = await Promise.all([
        tradingApi.getUpcomingRounds('colour', 10),
        tradingApi.getActiveRounds('colour')
      ]);
      
      const upcoming = upcomingResponse.success ? upcomingResponse.data || [] : [];
      const active = activeResponse.success ? activeResponse.data || [] : [];
      
      // Add gameType to rounds
      const upcomingWithType = upcoming.map((r: any) => ({ ...r, gameType: 'color' as const }));
      const activeWithType = active.map((r: any) => ({ ...r, gameType: 'color' as const }));
      
      setColorUpcomingRounds(upcomingWithType);
      setColorActiveRounds(activeWithType);
      setLastColorFetch(now);
      
      // Auto-select first active round if none selected and there are active rounds
      if (!selectedColorRoundId && active.length > 0) {
        setSelectedColorRoundId(active[0].id);
        console.log('RoundsContext: Auto-selected first color round:', active[0].id);
      }
      
      console.log('RoundsContext: Color rounds fetched successfully');
    } catch (error: any) {
      console.error('RoundsContext: Failed to fetch color rounds:', error);
      setColorRoundsError(error.message || 'Failed to load color rounds');
    } finally {
      setIsLoadingColorRounds(false);
    }
  }, [lastColorFetch, selectedColorRoundId]);

  /**
   * Fetch number rounds with cache check
   */
  const fetchNumberRounds = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Check if we have cached data and it's still fresh
    if (!forceRefresh && lastNumberFetch && (now - lastNumberFetch) < CACHE_DURATION) {
      console.log('RoundsContext: Using cached number rounds data');
      return;
    }

    console.log('RoundsContext: Fetching number rounds...');
    setIsLoadingNumberRounds(true);
    setNumberRoundsError(null);
    
    try {
      const [upcomingResponse, activeResponse] = await Promise.all([
        tradingApi.getUpcomingRounds('number', 10),
        tradingApi.getActiveRounds('number')
      ]);
      
      const upcoming = upcomingResponse.success ? upcomingResponse.data || [] : [];
      const active = activeResponse.success ? activeResponse.data || [] : [];
      
      // Add gameType to rounds
      const upcomingWithType = upcoming.map((r: any) => ({ ...r, gameType: 'number' as const }));
      const activeWithType = active.map((r: any) => ({ ...r, gameType: 'number' as const }));
      
      setNumberUpcomingRounds(upcomingWithType);
      setNumberActiveRounds(activeWithType);
      setLastNumberFetch(now);
      
      // Auto-select first active round if none selected and there are active rounds
      if (!selectedNumberRoundId && active.length > 0) {
        setSelectedNumberRoundId(active[0].id);
        console.log('RoundsContext: Auto-selected first number round:', active[0].id);
      }
      
      console.log('RoundsContext: Number rounds fetched successfully');
    } catch (error: any) {
      console.error('RoundsContext: Failed to fetch number rounds:', error);
      setNumberRoundsError(error.message || 'Failed to load number rounds');
    } finally {
      setIsLoadingNumberRounds(false);
    }
  }, [lastNumberFetch, selectedNumberRoundId]);

  /**
   * Refresh all rounds (both color and number)
   */
  const refreshAllRounds = useCallback(async () => {
    console.log('RoundsContext: Refreshing all rounds...');
    await Promise.all([
      fetchColorRounds(true),
      fetchNumberRounds(true)
    ]);
  }, [fetchColorRounds, fetchNumberRounds]);

  const contextValue: RoundsContextType = {
    // Color rounds
    colorActiveRounds,
    colorUpcomingRounds,
    selectedColorRoundId,
    setSelectedColorRoundId,
    
    // Number rounds
    numberActiveRounds,
    numberUpcomingRounds,
    selectedNumberRoundId,
    setSelectedNumberRoundId,
    
    // Loading states
    isLoadingColorRounds,
    isLoadingNumberRounds,
    
    // Error states
    colorRoundsError,
    numberRoundsError,
    
    // Fetch functions
    fetchColorRounds,
    fetchNumberRounds,
    refreshAllRounds,
    
    // Last fetch timestamps
    lastColorFetch,
    lastNumberFetch,
  };

  return (
    <RoundsContext.Provider value={contextValue}>
      {children}
    </RoundsContext.Provider>
  );
};

/**
 * Hook to use rounds context
 */
export const useRounds = (): RoundsContextType => {
  const context = useContext(RoundsContext);
  if (context === undefined) {
    throw new Error('useRounds must be used within a RoundsProvider');
  }
  return context;
};
