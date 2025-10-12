import { useEffect, useState } from 'react';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AdConfig } from '../config/adConfig';

/**
 * Hook for managing Google AdMob Interstitial Ads
 * 
 * Interstitial ads are full-screen ads that appear at natural breaks in your app.
 * They should be shown at appropriate transition points (e.g., between articles, after actions).
 * 
 * Usage:
 * const { showAd, isLoaded, isLoading } = useInterstitialAd();
 * 
 * @param adUnitId - Custom ad unit ID (optional)
 * @param onAdClosed - Callback when ad is closed
 * @param onAdFailedToLoad - Callback when ad fails to load
 */
export const useInterstitialAd = (
  adUnitId?: string,
  onAdClosed?: () => void,
  onAdFailedToLoad?: (error: any) => void
) => {
  const [interstitialAd, setInterstitialAd] = useState<InterstitialAd | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use provided ad unit ID or get from config
  const adId = adUnitId || AdConfig.getInterstitialAdUnitId();

  useEffect(() => {
    const interstitial = InterstitialAd.createForAdRequest(adId, {
      requestNonPersonalizedAdsOnly: false,
    });

    // Event listeners
    const loadedListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setIsLoaded(true);
      setIsLoading(false);
      console.log('Interstitial ad loaded');
    });

    const closedListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setIsLoaded(false);
      console.log('Interstitial ad closed');
      // Preload next ad
      interstitial.load();
      onAdClosed?.();
    });

    const errorListener = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      setIsLoading(false);
      setIsLoaded(false);
      console.log('Interstitial ad failed to load:', error);
      onAdFailedToLoad?.(error);
    });

    setInterstitialAd(interstitial);
    setIsLoading(true);
    interstitial.load();

    // Cleanup
    return () => {
      loadedListener();
      closedListener();
      errorListener();
    };
  }, [adId]);

  const showAd = async () => {
    if (isLoaded && interstitialAd) {
      try {
        await interstitialAd.show();
      } catch (error) {
        console.log('Error showing interstitial ad:', error);
      }
    } else {
      console.log('Interstitial ad not ready yet');
    }
  };

  return {
    showAd,
    isLoaded,
    isLoading,
  };
};
