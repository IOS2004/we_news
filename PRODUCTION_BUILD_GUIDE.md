# Production Build Configuration
# This file ensures proper production settings for Google Play Store deployment

## Environment Detection for Google Play

When you upload your app to Google Play Store, the environment will be automatically detected as **PRODUCTION** based on:

### 1. Build Profile Used
```bash
# For Google Play Store, ALWAYS use production profile:
eas build --profile production --platform android
```

### 2. Environment Variables (Set in eas.json)
- `NODE_ENV=production` 
- `EXPO_PUBLIC_CASHFREE_ENV=PROD`
- `EXPO_PUBLIC_API_BASE_URL=https://wenews.onrender.com/api`

### 3. App Bundle Type
- Production builds create `.aab` files (Android App Bundle)
- Development/Preview builds create `.apk` files

## How Google Play Detects Production:

1. **Build Type**: Uses `aab` format (set in eas.json production profile)
2. **Environment Variables**: Automatically set to production values
3. **Code Optimization**: React Native optimizations enabled (__DEV__ = false)
4. **Signing**: Uses production signing keys

## Production Checklist for Google Play:

### ✅ Before Building:
- [ ] Update version in `app.json`
- [ ] Ensure production API URLs are correct
- [ ] Test CashFree PROD environment
- [ ] Remove any development/test code
- [ ] Update app icon and splash screen

### ✅ Build Command:
```bash
eas build --profile production --platform android
```

### ✅ After Build:
- [ ] Test the .aab file thoroughly
- [ ] Verify environment is detected as 'production'
- [ ] Test payment flows with real CashFree PROD
- [ ] Check API endpoints are production URLs

## Environment Detection in Code:

```typescript
import { getEnvironment, isProduction } from './config/environment';

// This will return 'production' when uploaded to Google Play
const env = getEnvironment();
console.log('Environment:', env); // 'production'

// This will return true for Google Play builds
const isProd = isProduction();
console.log('Is Production:', isProd); // true
```

## CashFree Environment:
- Development/Preview: SANDBOX
- Production (Google Play): PROD (Real payments)

## API Endpoints:
- Development/Preview: https://wenews-testing.onrender.com/api
- Production (Google Play): https://wenews.onrender.com/api

The app will automatically use the correct configuration based on the build profile used.