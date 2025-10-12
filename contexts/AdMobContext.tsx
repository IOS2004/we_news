import React, { createContext, useContext, useEffect, useState } from 'react';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

interface AdMobContextType {
  isInitialized: boolean;
  isTestMode: boolean;
  setTestMode: (testMode: boolean) => void;
}

const AdMobContext = createContext<AdMobContextType>({
  isInitialized: false,
  isTestMode: true,
  setTestMode: () => {},
});

export const useAdMob = () => useContext(AdMobContext);

interface AdMobProviderProps {
  children: React.ReactNode;
}

/**
 * AdMob Provider Component
 * 
 * Initializes Google Mobile Ads SDK and provides ad configuration context.
 * Wrap your app with this provider to enable AdMob functionality.
 * 
 * Features:
 * - Automatic SDK initialization
 * - Test mode toggle (default: enabled for safety)
 * - Consent management ready
 * 
 * Usage:
 * <AdMobProvider>
 *   <App />
 * </AdMobProvider>
 */
export const AdMobProvider: React.FC<AdMobProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTestMode, setTestMode] = useState(true); // Default to test mode for safety

  useEffect(() => {
    initializeAdMob();
  }, []);

  const initializeAdMob = async () => {
    try {
      // Initialize Google Mobile Ads SDK
      await mobileAds().initialize();
      
      // Set request configuration
      await mobileAds().setRequestConfiguration({
        // Maximum Ad Content rating
        maxAdContentRating: MaxAdContentRating.PG,
        // Indicate that you want test ads (set to empty array in production)
        testDeviceIdentifiers: isTestMode ? ['EMULATOR'] : [],
        // Indicate that you want the same content rating for all ad requests
        tagForChildDirectedTreatment: false,
        // Indicate whether you want to treat your users as under age of consent
        tagForUnderAgeOfConsent: false,
      });

      setIsInitialized(true);
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  };

  return (
    <AdMobContext.Provider
      value={{
        isInitialized,
        isTestMode,
        setTestMode,
      }}
    >
      {children}
    </AdMobContext.Provider>
  );
};
