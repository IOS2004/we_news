# AdMob Production Deployment Checklist

Use this checklist when you're ready to enable real ads and start earning revenue.

## ⚠️ Before You Start

- [ ] Have Google account ready
- [ ] App is ready for production
- [ ] Have tested thoroughly in development
- [ ] Understand AdMob policies

---

## 1️⃣ AdMob Account Setup

### Create Account

- [ ] Visit https://admob.google.com/
- [ ] Sign in with Google account
- [ ] Complete account setup
- [ ] Verify email address
- [ ] Accept terms of service

### Add Payment Information

- [ ] Go to Payments > Payment Information
- [ ] Add bank account or payment method
- [ ] Set payment threshold (minimum $100)
- [ ] Verify tax information

---

## 2️⃣ Register Your App

### Android App

- [ ] Go to Apps > Add App
- [ ] Select "Android"
- [ ] App name: **WeNews**
- [ ] Package name: **com.wenews.app**
- [ ] Note Android App ID: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`

### iOS App

- [ ] Go to Apps > Add App
- [ ] Select "iOS"
- [ ] App name: **WeNews**
- [ ] Bundle ID: **com.wenews.app**
- [ ] Note iOS App ID: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`

---

## 3️⃣ Create Ad Units

### Banner Ad Unit

- [ ] Go to Ad Units > Create Ad Unit
- [ ] Select "Banner"
- [ ] Name: "WeNews Banner"
- [ ] Note Android Banner ID: `ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY`
- [ ] Note iOS Banner ID: `ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY`

### Interstitial Ad Unit

- [ ] Go to Ad Units > Create Ad Unit
- [ ] Select "Interstitial"
- [ ] Name: "WeNews Interstitial"
- [ ] Note Android Interstitial ID: `ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY`
- [ ] Note iOS Interstitial ID: `ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY`

### Rewarded Ad Unit (Optional)

- [ ] Go to Ad Units > Create Ad Unit
- [ ] Select "Rewarded"
- [ ] Name: "WeNews Rewarded"
- [ ] Note Android Rewarded ID: `ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY`
- [ ] Note iOS Rewarded ID: `ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY`

---

## 4️⃣ Update App Configuration

### Update config/adConfig.ts

```typescript
// Line 18 - Disable test mode
export const USE_TEST_ADS = false; // ← Change to false

// Lines 21-40 - Add your ad unit IDs
const PRODUCTION_AD_UNITS = {
  banner: {
    android: "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY", // ← Your Android Banner ID
    ios: "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY", // ← Your iOS Banner ID
  },
  interstitial: {
    android: "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY", // ← Your Android Interstitial ID
    ios: "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY", // ← Your iOS Interstitial ID
  },
  rewarded: {
    android: "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY", // ← Your Android Rewarded ID
    ios: "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY", // ← Your iOS Rewarded ID
  },
};
```

Checklist:

- [ ] Set `USE_TEST_ADS = false`
- [ ] Update Android Banner ID
- [ ] Update iOS Banner ID
- [ ] Update Android Interstitial ID
- [ ] Update iOS Interstitial ID
- [ ] Update Android Rewarded ID (optional)
- [ ] Update iOS Rewarded ID (optional)

### Update app.json

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

Checklist:

- [ ] Update androidAppId in plugins
- [ ] Update iosAppId in plugins
- [ ] Update androidAppId in android.config
- [ ] Update iosAppId in ios.config
- [ ] Verify all IDs are copied correctly

---

## 5️⃣ Testing Before Production

### Test with Test Ads First

- [ ] Ensure `USE_TEST_ADS = true`
- [ ] Run app: `npm run android` or `npm run ios`
- [ ] Verify banner ads show in news feed
- [ ] Verify banner ad shows in article detail
- [ ] Verify banner ad shows in dashboard
- [ ] Read 3 articles to trigger interstitial
- [ ] Check logs for any errors

### Test with Production Setup (No Revenue Yet)

- [ ] Set `USE_TEST_ADS = false`
- [ ] Update all ad unit IDs
- [ ] Clean rebuild: `npx expo prebuild --clean`
- [ ] Run app: `npm run android`
- [ ] **DO NOT CLICK ADS** (policy violation)
- [ ] Verify ads load (may take 1-2 hours)
- [ ] Check AdMob console for impressions

---

## 6️⃣ Build for Production

