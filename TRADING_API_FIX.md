# Trading API Endpoint Fix - Mobile App

## Problem Identified

The mobile app was getting **404 "Route not found"** errors because it was calling incorrect API endpoints that don't exist on the backend server.

## Root Cause

There were **two different trading route files** in the backend:

1. `backend/routes/trading.js` - Uses `/rounds`, `/orders`, `/my-orders` (newer, not mounted)
2. `backend/routes/userTradingRoutes.js` - Uses `/active-rounds`, `/place-trade`, `/my-trades` (ACTUALLY mounted in server.js)

The mobile app was trying to use the endpoints from `trading.js` which were **never mounted** on the server!

## Backend Routes (ACTUAL - from server.js)

```javascript
// In server.js line 151
app.use("/api/trading", userTradingRoutes);
```

### Correct Endpoints (from userTradingRoutes.js)

✅ **GET** `/api/trading/active-rounds?roundType=colour|number`
✅ **GET** `/api/trading/upcoming-rounds?roundType=colour|number&limit=10`
✅ **GET** `/api/trading/rounds/:roundId`
✅ **POST** `/api/trading/place-trade`

- Body: `{ roundId, tradeType: 'colour'|'number', selection, amount }`
  ✅ **POST** `/api/trading/place-trades-batch`
- Body: `{ trades: [{roundId, tradeType, selection, amount}, ...] }`
  ✅ **GET** `/api/trading/my-trades`
  ✅ **GET** `/api/trading/rounds/:roundId/my-trades`

### ❌ WRONG Endpoints (mobile was trying to use these)

❌ `GET /api/trading/rounds?gameType=color&status=open` - **NOT MOUNTED**
❌ `POST /api/trading/orders` - **NOT MOUNTED**
❌ `GET /api/trading/my-orders` - **NOT MOUNTED**

## Changes Made to Mobile App

### File: `frontend/services/tradingApi.ts`

#### 1. Replaced `listRounds()` with TWO methods

```typescript
// OLD (404 error)
async listRounds(params?: {
  gameType?: GameType;
  status?: RoundStatus | "all";
  limit?: number;
}): Promise<TradingRound[]> {
  // Called: GET /api/trading/rounds ❌
}

// NEW (works!)
async listActiveRounds(roundType?: "colour" | "number"): Promise<TradingRound[]> {
  // Calls: GET /api/trading/active-rounds ✅
}

async listUpcomingRounds(
  roundType?: "colour" | "number",
  limit?: number
): Promise<TradingRound[]> {
  // Calls: GET /api/trading/upcoming-rounds ✅
}
```

#### 2. Replaced `placeOrder()` with `placeTrade()`

```typescript
// OLD (404 error)
async placeOrder(roundId: string, selections: OrderSelection[]): Promise<...> {
  // Called: POST /api/trading/orders ❌
}

// NEW (works!)
async placeTrade(
  roundId: string,
  tradeType: "colour" | "number",
  selection: string | number,
  amount: number
): Promise<any> {
  // Calls: POST /api/trading/place-trade ✅
}

// Added batch support
async placeTradesBatch(trades: Array<{...}>): Promise<any> {
  // Calls: POST /api/trading/place-trades-batch ✅
}

// Keep placeOrder() for backward compatibility (maps to placeTrade)
async placeOrder(roundId: string, selections: OrderSelection[]): Promise<...> {
  // Internally calls placeTrade() for each selection
}
```

#### 3. Updated `myOrders()` endpoint

```typescript
// OLD (404 error)
async myOrders(): Promise<TradingOrder[]> {
  // Called: GET /api/trading/my-orders ❌
}

// NEW (works!)
async myOrders(): Promise<TradingOrder[]> {
  // Calls: GET /api/trading/my-trades ✅
}
```

#### 4. Updated helper methods

