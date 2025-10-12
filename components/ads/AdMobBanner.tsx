import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AdConfig } from '../../config/adConfig';

interface AdMobBannerProps {
  adUnitId?: string;
  size?: BannerAdSize;
  style?: any;
}

/**
 * AdMob Banner Ad Component
 * 
 * This component displays a banner ad from Google AdMob.
 * Automatically uses test ads in development, production ads in release.
 * 
 * @param adUnitId - Custom ad unit ID (optional, uses config if not provided)
 * @param size - Banner size (default: BANNER)
 * @param style - Additional styles
 */
export const AdMobBanner: React.FC<AdMobBannerProps> = ({ 
  adUnitId, 
  size = BannerAdSize.BANNER,
  style 
}) => {
  // Use provided ad unit ID or get from config
  const bannerAdUnitId = adUnitId || AdConfig.getBannerAdUnitId();

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={bannerAdUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});
