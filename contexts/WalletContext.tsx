import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import walletService, { Wallet, Transaction } from '../services/walletService';

interface WalletContextType {
  // Wallet state
  wallet: Wallet | null;
  balance: number;
  formattedBalance: string;
  walletId: string | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Wallet actions
  refreshWallet: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  deductFromWallet: (amount: number, description: string) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [formattedBalance, setFormattedBalance] = useState<string>('₹0.00');
  const [walletId, setWalletId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const isFetchingRef = useRef(false);

  /**
   * Fetch wallet data from API
   */
  const fetchWalletData = useCallback(async () => {
    // Prevent multiple simultaneous API calls
    if (isFetchingRef.current) {
      console.log('WalletContext: Wallet fetch already in progress, skipping...');
      return;
    }

    if (!isAuthenticated) {
      console.log('WalletContext: User not authenticated, skipping fetch');
      return;
    }

    console.log('WalletContext: Starting wallet API fetch...');
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const walletData = await walletService.getWallet();
      
      console.log('WalletContext: Wallet data fetched successfully');
      setWallet(walletData);
      setBalance(walletData.balance);
      setFormattedBalance(walletData.formattedBalance);
      setWalletId(walletData.walletId);
    } catch (error: any) {
      console.error('WalletContext: Error fetching wallet data:', error);
      setError(error.message || 'Failed to load wallet data');
      
      // Set default values on error
      setWallet(null);
      setBalance(0);
      setFormattedBalance('₹0.00');
      setWalletId(null);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [isAuthenticated]);

  /**
   * Fetch transactions separately
   */
  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const { data } = await walletService.getTransactions(1, 50);
      setTransactions(data);
    } catch (error: any) {
      console.error('WalletContext: Error fetching transactions:', error);
      // Don't set error for transactions, just log it
    }
  }, [isAuthenticated]);

  /**
   * Initialize wallet from API - ONLY ONCE per session
   */
  useEffect(() => {
    if (isAuthenticated && !hasInitialized) {
      console.log('WalletContext: Initializing wallet and fetching data...');
      fetchWalletData();
      fetchTransactions();
      setHasInitialized(true);
    } else if (!isAuthenticated) {
      // Reset wallet data when user logs out
      console.log('WalletContext: User logged out, resetting wallet data...');
      setWallet(null);
      setBalance(0);
      setFormattedBalance('₹0.00');
      setWalletId(null);
      setTransactions([]);
      setError(null);
      setHasInitialized(false);
    }
  }, [isAuthenticated, hasInitialized, fetchWalletData, fetchTransactions]);

  /**
   * Refresh wallet data (for pull-to-refresh)
   */
  const refreshWallet = useCallback(async () => {
    console.log('WalletContext: Manual wallet refresh triggered');
    await fetchWalletData();
  }, [fetchWalletData]);

  /**
   * Refresh transactions (separate from wallet balance)
   */
  const refreshTransactions = useCallback(async () => {
    console.log('WalletContext: Manual transactions refresh triggered');
    await fetchTransactions();
  }, [fetchTransactions]);

  /**
   * Deduct amount from wallet
   * Used for purchases (trades, plans, etc.)
   */
  const deductFromWallet = useCallback(async (
    amount: number, 
    description: string
  ): Promise<boolean> => {
    try {
      console.log(`WalletContext: Deducting ₹${amount} from wallet...`);
      await walletService.processPayment({ amount, description });
      
      // Refresh wallet to get updated balance
      await fetchWalletData();
      await fetchTransactions();
      
      console.log('WalletContext: Payment successful, wallet refreshed');
      return true;
    } catch (error: any) {
      console.error('WalletContext: Payment failed:', error);
      setError(error.message || 'Payment failed');
      return false;
    }
  }, [fetchWalletData, fetchTransactions]);

  const contextValue: WalletContextType = {
    wallet,
    balance,
    formattedBalance,
    walletId,
    transactions,
    isLoading,
    error,
    refreshWallet,
    refreshTransactions,
    deductFromWallet,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};