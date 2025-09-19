import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

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
  transactions: Transaction[];
  isLoading: boolean;
  
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize wallet from user data
  useEffect(() => {
    if (isAuthenticated && user) {
      setBalance(user.walletBalance || 0);
      // Load sample transactions for demo
      loadSampleTransactions();
    } else {
      setBalance(0);
      setTransactions([]);
    }
  }, [isAuthenticated, user]);

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
    setIsLoading(true);
    try {
      // In a real app, this would fetch from API
      // For now, just simulate a refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to refresh wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: WalletContextType = {
    balance,
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