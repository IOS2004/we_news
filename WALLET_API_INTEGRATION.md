# Wallet API Integration Documentation

## Overview
The wallet feature fetches data from the backend API only once when the user lands on the wallet screen, preventing circular dependencies and exponential API calls.

## Key Features Preventing Circular Dependencies

### 1. **Single Initialization Flag**
```typescript
const [hasInitialized, setHasInitialized] = useState(false);
```
- Tracks whether the wallet has been initialized
- API is only called once per authentication session
- Resets when user logs out

### 2. **Fetch Lock with useRef**
```typescript
const isFetchingRef = useRef(false);
```
- Prevents multiple simultaneous API calls
- Uses ref instead of state to avoid re-renders
- Guards against race conditions

### 3. **Dependency Array Optimization**
```typescript
useEffect(() => {
  if (isAuthenticated && !hasInitialized) {
    fetchWalletData();
    setHasInitialized(true);
  }
}, [isAuthenticated]);  // Only depends on isAuthenticated, NOT on user object
```
- **Before**: `[isAuthenticated, user]` - Would trigger on every user object change
- **After**: `[isAuthenticated]` - Only triggers on auth state change

## API Call Flow

### Initial Load
```
User navigates to wallet
  ↓
WalletProvider checks: isAuthenticated && !hasInitialized
  ↓
If true: Call API once
  ↓
Set hasInitialized = true
  ↓
Future re-renders skip API call
```

### Manual Refresh
```
User pulls down to refresh
  ↓
handleRefresh() called
  ↓
refreshWallet() in context
  ↓
Check isFetchingRef (if already fetching, skip)
  ↓
Fetch fresh data from API
```

### Logout/Login
```
User logs out
  ↓
isAuthenticated = false
  ↓
hasInitialized reset to false
  ↓
Wallet data cleared
  ↓
User logs in again
  ↓
isAuthenticated = true, hasInitialized = false
  ↓
API called again (once)
```

## Code Changes

### 1. WalletContext.tsx
**Added:**
- `hasInitialized` state flag
- `isFetchingRef` to prevent concurrent calls
- Optimized useEffect dependencies
- Fetch guard in `fetchWalletData()`

**Removed:**
- `user` from useEffect dependencies (this was causing exponential calls)

### 2. api.ts
**Added:**
- `walletAPI.getWalletDetails()` function
- TypeScript interfaces for wallet data
- Proper API endpoint: `GET /wallet`

### 3. wallet.tsx
**Added:**
- Pull-to-refresh functionality
- Integration with WalletContext
- Graceful fallback to dummy data

## Testing Checklist

✅ **No Multiple API Calls**
- Open wallet screen → API called once
- Navigate away and back → No new API call
- Pull to refresh → Manual call only

✅ **No Circular Dependencies**
- User object changes don't trigger API calls
- Context re-renders don't trigger API calls
- Component re-renders don't trigger API calls

✅ **Proper Cleanup**
- Logout clears wallet data
- Login triggers fresh API call
- No memory leaks

## API Endpoint Configuration

The API endpoint is configured in `.env`:
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Update this to your backend URL as needed.

## Expected API Response

```json
{
  "success": true,
  "message": "Wallet details fetched successfully",
  "data": {
    "walletId": "NZluow36smejpNJabdZz",
    "balance": 1005,
    "formattedBalance": "₹1005.00",
    "status": "active",
    "transactions": [
      {
        "id": "8fd9fe73-52e4-4b5e-b31c-1694ec89df39",
        "walletId": "NZluow36smejpNJabdZz",
        "transactionType": "credit",
        "amount": 250,
        "description": "Wallet topup - ₹250 (10% discount applied)",
        "gstAmount": 41,
        "discountAmount": 25,
        "originalAmount": 250,
        "status": "pending",
        "createdAt": {
          "_seconds": 1759996616,
          "_nanoseconds": 550000000
        },
        "transactionReference": "WALLET_1759996616193_A1C0E38F"
      }
    ],
    "totalTransactions": 2,
    "canTransact": true
  }
}
```

## Common Issues & Solutions

### Issue: API called multiple times
**Solution**: Check that:
- `hasInitialized` flag is working
- useEffect doesn't have `user` in dependencies
- No manual calls to `refreshWallet()` in useEffect

### Issue: API never called
**Solution**: Check that:
- `isAuthenticated` is true
- Authentication token is stored in AsyncStorage
- Backend URL is correct in `.env`

### Issue: Stale data
**Solution**: 
- Use pull-to-refresh to manually update
- Or call `refreshWallet()` when needed (e.g., after transaction)

## Performance Metrics

- **Initial Load**: 1 API call
- **Screen Re-visits**: 0 API calls (cached)
- **Pull to Refresh**: 1 API call (manual)
- **Logout/Login**: 1 API call (per session)

## Security

- API calls include authentication token automatically
- Token stored securely in AsyncStorage
- API interceptor adds token to all requests
- No sensitive data logged in production
