# Google AdMob Integration Guide for WeNews

## Overview
Google AdMob has been successfully integrated into the WeNews React Native app using Expo. This document provides setup instructions, ad placement details, and production configuration steps.

## What's Integrated

### 1. Ad Types Implemented
- ✅ **Banner Ads**: Static display ads shown at strategic locations
- ✅ **Interstitial Ads**: Full-screen ads shown between content transitions
- ✅ **Rewarded Ads**: Video ads that reward users (hook available for future use)

### 2. Ad Placements

#### Banner Ads
1. **News Feed** (`app/(tabs)/(news)/index.tsx`)
   - Medium rectangle banner every 5 articles
   - Size: `BannerAdSize.MEDIUM_RECTANGLE` (300x250)

2. **Article Detail** (`app/article/[id].tsx`)
   - Medium rectangle banner below article content
   - Size: `BannerAdSize.MEDIUM_RECTANGLE` (300x250)

3. **Dashboard** (`app/(tabs)/(home)/dashboard.tsx`)
   - Large banner at top of dashboard
   - Size: `BannerAdSize.LARGE_BANNER` (320x100)

#### Interstitial Ads
- **Article Reading Flow** (`app/article/[id].tsx`)
  - Shows after every 3 articles viewed
  - Tracks view count using AsyncStorage
  - 2-second delay before display for better UX

## Installation & Configuration

### Dependencies Installed
```json
{
  "react-native-google-mobile-ads": "^14.x.x"
}
```

### App Configuration
The following has been added to `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-3940256099942544~3347511713",
          "iosAppId": "ca-app-pub-3940256099942544~1458002511"
        }
      ]
    ],
    "android": {
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-3940256099942544~3347511713"
      }
    },
    "ios": {
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-3940256099942544~1458002511"
      }
    }
  }
}
```

**⚠️ IMPORTANT**: The above App IDs are Google's TEST IDs. Replace them with your production IDs before release.

## Components & Hooks Created

### 1. AdMobBanner Component
**Location**: `components/ads/AdMobBanner.tsx`

Simple banner ad component with customizable size:
```typescript
<AdMobBanner 
  size={BannerAdSize.BANNER} 
  adUnitId="your-ad-unit-id" // Optional, uses test ID by default
/>
```

### 2. useInterstitialAd Hook
**Location**: `hooks/useInterstitialAd.ts`

Hook for managing interstitial ads:
```typescript
const { showAd, isLoaded, isLoading } = useInterstitialAd();

// Show ad when ready
if (isLoaded) {
  showAd();
}
```

### 3. useRewardedAd Hook
**Location**: `hooks/useRewardedAd.ts`

Hook for rewarded video ads:
```typescript
const { showAd, isLoaded } = useRewardedAd({
  onUserEarnedReward: (reward) => {
    console.log('User earned:', reward.amount);
    // Grant user reward (coins, points, etc.)
  }
});
```

### 4. AdMobContext
**Location**: `contexts/AdMobContext.tsx`

Initializes AdMob SDK and provides configuration:
- Automatic SDK initialization on app start
- Test mode toggle (enabled by default)
- Content rating configuration (PG)
- Already integrated in `app/_layout.tsx`

## Testing the Integration

### Current Setup (Test Mode)
The app is currently configured with **test ad unit IDs**. These will show sample ads from Google:

- Banner Test ID: `ca-app-pub-3940256099942544/6300978111`
- Interstitial Test ID: `ca-app-pub-3940256099942544/1033173712`
- Rewarded Test ID: `ca-app-pub-3940256099942544/5224354917`

### Testing Steps
1. Run the app: `npm run android` or `npm run ios`
2. Navigate through the app:
   - Check banner ads in news feed (every 5 articles)
   - Open article detail to see banner at bottom
   - View dashboard to see banner at top
   - Read 3 articles to trigger interstitial ad

### Expected Behavior
- Ads should load and display within 1-3 seconds
- Test ads will show "Test Ad" watermark
- No real revenue will be generated in test mode

## Production Setup

### Step 1: Create AdMob Account
1. Go to [Google AdMob](https://admob.google.com/)
2. Sign in with your Google account
3. Click "Get Started" to create AdMob account

### Step 2: Create Ad Units
1. In AdMob console, click "Apps" > "Add App"
2. Register your app:
   - Platform: Android / iOS
   - App name: WeNews
   - Package name: `com.wenews.app` (from app.json)
3. Create ad units for each type:
   - **Banner Ad Unit** (for news feed, article detail, dashboard)
   - **Interstitial Ad Unit** (for article transitions)
   - **Rewarded Ad Unit** (for future features)
4. Note down all Ad Unit IDs (format: `ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY`)

### Step 3: Update App Configuration

#### Update app.json
Replace test App IDs with your production App IDs:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
          "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
        }
      ]
    ],
    "android": {
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
      }
    },
    "ios": {
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
      }
    }
  }
}
```

#### Update Ad Unit IDs in Components
Create a config file for production ad unit IDs:

**Create**: `config/adConfig.ts`
```typescript
export const AdConfig = {
  // Set to false for production
  useTestAds: __DEV__, // Automatically uses test ads in development
  
  // Your production ad unit IDs
  banner: {
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  },
  interstitial: {
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  },
  rewarded: {
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  },
};
```

Then update `components/ads/AdMobBanner.tsx`:
```typescript
import { Platform } from 'react-native';
import { AdConfig } from '../../config/adConfig';

