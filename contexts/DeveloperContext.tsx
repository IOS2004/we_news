import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DeveloperSettings {
  // Tier subscriptions
  bronzeTier: boolean;
  silverTier: boolean;
  goldTier: boolean;
  platinumTier: boolean;
  
  // Feature flags
  betaFeatures: boolean;
  debugMode: boolean;
  mockApiData: boolean;
  showPerformanceMetrics: boolean;
  
  // Earnings simulation
  simulateHighEarnings: boolean;
  simulateLowEarnings: boolean;
  showTestTransactions: boolean;
  
  // UI Testing
  showPlaceholderContent: boolean;
  enableAnimations: boolean;
  showComponentBorders: boolean;
}

interface DeveloperContextType {
  settings: DeveloperSettings;
  updateSetting: (key: keyof DeveloperSettings, value: boolean) => void;
  getActiveTiers: () => ('bronze' | 'silver' | 'gold' | 'platinum')[];
  getActiveTier: () => 'bronze' | 'silver' | 'gold' | 'platinum' | null;
  resetSettings: () => void;
}

const defaultSettings: DeveloperSettings = {
  // Default to multiple tiers for testing
  bronzeTier: true,
  silverTier: true,
  goldTier: false,
  platinumTier: false,
  
  betaFeatures: false,
  debugMode: false,
  mockApiData: true,
  showPerformanceMetrics: false,
  
  simulateHighEarnings: false,
  simulateLowEarnings: false,
  showTestTransactions: false,
  
  showPlaceholderContent: false,
  enableAnimations: true,
  showComponentBorders: false,
};

const DeveloperContext = createContext<DeveloperContextType | undefined>(undefined);

export const useDeveloperSettings = () => {
  const context = useContext(DeveloperContext);
  if (!context) {
    throw new Error('useDeveloperSettings must be used within a DeveloperProvider');
  }
  return context;
};

interface DeveloperProviderProps {
  children: ReactNode;
}

export const DeveloperProvider: React.FC<DeveloperProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<DeveloperSettings>(defaultSettings);

  const updateSetting = (key: keyof DeveloperSettings, value: boolean) => {
    // Allow multiple tiers to be active simultaneously
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const getActiveTiers = (): ('bronze' | 'silver' | 'gold' | 'platinum')[] => {
    const tiers: ('bronze' | 'silver' | 'gold' | 'platinum')[] = [];
    if (settings.bronzeTier) tiers.push('bronze');
    if (settings.silverTier) tiers.push('silver');
    if (settings.goldTier) tiers.push('gold');
    if (settings.platinumTier) tiers.push('platinum');
    return tiers;
  };

  const getActiveTier = (): 'bronze' | 'silver' | 'gold' | 'platinum' | null => {
    // Return the highest tier for backward compatibility
    if (settings.platinumTier) return 'platinum';
    if (settings.goldTier) return 'gold';
    if (settings.silverTier) return 'silver';
    if (settings.bronzeTier) return 'bronze';
    return null;
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const value: DeveloperContextType = {
    settings,
    updateSetting,
    getActiveTiers,
    getActiveTier,
    resetSettings,
  };

  return (
    <DeveloperContext.Provider value={value}>
      {children}
    </DeveloperContext.Provider>
  );
};

// Helper hook to get user subscriptions based on developer settings
export const useUserSubscriptions = () => {
  const { getActiveTiers } = useDeveloperSettings();
  const activeTiers = getActiveTiers();
  
  // Return array of subscribed tiers (in a real app, this would come from API)
  return activeTiers;
};
