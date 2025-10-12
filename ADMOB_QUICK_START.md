# AdMob Integration - Quick Reference

## ✅ What's Been Integrated

### Banner Ads

- **News Feed**: After every 5 articles (300x250)
- **Article Detail**: Below article content (300x250)
- **Dashboard**: Top banner (320x100)

### Interstitial Ads

- **Article Reading**: After every 3 articles viewed
- Smart timing with 2-second delay for better UX

### Components & Hooks

- `<AdMobBanner />` - Banner ad component
- `useInterstitialAd()` - Interstitial ad hook
- `useRewardedAd()` - Rewarded ad hook (ready to use)
- `<AdMobProvider />` - SDK initialization (already in app)

## 🧪 Current Status: TEST MODE

The app is currently using **Google's test ad unit IDs**. This means:

- ✅ Ads will display with "Test Ad" watermark
- ✅ Safe to click (won't affect your account)
- ✅ No real revenue generated
- ✅ Perfect for development and testing

## 🚀 Going to Production

### 1. Create AdMob Account & Ad Units

```
1. Visit: https://admob.google.com/
2. Sign in with Google account
3. Create app: "WeNews" (package: com.wenews.app)
4. Create 3 ad units:
   - Banner Ad Unit
   - Interstitial Ad Unit
   - Rewarded Ad Unit (optional)
5. Note all ad unit IDs
```

### 2. Update Configuration

Edit `config/adConfig.ts`:

```typescript
// Change this line:
export const USE_TEST_ADS = false; // Set to false for production

// Update these with your real ad unit IDs:
const PRODUCTION_AD_UNITS = {
  banner: {
    android: "ca-app-pub-YOUR-ID-HERE/BANNER-ID",
    ios: "ca-app-pub-YOUR-ID-HERE/BANNER-ID",
  },
  // ... etc
};
```

Edit `app.json`:

```json
{
  "plugins": [
    [
      "react-native-google-mobile-ads",
      {
        "androidAppId": "ca-app-pub-YOUR-ANDROID-APP-ID",
        "iosAppId": "ca-app-pub-YOUR-IOS-APP-ID"
      }
    ]
  ]
}
```

### 3. Rebuild App

```bash
# For Android
npm run android

# For iOS
npm run ios

# For Production Build
eas build --platform android
eas build --platform ios
```

## 📊 Expected Revenue (Estimates)

Based on typical news app metrics:

- **Banner eCPM**: $0.50 - $2.00
- **Interstitial eCPM**: $3.00 - $8.00
- **1000 daily users**: $5 - $30/day
- **10,000 daily users**: $50 - $300/day

Actual revenue depends on:

- User location (US/EU users = higher revenue)
- Content category
- User engagement
- Ad fill rates

## 🎛️ Customization

### Adjust Ad Frequency

Edit `config/adConfig.ts`:

```typescript
export const AdFrequency = {
  BANNER_AFTER_ARTICLES: 5, // Change to 3-7
  INTERSTITIAL_AFTER_ARTICLES: 3, // Change to 2-5
  INTERSTITIAL_DELAY_SECONDS: 2, // Change to 1-3
};
```

### Change Banner Sizes

Available sizes:

- `BANNER`: 320x50 (standard)
- `LARGE_BANNER`: 320x100 (larger)
- `MEDIUM_RECTANGLE`: 300x250 (most revenue)
- `FULL_BANNER`: 468x60 (tablet)
- `LEADERBOARD`: 728x90 (tablet)

## 🐛 Troubleshooting

### Ads Not Showing

1. Check internet connection
2. Wait 1-2 hours after creating new ad units
3. Check AdMob console for errors
4. Look for errors in app logs

### Production Build

When creating production builds:

```bash
# Android
npx expo prebuild --platform android
./gradlew assembleRelease

# iOS
npx expo prebuild --platform ios
# Then build in Xcode
```

## 📚 Documentation

- Full Setup Guide: `ADMOB_SETUP.md`
- Ad Config: `config/adConfig.ts`
- Banner Component: `components/ads/AdMobBanner.tsx`
- Interstitial Hook: `hooks/useInterstitialAd.ts`
- Rewarded Hook: `hooks/useRewardedAd.ts`

## ⚠️ Important Notes

1. **Never click your own ads** - Can get your account banned
2. **Wait 1-2 hours** - New ad units take time to activate
3. **Test first** - Always test with test ads before production
4. **Monitor performance** - Check AdMob console regularly
5. **Follow policies** - Read AdMob policies to avoid suspension

## 🎯 Next Steps

- [ ] Create AdMob account
- [ ] Generate ad unit IDs
- [ ] Update `config/adConfig.ts`
- [ ] Update `app.json`
- [ ] Test with test ads
- [ ] Build for production
- [ ] Monitor revenue in AdMob console

---

**Need Help?** See `ADMOB_SETUP.md` for detailed instructions.