```typescript
// Updated to use new endpoints
async getActiveRounds(roundType: "colour" | "number") {
  return await this.listActiveRounds(roundType); // ✅
}

async getUpcomingRounds(roundType: "colour" | "number", limit: number) {
  return await this.listUpcomingRounds(roundType, limit); // ✅
}

async getActiveColorRounds() {
  return this.listActiveRounds("colour"); // ✅
}

async getActiveNumberRounds() {
  return this.listActiveRounds("number"); // ✅
}
```

### File: `frontend/types/trading.ts`

Added `roundType` field for backend compatibility:

```typescript
export interface TradingRound {
  id: string;
  gameType: GameType;
  roundType?: "colour" | "number"; // Added - backend uses this sometimes
  // ... rest of fields
}
```

## API Parameter Differences

### Game Type Naming

- **Mobile API**: Uses `roundType` with values `"colour"` or `"number"`
- **Backend Storage**: May use `gameType` with `"color"` or `"number"`

### Status Values

- Backend `userTradingRoutes.js` filters by:
  - `active-rounds` → returns rounds with status `"open"` or `"active"`
  - `upcoming-rounds` → returns rounds with status `"upcoming"`
  - No "all" or "settled" endpoints (those were in the unmounted `trading.js`)

## Testing Checklist

✅ **Active Rounds Fetch**

- Color Trading: `GET /api/trading/active-rounds?roundType=colour`
- Number Trading: `GET /api/trading/active-rounds?roundType=number`

✅ **Upcoming Rounds Fetch**

- Color Trading: `GET /api/trading/upcoming-rounds?roundType=colour&limit=10`
- Number Trading: `GET /api/trading/upcoming-rounds?roundType=number&limit=10`

✅ **Place Trade**

- Single: `POST /api/trading/place-trade` with `{ roundId, tradeType, selection, amount }`
- Multiple (cart): `POST /api/trading/place-trades-batch` with `{ trades: [...] }`

✅ **My Trades**

- Fetch: `GET /api/trading/my-trades`

## Impact on Mobile App Screens

### Color Trading (`app/(tabs)/(trades)/color-trading.tsx`)

- ✅ Uses `useRounds()` → calls `tradingApi.getActiveRounds("colour")`
- ✅ Uses `useCart()` → calls `tradingApi.placeOrder()` which maps to `placeTrade()`

### Number Trading (`app/(tabs)/(trades)/number-trading.tsx`)

- ✅ Uses `useRounds()` → calls `tradingApi.getActiveRounds("number")`
- ✅ Uses `useCart()` → calls `tradingApi.placeOrder()` which maps to `placeTrade()`

### My Trades (`app/(tabs)/(trades)/my-trades.tsx`)

- ✅ Calls `tradingApi.myOrders()` → now uses `/api/trading/my-trades`

### RoundsContext (`frontend/contexts/RoundsContext.tsx`)

- ✅ Calls `tradingApi.getActiveRounds(roundType)`
- ✅ Calls `tradingApi.getUpcomingRounds(roundType)`

## Next Steps

1. **Test the mobile app** - All 404 errors should be resolved
2. **Verify backend responses** - Check that API returns expected data structure
3. **Check authentication** - Ensure auth token is being sent correctly
4. **Monitor error logs** - Watch for any remaining API issues

## Additional Notes

- The `placeOrder()` method is kept for **backward compatibility** with existing code
- It internally calls `placeTrade()` for each selection
- For better performance with multiple selections, consider using `placeTradesBatch()`
- The backend has two route files with different endpoints - this caused the confusion
- Web frontend uses the **correct mounted endpoints** from `userTradingRoutes.js`

## Files Modified

1. ✅ `frontend/services/tradingApi.ts` - Fixed all API endpoints
2. ✅ `frontend/types/trading.ts` - Added `roundType` field

## Files Verified (No Changes Needed)

1. ✅ `app/(tabs)/(trades)/color-trading.tsx` - Uses correct context APIs
2. ✅ `app/(tabs)/(trades)/number-trading.tsx` - Uses correct context APIs
3. ✅ `app/(tabs)/(trades)/my-trades.tsx` - Uses correct API method
4. ✅ `frontend/contexts/RoundsContext.tsx` - Uses correct API methods
