import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { tradingApi } from '../services/tradingApi';
import { TradingRound } from '../types/trading';
import { showToast } from '../utils/toast';

interface TradingContextType {
  // Color rounds
  colorActiveRounds: TradingRound[];
  colorUpcomingRounds: TradingRound[];
  selectedColorRoundId: string | null;
  setSelectedColorRoundId: (id: string | null) => void;
  
  // Number rounds
  numberActiveRounds: TradingRound[];
  numberUpcomingRounds: TradingRound[];
  selectedNumberRoundId: string | null;
  setSelectedNumberRoundId: (id: string | null) => void;
  
  // Loading states
  isLoadingColorRounds: boolean;
  isLoadingNumberRounds: boolean;
  
  // Fetch functions
  fetchColorRounds: (forceRefresh?: boolean) => Promise<void>;
  fetchNumberRounds: (forceRefresh?: boolean) => Promise<void>;
  refreshAllRounds: () => Promise<void>;
  
  // Last fetch timestamps
  lastColorFetch: number | null;
  lastNumberFetch: number | null;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

// Cache duration: 30 seconds
const CACHE_DURATION = 30 * 1000;

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Color rounds state
  const [colorActiveRounds, setColorActiveRounds] = useState<TradingRound[]>([]);
  const [colorUpcomingRounds, setColorUpcomingRounds] = useState<TradingRound[]>([]);
  const [selectedColorRoundId, setSelectedColorRoundId] = useState<string | null>(null);
  const [isLoadingColorRounds, setIsLoadingColorRounds] = useState(false);
  const [lastColorFetch, setLastColorFetch] = useState<number | null>(null);

  // Number rounds state
  const [numberActiveRounds, setNumberActiveRounds] = useState<TradingRound[]>([]);
  const [numberUpcomingRounds, setNumberUpcomingRounds] = useState<TradingRound[]>([]);
  const [selectedNumberRoundId, setSelectedNumberRoundId] = useState<string | null>(null);
  const [isLoadingNumberRounds, setIsLoadingNumberRounds] = useState(false);
  const [lastNumberFetch, setLastNumberFetch] = useState<number | null>(null);

  // Fetch color rounds with cache check
  const fetchColorRounds = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Check if we have cached data and it's still fresh
    if (!forceRefresh && lastColorFetch && (now - lastColorFetch) < CACHE_DURATION) {
      console.log('[TradingContext] Using cached color rounds data');
      return;
    }

    setIsLoadingColorRounds(true);
    try {
      // Fetch both upcoming and open rounds
      const [upcoming, active] = await Promise.all([
        tradingApi.listRounds({ gameType: 'color', status: 'upcoming', limit: 10 }),
        tradingApi.listRounds({ gameType: 'color', status: 'open', limit: 10 })
      ]);
      
      setColorUpcomingRounds(upcoming);
      setColorActiveRounds(active);
      setLastColorFetch(now);
      
      // Auto-select first active round if none selected and there are active rounds
      if (!selectedColorRoundId && active.length > 0) {
        setSelectedColorRoundId(active[0].id);
      }

      console.log('[TradingContext] Fetched color rounds:', { upcoming: upcoming.length, active: active.length });
    } catch (error) {
      console.error('[TradingContext] Failed to fetch color rounds:', error);
      showToast.error({
        title: 'Error',
        message: 'Failed to load color rounds'
      });
    } finally {
      setIsLoadingColorRounds(false);
    }
  }, [lastColorFetch, selectedColorRoundId]);

  // Fetch number rounds with cache check
  const fetchNumberRounds = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Check if we have cached data and it's still fresh
    if (!forceRefresh && lastNumberFetch && (now - lastNumberFetch) < CACHE_DURATION) {
      console.log('[TradingContext] Using cached number rounds data');
      return;
    }

    setIsLoadingNumberRounds(true);
    try {
      // Fetch both upcoming and open rounds
      const [upcoming, active] = await Promise.all([
        tradingApi.listRounds({ gameType: 'number', status: 'upcoming', limit: 10 }),
        tradingApi.listRounds({ gameType: 'number', status: 'open', limit: 10 })
      ]);
      
      setNumberUpcomingRounds(upcoming);
      setNumberActiveRounds(active);
      setLastNumberFetch(now);
      
      // Auto-select first active round if none selected and there are active rounds
      if (!selectedNumberRoundId && active.length > 0) {
        setSelectedNumberRoundId(active[0].id);
      }

      console.log('[TradingContext] Fetched number rounds:', { upcoming: upcoming.length, active: active.length });
    } catch (error) {
      console.error('[TradingContext] Failed to fetch number rounds:', error);
      showToast.error({
        title: 'Error',
        message: 'Failed to load number rounds'
      });
    } finally {
      setIsLoadingNumberRounds(false);
    }
  }, [lastNumberFetch, selectedNumberRoundId]);

  // Refresh all rounds
  const refreshAllRounds = useCallback(async () => {
    await Promise.all([
      fetchColorRounds(true),
      fetchNumberRounds(true)
    ]);
  }, [fetchColorRounds, fetchNumberRounds]);

  const value: TradingContextType = {
    colorActiveRounds,
    colorUpcomingRounds,
    selectedColorRoundId,
    setSelectedColorRoundId,
    
    numberActiveRounds,
    numberUpcomingRounds,
    selectedNumberRoundId,
    setSelectedNumberRoundId,
    
    isLoadingColorRounds,
    isLoadingNumberRounds,
    
    fetchColorRounds,
    fetchNumberRounds,
    refreshAllRounds,
    
    lastColorFetch,
    lastNumberFetch,
  };

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
