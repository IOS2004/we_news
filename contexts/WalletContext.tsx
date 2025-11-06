import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useAuth } from './AuthContext';
import walletApi, { WalletTransaction as APITransaction } from '../services/walletApi';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  timestamp: number;
  category: 'trading' | 'earnings' | 'withdrawal' | 'deposit' | 'bonus';
  status: 'completed' | 'pending' | 'failed';
}

interface WalletContextType {
  // Wallet state
  balance: number;
  formattedBalance: string;
  walletId: string | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Wallet actions
  updateBalance: (amount: number, type: 'credit' | 'debit', description: string, category?: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [formattedBalance, setFormattedBalance] = useState<string>('₹0.00');
  const [walletId, setWalletId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const isFetchingRef = useRef(false);

  // Initialize wallet from API - ONLY ONCE per session
  useEffect(() => {
    if (isAuthenticated && !hasInitialized) {
      console.log('WalletContext: Initializing wallet and fetching data...');
      fetchWalletData();
      setHasInitialized(true);
    } else if (!isAuthenticated) {
      // Reset wallet data when user logs out
      console.log('WalletContext: User logged out, resetting wallet data...');
      setBalance(0);
      setFormattedBalance('₹0.00');
      setWalletId(null);
      setTransactions([]);
      setError(null);
      setHasInitialized(false);
    } else if (isAuthenticated && hasInitialized) {
      console.log('WalletContext: Already initialized, skipping API call');
    }
  }, [isAuthenticated]);

  /**
   * Convert API transaction to local transaction format
   */
  const convertAPITransaction = (apiTx: APITransaction): Transaction => {
    const date = new Date(apiTx.createdAt._seconds * 1000);
    
    // Determine category based on description
    let category: Transaction['category'] = 'earnings';
    const desc = apiTx.description.toLowerCase();
    
    if (desc.includes('trading') || desc.includes('bet') || desc.includes('game')) {
      category = 'trading';
    } else if (desc.includes('withdrawal') || desc.includes('withdraw')) {
      category = 'withdrawal';
    } else if (desc.includes('topup') || desc.includes('deposit') || desc.includes('add money')) {
      category = 'deposit';
    } else if (desc.includes('bonus') || desc.includes('reward')) {
      category = 'bonus';
    }

    return {
      id: apiTx.id,
      type: apiTx.transactionType,
      amount: apiTx.amount,
      description: apiTx.description,
      date: date.toISOString().split('T')[0],
      timestamp: apiTx.createdAt._seconds * 1000,
      category,
      status: apiTx.status,
    };
  };

  /**
   * Fetch wallet data from API
   */
  const fetchWalletData = async () => {
    // Prevent multiple simultaneous API calls
    if (isFetchingRef.current) {
      console.log('WalletContext: Wallet fetch already in progress, skipping...');
      return;
    }

    console.log('WalletContext: Starting wallet API fetch...');
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await walletApi.getWalletDetails();
      
      if (response.success && response.data) {
        console.log('WalletContext: Wallet data fetched successfully');
        setBalance(response.data.balance);
        setFormattedBalance(response.data.formattedBalance);
        setWalletId(response.data.walletId);
        
        // Convert API transactions to local format
        const convertedTransactions = response.data.transactions.map(convertAPITransaction);
        setTransactions(convertedTransactions);
      } else {
        throw new Error(response.message || 'Failed to fetch wallet data');
      }
    } catch (error: any) {
      console.error('WalletContext: Error fetching wallet data:', error);
      setError(error.message || 'Failed to load wallet data');
      
      // Set default values on error
      setBalance(0);
      setFormattedBalance('₹0.00');
      setTransactions([]);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  const updateBalance = (amount: number, type: 'credit' | 'debit', description: string, category: string = 'trading') => {
    setBalance(prevBalance => {
      const newBalance = type === 'credit' ? prevBalance + amount : prevBalance - amount;
      
      // Add transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type,
        amount,
        description,
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        category: category as any,
        status: 'completed',
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      return Math.max(0, newBalance); // Ensure balance doesn't go negative
    });
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  /**
   * Refresh wallet data (for pull-to-refresh)
   */
  const refreshWallet = async () => {
    console.log('WalletContext: Manual refresh triggered');
    await fetchWalletData();
  };

  const contextValue: WalletContextType = {
    balance,
    formattedBalance,
    walletId,
    transactions,
    isLoading,
    error,
    updateBalance,
    addTransaction,
    refreshWallet,
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