### Android Build

```bash
# Clean and rebuild
npx expo prebuild --clean --platform android

# Navigate to android folder
cd android

# Build release APK
./gradlew assembleRelease

# Or build with EAS
eas build --platform android
```

Checklist:

- [ ] Clean prebuild completed
- [ ] Release build successful
- [ ] APK/AAB file generated
- [ ] Test on physical device

### iOS Build

```bash
# Clean and rebuild
npx expo prebuild --clean --platform ios

# Build with EAS
eas build --platform ios
```

Checklist:

- [ ] Clean prebuild completed
- [ ] Build successful
- [ ] Test on physical device
- [ ] Verify ads show

---

## 7️⃣ Deploy to Stores

### Google Play Store (Android)

- [ ] Upload APK/AAB to Play Console
- [ ] Fill out store listing
- [ ] Add screenshots
- [ ] Submit for review
- [ ] Wait for approval (1-7 days)

### Apple App Store (iOS)

- [ ] Upload build to App Store Connect
- [ ] Fill out app information
- [ ] Add screenshots
- [ ] Submit for review
- [ ] Wait for approval (1-7 days)

---

## 8️⃣ Monitor Performance

### First 24 Hours

- [ ] Check AdMob console for impressions
- [ ] Verify ads are showing
- [ ] Monitor error logs
- [ ] Check fill rate
- [ ] Look for policy warnings

### First Week

- [ ] Daily check of AdMob console
- [ ] Track impression counts
- [ ] Monitor eCPM
- [ ] Check for any issues
- [ ] Adjust if needed

### Ongoing

- [ ] Weekly performance review
- [ ] Monthly revenue analysis
- [ ] Test different ad placements
- [ ] Optimize based on data
- [ ] Keep up with policy updates

---

## 9️⃣ Optimization (After 1 Week)

### Analyze Performance

- [ ] Review eCPM by ad unit
- [ ] Check fill rates
- [ ] Analyze user engagement
- [ ] Look for drop-off points

### Consider Adjustments

- [ ] Test different ad frequencies
- [ ] Try different banner sizes
- [ ] Adjust interstitial timing
- [ ] Add more ad placements
- [ ] Consider mediation networks

---

## 🔟 Compliance & Maintenance

### Policy Compliance

- [ ] Never click own ads
- [ ] Don't encourage clicks
- [ ] Keep ads distinct from content
- [ ] Monitor for violations
- [ ] Read policy updates

### Regular Maintenance

- [ ] Update SDK regularly
- [ ] Fix reported issues
- [ ] Monitor user feedback
- [ ] Keep documentation updated
- [ ] Review performance monthly

---

## ✅ Final Verification

Before going live, verify:

- [ ] All ad unit IDs are correct
- [ ] Test mode is disabled
- [ ] App builds successfully
- [ ] Ads show in all locations
- [ ] No errors in logs
- [ ] AdMob account is verified
- [ ] Payment info is added
- [ ] Policy requirements met
- [ ] App is ready for production

---

## 📋 Ad Unit IDs Record

Keep a record of your ad unit IDs:

### Android

```
App ID: ca-app-pub-____________________~__________
Banner: ca-app-pub-____________________/__________
Interstitial: ca-app-pub-____________________/__________
Rewarded: ca-app-pub-____________________/__________
```

### iOS

```
App ID: ca-app-pub-____________________~__________
Banner: ca-app-pub-____________________/__________
Interstitial: ca-app-pub-____________________/__________
Rewarded: ca-app-pub-____________________/__________
```

---

## 🚨 Common Mistakes to Avoid

- ❌ Clicking your own ads (account ban)
- ❌ Copying ad unit IDs incorrectly
- ❌ Not waiting 1-2 hours for new units
- ❌ Testing with production ads
- ❌ Forgetting to disable test mode
- ❌ Not setting up payment info
- ❌ Violating AdMob policies
- ❌ Too many ads (bad UX)

---

## 🎉 Congratulations!

Once you complete this checklist, your app will be:

- ✅ Displaying real ads
- ✅ Generating revenue
- ✅ Compliant with policies
- ✅ Ready for scale

**Start earning today!** 🚀💰

---

**Need Help?**

- See `ADMOB_SETUP.md` for detailed guide
- Check `ADMOB_QUICK_START.md` for reference
- Visit https://support.google.com/admob