// In the component
const bannerAdUnitId = adUnitId || (
  AdConfig.useTestAds
    ? TestIds.BANNER
    : Platform.OS === 'ios'
    ? AdConfig.banner.ios
    : AdConfig.banner.android
);
```

### Step 4: Disable Test Mode
In `contexts/AdMobContext.tsx`, change:
```typescript
const [isTestMode, setTestMode] = useState(false); // Set to false for production
```

### Step 5: Rebuild the App
After updating ad unit IDs, rebuild the app:
```bash
# For Android
npm run android

# For iOS
npm run ios

# For EAS Build
eas build --platform android
eas build --platform ios
```

## Revenue Optimization Tips

### 1. Ad Placement Best Practices
- ✅ Current placements are optimal for user experience
- ✅ Ads are shown at natural breaks (every 5 articles, after content)
- ✅ Interstitial frequency (every 3 articles) balances UX and revenue

### 2. Increase Ad Fill Rate
- Add mediation networks (Facebook Audience Network, Unity Ads)
- Enable "Optimize" option in AdMob for each ad unit
- Set appropriate floor prices in AdMob console

### 3. Monitor Performance
Track these metrics in AdMob console:
- **eCPM** (Effective Cost Per Mille): Revenue per 1000 impressions
- **Fill Rate**: Percentage of ad requests filled
- **Click-Through Rate (CTR)**: Percentage of ads clicked
- **Impressions**: Total ad views

### 4. A/B Testing
Test different configurations:
- Banner sizes (BANNER vs MEDIUM_RECTANGLE)
- Interstitial frequency (every 2-5 articles)
- Ad placement locations

## Troubleshooting

### Ads Not Showing
1. **Check internet connection**: Ads require network access
2. **Verify ad unit IDs**: Ensure correct IDs in production
3. **Test mode enabled**: Confirm test ads work first
4. **Check logs**: Look for ad load errors in console

### Common Issues

#### "Ad failed to load" Error
- New ad units take 1-2 hours to activate
- Check AdMob account is verified
- Ensure billing is set up

#### Test Ads Work, Production Ads Don't
- Wait 1-2 hours after creating new ad units
- Verify app is published/in review on Play Store/App Store
- Check AdMob account isn't suspended

#### Interstitial Ads Not Triggering
- Check AsyncStorage is working
- Verify article view count is incrementing
- Ensure ad is loaded before calling `showAd()`

## Future Enhancements

### 1. Rewarded Ads Implementation
Add rewarded video ads for:
- Earning extra coins/points
- Unlocking premium articles
- Boosting referral rewards

```typescript
// In a component
const { showAd, isLoaded } = useRewardedAd({
  onUserEarnedReward: async (reward) => {
    // Credit user account
    await creditUserReward(reward.amount);
    showToast.success('Reward earned!');
  }
});
```

### 2. Native Ads
Integrate native ads that blend with article cards:
- Shows ads that match app design
- Higher click-through rates
- Better user experience

### 3. Mediation
Add multiple ad networks for better fill rates:
- Facebook Audience Network
- Unity Ads
- AppLovin
- Increases competition for ad slots
- Higher eCPM and revenue

### 4. Smart Ad Loading
Implement predictive ad loading:
- Preload interstitial before likely trigger points
- Cache rewarded ads for instant display
- Reduce wait times for users

## AdMob Policy Compliance

⚠️ **Important**: Ensure your app complies with AdMob policies:

1. **Invalid Clicks**: Never click your own ads or encourage users to click
2. **Content Policy**: Ensure all content is appropriate
3. **Placement**: Don't place ads too close to buttons
4. **Disclosure**: Clearly distinguish ads from content (✅ Done with "AD" label)
5. **Children's Content**: If targeting children, enable COPPA compliance

Non-compliance can result in account suspension.

## Support & Resources

- **AdMob Help Center**: https://support.google.com/admob
- **React Native Google Mobile Ads Docs**: https://docs.page/invertase/react-native-google-mobile-ads
- **Expo AdMob Guide**: https://docs.expo.dev/versions/latest/sdk/admob/

## Summary

✅ **Completed:**
- AdMob SDK integrated and initialized
- Banner ads in 3 key locations (news feed, article detail, dashboard)
- Interstitial ads after every 3 articles
- Test mode enabled for safe development
- Complete documentation

🚀 **Next Steps for Production:**
1. Create AdMob account and ad units
2. Replace test ad unit IDs with production IDs
3. Create `config/adConfig.ts` with production configuration
4. Disable test mode in `AdMobContext`
5. Rebuild and test the app
6. Monitor revenue in AdMob console

---

**Last Updated**: January 2025
**Integration Status**: ✅ Complete (Test Mode)
**Production Ready**: ⏳ Pending ad unit creation
