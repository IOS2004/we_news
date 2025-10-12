import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

/**
 * AdMob Configuration
 * 
 * This file contains all ad unit IDs for the app.
 * 
 * IMPORTANT: 
 * - Currently using TEST ad unit IDs (safe for development)
 * - Before publishing to production, replace with your real AdMob ad unit IDs
 * - Get your ad unit IDs from: https://admob.google.com/
 * 
 * How to get production ad unit IDs:
 * 1. Go to https://admob.google.com/
 * 2. Create an app (if not already created)
 * 3. Create ad units for each type (Banner, Interstitial, Rewarded)
 * 4. Copy the ad unit IDs and replace below
 * 5. Set useTestAds to false
 */

// Toggle between test and production ads
// Set to false when you have production ad unit IDs
export const USE_TEST_ADS = __DEV__; // Automatically uses test ads in development

// Production Ad Unit IDs
// Replace these with your actual AdMob ad unit IDs
const PRODUCTION_AD_UNITS = {
  banner: {
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Replace with your Android Banner Ad Unit ID
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',     // Replace with your iOS Banner Ad Unit ID
  },
  interstitial: {
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Replace with your Android Interstitial Ad Unit ID
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',     // Replace with your iOS Interstitial Ad Unit ID
  },
  rewarded: {
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Replace with your Android Rewarded Ad Unit ID
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',     // Replace with your iOS Rewarded Ad Unit ID
  },
};

/**
 * Get the appropriate ad unit ID based on platform and test mode
 */
export const AdConfig = {
  useTestAds: USE_TEST_ADS,
  
  /**
   * Get Banner Ad Unit ID
   */
  getBannerAdUnitId(): string {
    if (USE_TEST_ADS) {
      return TestIds.BANNER;
    }
    return Platform.OS === 'ios' 
      ? PRODUCTION_AD_UNITS.banner.ios 
      : PRODUCTION_AD_UNITS.banner.android;
  },
  
  /**
   * Get Interstitial Ad Unit ID
   */
  getInterstitialAdUnitId(): string {
    if (USE_TEST_ADS) {
      return TestIds.INTERSTITIAL;
    }
    return Platform.OS === 'ios' 
      ? PRODUCTION_AD_UNITS.interstitial.ios 
      : PRODUCTION_AD_UNITS.interstitial.android;
  },
  
  /**
   * Get Rewarded Ad Unit ID
   */
  getRewardedAdUnitId(): string {
    if (USE_TEST_ADS) {
      return TestIds.REWARDED;
    }
    return Platform.OS === 'ios' 
      ? PRODUCTION_AD_UNITS.rewarded.ios 
      : PRODUCTION_AD_UNITS.rewarded.android;
  },
};

/**
 * Ad Frequency Configuration
 * Adjust these values to control how often ads are shown
 */
export const AdFrequency = {
  // Show banner ad after every N articles in feed
  BANNER_AFTER_ARTICLES: 5,
  
  // Show interstitial ad after every N article views
  INTERSTITIAL_AFTER_ARTICLES: 3,
  
  // Minimum delay (seconds) before showing interstitial ad
  INTERSTITIAL_DELAY_SECONDS: 2,
};

/**
 * Ad Size Configuration
 * Available sizes from BannerAdSize:
 * - BANNER: 320x50
 * - LARGE_BANNER: 320x100
 * - MEDIUM_RECTANGLE: 300x250
 * - FULL_BANNER: 468x60
 * - LEADERBOARD: 728x90
 */
export const AdSizes = {
  NEWS_FEED: 'MEDIUM_RECTANGLE',      // 300x250 - Good for feed
  ARTICLE_DETAIL: 'MEDIUM_RECTANGLE', // 300x250 - Good for content
  DASHBOARD: 'LARGE_BANNER',          // 320x100 - Good for top banner
};
