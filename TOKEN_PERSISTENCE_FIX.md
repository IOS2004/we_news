# Token Persistence Fix - Debugging Guide

## ✅ What Was Fixed

### 1. **Removed Aggressive Token Clearing**

**Problem:** The API interceptor was automatically clearing tokens on ANY 401 error, even temporary network issues.

**Old Code:**

```typescript
if (error.response?.status === 401) {
  await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]); // ❌ Too aggressive!
}
```

**New Code:**

```typescript
if (error.response?.status === 401) {
  console.log("[API] 401 Unauthorized - Token may be expired");
  // Don't clear storage here - let AuthContext handle it properly ✅
}
```

### 2. **Added Debug Logging**

Added comprehensive logging to track token lifecycle:

- `[AuthContext] Initializing auth...` - When app starts
- `[AuthContext] Found stored auth data, validating token...` - Token found
- `[AuthContext] Token valid, user authenticated` - Token works
- `[AuthContext] Signing in...` - User logs in
- `[AuthContext] Auth data saved to AsyncStorage` - Token saved

### 3. **Improved Error Handling**

- Network errors no longer clear tokens (uses cached data instead)
- Only genuine authentication failures clear tokens
- Token refresh mechanism preserved

---

## 🔍 How Token Persistence Works

### Storage Implementation

```typescript
// Using @react-native-async-storage/async-storage
const TOKEN_STORAGE_KEY = "auth_token";
const USER_STORAGE_KEY = "user_data";

// On Login
await AsyncStorage.multiSet([
  [TOKEN_STORAGE_KEY, authData.token],
  [USER_STORAGE_KEY, JSON.stringify(authData.user)],
]);

// On App Start
const [[, token], [, userData]] = await AsyncStorage.multiGet([
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
]);
```

### Authentication Flow

```
App Start
    ↓
Check AsyncStorage
    ↓
Token Found?
    ├─ YES → Validate with /api/user/profile
    │         ├─ Success → User logged in ✅
    │         ├─ 401 → Try refresh token
    │         │         ├─ Success → User logged in ✅
    │         │         └─ Fail → Clear & show login ❌
    │         └─ Network Error → Use cached data ✅
    │
    └─ NO → Show login screen
```

---

## 🧪 Testing Instructions

### Test 1: Basic Login Persistence

1. **Login** to the app
2. Check terminal logs for: `[AuthContext] Auth data saved to AsyncStorage`
3. **Force close** the app (swipe away)
4. **Reopen** the app
5. Check logs for: `[AuthContext] Found stored auth data, validating token...`
6. **Expected:** User should be logged in automatically ✅

### Test 2: Network Error Handling

1. Login to the app
2. **Turn off WiFi/mobile data**
3. Force close and reopen app
4. Check logs for: `[AuthContext] Network error during validation, using cached data`
5. **Expected:** User should still be logged in (using cached data) ✅

### Test 3: Token Expiry

1. Login to the app
2. Wait for token to expire (or manually expire on backend)
3. Reopen the app
4. Check logs for: `[AuthContext] Session expired, clearing auth data`
5. **Expected:** User should see login screen ✅

---

## 🐛 Debugging Steps

### If Still Logging Out on Reload:

**Step 1: Check AsyncStorage**

```typescript
// Add this to your code temporarily
import AsyncStorage from "@react-native-async-storage/async-storage";

const checkStorage = async () => {
  const token = await AsyncStorage.getItem("auth_token");
  const user = await AsyncStorage.getItem("user_data");
  console.log("STORED TOKEN:", token ? "EXISTS" : "NONE");
  console.log("STORED USER:", user ? "EXISTS" : "NONE");
};

// Call after login
await checkStorage();
```

**Step 2: Check Console Logs**
Look for these specific messages in your terminal:

- ✅ `[AuthContext] Auth data saved to AsyncStorage` - Token saved
- ✅ `[AuthContext] Found stored auth data` - Token retrieved
- ❌ `[AuthContext] No stored auth data found` - Token missing!

**Step 3: Check API Response**
Verify login API returns token:

```typescript
// Should see this structure:
{
  success: true,
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: { id, email, firstName, ... }
  }
}
```

**Step 4: Check Network Tab**
After app reload, check if `/api/user/profile` is called:

- ✅ If YES with `Authorization: Bearer xxx` → Token exists
- ❌ If NO authorization header → Token not retrieved

---

## 📝 Common Issues & Solutions

### Issue 1: "No stored auth data found"

**Cause:** Token not being saved after login  
**Solution:** Check if `storage.saveAuthData()` is being called in signIn  
**Verify:** Look for log `[AuthContext] Auth data saved to AsyncStorage`

### Issue 2: "Token validation failed" immediately

**Cause:** Backend not accepting the token  
**Solution:**

- Check if backend token format changed
- Verify `Authorization: Bearer <token>` header is correct
- Check token expiry time on backend

### Issue 3: Token cleared on network error

**Cause:** Old code was clearing tokens on any 401  
**Solution:** ✅ Already fixed! Now keeps cached data on network errors

### Issue 4: AsyncStorage permissions (iOS)

**Cause:** iOS might restrict AsyncStorage in some cases  
**Solution:** Check app permissions, rebuild app

---

## 🔧 Manual Test Commands

### Clear AsyncStorage (for testing)

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

// Clear all data
await AsyncStorage.clear();

// Clear only auth data
await AsyncStorage.multiRemove(["auth_token", "user_data"]);
```

### View Stored Data

```typescript
// Get all keys
const keys = await AsyncStorage.getAllKeys();
console.log("All AsyncStorage keys:", keys);

// Get specific values
const token = await AsyncStorage.getItem("auth_token");
const user = await AsyncStorage.getItem("user_data");
console.log("Token:", token);
console.log("User:", JSON.parse(user));
```

---

## ✅ Expected Behavior After Fix

### On First Login

```
[AuthContext] Signing in...
[AuthContext] Sign in successful, saving auth data...
[AuthContext] Auth data saved to AsyncStorage
Toast: Welcome back! Hi John!
→ User sees dashboard
```

### On App Reload (Token Valid)

```
[AuthContext] Initializing auth...
[AuthContext] Found stored auth data, validating token...
[AuthContext] Token valid, user authenticated: john@example.com
→ User sees dashboard (no login screen)
```

### On App Reload (Network Issue)

```
[AuthContext] Initializing auth...
[AuthContext] Found stored auth data, validating token...
[AuthContext] Network error during validation, using cached data
→ User sees dashboard (using cached data)
```

### On App Reload (Token Expired)

```
[AuthContext] Initializing auth...
[AuthContext] Found stored auth data, validating token...
[AuthContext] Token validation failed
[AuthContext] Attempting token refresh...
[AuthContext] Token refresh failed
[AuthContext] Session expired, clearing auth data
→ User sees login screen
```

---

## 📊 Success Metrics

After implementing these fixes:

- ✅ Token persists across app reloads
- ✅ Network errors don't log users out
- ✅ Token expiry is handled gracefully
- ✅ Users stay logged in until they explicitly sign out
- ✅ Debug logs make issues easy to identify

---

**Next Steps:**

1. Test login persistence (close/reopen app)
2. Check console logs for proper flow
3. If still issues, follow debugging steps above
4. Report specific log messages for further help
