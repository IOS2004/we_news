import { useEffect, useState } from 'react';
import { RewardedAd, RewardedAdEventType, AdEventType } from 'react-native-google-mobile-ads';
import { AdConfig } from '../config/adConfig';

/**
 * Hook for managing Google AdMob Rewarded Ads
 * 
 * Rewarded ads allow users to watch an ad in exchange for in-app rewards.
 * Perfect for earning extra coins, points, or unlocking features.
 * 
 * Usage:
 * const { showAd, isLoaded, isLoading } = useRewardedAd({
 *   onUserEarnedReward: (reward) => console.log('Earned:', reward)
 * });
 * 
 * @param onUserEarnedReward - Callback when user earns reward
 * @param onAdClosed - Callback when ad is closed
 * @param adUnitId - Custom ad unit ID (optional)
 */
export const useRewardedAd = (options: {
  onUserEarnedReward?: (reward: { type: string; amount: number }) => void;
  onAdClosed?: () => void;
  onAdFailedToLoad?: (error: any) => void;
  adUnitId?: string;
}) => {
  const [rewardedAd, setRewardedAd] = useState<RewardedAd | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use provided ad unit ID or get from config
  const adId = options.adUnitId || AdConfig.getRewardedAdUnitId();

  useEffect(() => {
    const rewarded = RewardedAd.createForAdRequest(adId, {
      requestNonPersonalizedAdsOnly: false,
    });

    // Event listeners
    const loadedListener = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setIsLoaded(true);
      setIsLoading(false);
      console.log('Rewarded ad loaded');
    });

    const earnedRewardListener = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('User earned reward:', reward);
        options.onUserEarnedReward?.(reward);
      }
    );

    const closedListener = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      setIsLoaded(false);
      console.log('Rewarded ad closed');
      // Preload next ad
      rewarded.load();
      options.onAdClosed?.();
    });

    const errorListener = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
      setIsLoading(false);
      setIsLoaded(false);
      console.log('Rewarded ad failed to load:', error);
      options.onAdFailedToLoad?.(error);
    });

    setRewardedAd(rewarded);
    setIsLoading(true);
    rewarded.load();

    // Cleanup
    return () => {
      loadedListener();
      earnedRewardListener();
      closedListener();
      errorListener();
    };
  }, [adId]);

  const showAd = async () => {
    if (isLoaded && rewardedAd) {
      try {
        await rewardedAd.show();
      } catch (error) {
        console.log('Error showing rewarded ad:', error);
      }
    } else {
      console.log('Rewarded ad not ready yet');
    }
  };

  return {
    showAd,
    isLoaded,
    isLoading,
  };
};
