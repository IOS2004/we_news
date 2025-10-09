import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { walletAPI, WalletData, WalletTransaction as APITransaction } from '../services/api';

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
  transactions: Transaction[];
  isLoading: boolean;
  walletId: string | null;
  
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
  const [hasInitialized, setHasInitialized] = useState(false);
  const isFetchingRef = useRef(false);

  // Initialize wallet from user data or fetch from API - ONLY ONCE
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
      setHasInitialized(false);
    } else if (isAuthenticated && hasInitialized) {
      console.log('WalletContext: Already initialized, skipping API call');
    }
  }, [isAuthenticated]);

  // Convert API transaction to local transaction format
  const convertAPITransaction = (apiTx: APITransaction): Transaction => {
    const date = new Date(apiTx.createdAt._seconds * 1000);
    return {
      id: apiTx.id,
      type: apiTx.transactionType,
      amount: apiTx.amount,
      description: apiTx.description,
      date: date.toISOString().split('T')[0],
      timestamp: apiTx.createdAt._seconds * 1000,
      category: apiTx.transactionType === 'credit' ? 'deposit' : 'withdrawal',
      status: apiTx.status,
    };
  };

  // Fetch wallet data from API
  const fetchWalletData = async () => {
    // Prevent multiple simultaneous API calls
    if (isFetchingRef.current) {
      console.log('WalletContext: Wallet fetch already in progress, skipping...');
      return;
    }

    console.log('WalletContext: Starting wallet API fetch...');
    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const response = await walletAPI.getWalletDetails();
      if (response.success && response.data) {
        console.log('WalletContext: Wallet data fetched successfully');
        setBalance(response.data.balance);
        setFormattedBalance(response.data.formattedBalance);
        setWalletId(response.data.walletId);
        
        // Convert API transactions to local format
        const convertedTransactions = response.data.transactions.map(convertAPITransaction);
        setTransactions(convertedTransactions);
      }
    } catch (error) {
      console.error('WalletContext: Failed to fetch wallet data:', error);
      // Fallback to sample data if API fails
      loadSampleTransactions();
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
      console.log('WalletContext: Wallet fetch completed');
    }
  };

  const loadSampleTransactions = () => {
    const sampleTransactions: Transaction[] = [
      {
        id: '1',
        type: 'credit',
        amount: 250,
        description: 'Daily bonus reward',
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now() - 86400000,
        category: 'bonus',
        status: 'completed',
      },
      {
        id: '2',
        type: 'credit',
        amount: 100,
        description: 'News reading reward',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        timestamp: Date.now() - 172800000,
        category: 'earnings',
        status: 'completed',
      },
      {
        id: '3',
        type: 'debit',
        amount: 50,
        description: 'Color trading bet',
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        timestamp: Date.now() - 259200000,
        category: 'trading',
        status: 'completed',
      },
    ];
    setTransactions(sampleTransactions);
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

  const refreshWallet = async () => {
    await fetchWalletData();
  };

  const contextValue: WalletContextType = {
    balance,
    formattedBalance,
    walletId,
    transactions,
    isLoading,
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