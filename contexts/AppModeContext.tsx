import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';

export type AppMode = 'home' | 'news' | 'trades';

interface AppModeContextType {
  currentMode: AppMode;
  availableModes: AppMode[];
  switchToNextMode: () => void;
  switchToMode: (mode: AppMode) => void;
  addMode: (mode: AppMode) => void;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

interface AppModeProviderProps {
  children: React.ReactNode;
  initialMode?: AppMode;
}

export const AppModeProvider: React.FC<AppModeProviderProps> = ({ 
  children, 
  initialMode = 'home' 
}) => {
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState<AppMode>(initialMode);
  const [availableModes, setAvailableModes] = useState<AppMode[]>(['home', 'news', 'trades']);

  const getRouteForMode = (mode: AppMode): string => {
    switch (mode) {
      case 'home':
        return '/(tabs)/(home)/dashboard';
      case 'news':
        return '/(tabs)/(news)';
      case 'trades':
        return '/(tabs)/(trades)';
      default:
        return '/(tabs)/(home)/dashboard';
    }
  };

  const switchToMode = useCallback((mode: AppMode) => {
    if (availableModes.includes(mode)) {
      setCurrentMode(mode);
      const route = getRouteForMode(mode);
      router.replace(route);
    }
  }, [availableModes, router]);

  const switchToNextMode = useCallback(() => {
    const currentIndex = availableModes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % availableModes.length;
    const nextMode = availableModes[nextIndex];
    switchToMode(nextMode);
  }, [currentMode, availableModes, switchToMode]);

  const addMode = useCallback((mode: AppMode) => {
    if (!availableModes.includes(mode)) {
      setAvailableModes(prev => [...prev, mode]);
    }
  }, [availableModes]);

  const value: AppModeContextType = {
    currentMode,
    availableModes,
    switchToNextMode,
    switchToMode,
    addMode,
  };

  return (
    <AppModeContext.Provider value={value}>
      {children}
    </AppModeContext.Provider>
  );
};

export const useAppMode = (): AppModeContextType => {
  const context = useContext(AppModeContext);
  if (context === undefined) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
};

export default AppModeContext;