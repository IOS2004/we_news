# Mobile App - API Quick Reference

## 🔴 ERRORS FIXED

| Error Message                              | Old Endpoint             | New Endpoint                 | File            |
| ------------------------------------------ | ------------------------ | ---------------------------- | --------------- |
| `[TradingAPI] listRounds: Route not found` | `/api/trading/rounds`    | `/api/trading/active-rounds` | `tradingApi.ts` |
| `[TradingAPI] myOrders: Route not found`   | `/api/trading/my-orders` | `/api/trading/my-trades`     | `tradingApi.ts` |
| `Error fetching earnings: Route not found` | `/api/wallet/earnings`   | `/api/earnings/stats`        | `api.ts`        |

---

## ✅ CORRECT ENDPOINTS TO USE

### Trading APIs (`/api/trading`)

```typescript
// Get active rounds
GET /api/trading/active-rounds?roundType=colour    // Color rounds
GET /api/trading/active-rounds?roundType=number    // Number rounds

// Get upcoming rounds
GET /api/trading/upcoming-rounds?roundType=colour&limit=10

// Get specific round
GET /api/trading/rounds/:roundId

// Place single trade
POST /api/trading/place-trade
{
  "roundId": "abc123",
  "tradeType": "colour",  // or "number"
  "selection": "red",     // or number like 5
  "amount": 100
}

// Place multiple trades (cart)
POST /api/trading/place-trades-batch
{
  "trades": [
    { "roundId": "abc123", "tradeType": "colour", "selection": "red", "amount": 100 },
    { "roundId": "abc123", "tradeType": "colour", "selection": "blue", "amount": 50 }
  ]
}

// Get my trades history
GET /api/trading/my-trades?page=1&limit=50

// Get my trades in specific round
GET /api/trading/rounds/:roundId/my-trades

// Get wallet balance
GET /api/trading/wallet-balance
```

### Earnings APIs (`/api/earnings`)

```typescript
// Get earnings stats (for dashboard)
GET /api/earnings/stats

// Get today's earnings
GET /api/earnings/today

// Get daily earnings with pagination
GET /api/earnings/daily?page=1&limit=20

// Get earnings summary for date range
GET /api/earnings/summary?startDate=2024-01-01&endDate=2024-12-31
```

### Referral APIs (`/api/referrals`)

```typescript
// Get referral info (already correct)
GET /api/referrals/info

// Get referral tree
GET /api/referrals/tree?levels=5

// Validate referral code
GET /api/referrals/validate/:referralCode

// Get commission structure
GET /api/referrals/commission-structure
```

---

## 🎯 HOW TO USE IN CODE

### Example: Get Active Color Rounds

```typescript
import { tradingApi } from "@/services/tradingApi";

// Method 1: Direct call
const rounds = await tradingApi.listActiveRounds("colour");

// Method 2: Via helper
const rounds = await tradingApi.getActiveColorRounds();

// Method 3: Via RoundsContext
const { colorActiveRounds } = useRounds();
```

### Example: Place Trades from Cart

```typescript
import { tradingApi } from "@/services/tradingApi";

// If you have cart with multiple selections
const selections = [
  { option: "red", amount: 100 },
  { option: "blue", amount: 50 },
];

// Option 1: Use placeOrder (backward compatible)
await tradingApi.placeOrder(roundId, selections);

// Option 2: Use new placeTrade for single selection
await tradingApi.placeTrade(roundId, "colour", "red", 100);

// Option 3: Use batch for multiple (most efficient)
const trades = selections.map((sel) => ({
  roundId,
  tradeType: "colour",
  selection: sel.option,
  amount: sel.amount,
}));
await tradingApi.placeTradesBatch(trades);
```

### Example: Get My Trading History

```typescript
import { tradingApi } from "@/services/tradingApi";

const orders = await tradingApi.myOrders({ limit: 50 });
```

### Example: Get Earnings for Dashboard

```typescript
import { referralAPI } from "@/services/api";

const response = await referralAPI.getEarnings();
if (response.success) {
  const earnings = response.data;
  console.log(earnings);
}
```

---

## 🚫 DO NOT USE (These endpoints don't exist)

```typescript
❌ GET /api/trading/rounds              // Use /active-rounds or /upcoming-rounds
❌ POST /api/trading/orders             // Use /place-trade
❌ GET /api/trading/my-orders           // Use /my-trades
❌ GET /api/wallet/earnings             // Use /earnings/stats
```

---

## 📝 PARAMETER DIFFERENCES

### Game Type Naming

- Trading API uses: `roundType` with values `"colour"` or `"number"`
- Some backend fields use: `gameType` with values `"color"` or `"number"`
- Mobile app handles conversion automatically

### Trade Type

Always use: `"colour"` or `"number"` (NOT "color")

### Selection Format

- **Color**: String like `"red"`, `"blue"`, `"green"`
- **Number**: Number like `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`

---

## 🔍 DEBUGGING TIPS

### Check if endpoints are working

```typescript
// In your component
try {
  const rounds = await tradingApi.listActiveRounds("colour");
  console.log("✅ Active rounds:", rounds);
} catch (error) {
  console.error("❌ API Error:", error.message);
}
```

### Common Error Messages

| Error                                 | Likely Cause               | Solution                  |
| ------------------------------------- | -------------------------- | ------------------------- |
| "Route not found"                     | Wrong endpoint             | Check this reference card |
| "Request failed with status code 401" | Auth token missing/expired | Re-login                  |
| "Request failed with status code 404" | Invalid round ID           | Verify round exists       |
| "Request failed with status code 422" | Invalid parameters         | Check request body format |

---

## 🎨 CONTEXT USAGE

### RoundsContext

```typescript
import { useRounds } from "@/contexts/RoundsContext";

const {
  colorActiveRounds, // Active color rounds
  colorUpcomingRounds, // Upcoming color rounds
  numberActiveRounds, // Active number rounds
  numberUpcomingRounds, // Upcoming number rounds
  selectedColorRoundId, // Selected color round
  selectedNumberRoundId, // Selected number round
  setSelectedColorRoundId,
  setSelectedNumberRoundId,
  fetchColorRounds, // Refresh color rounds
  fetchNumberRounds, // Refresh number rounds
  loading, // Loading state
} = useRounds();
```

### CartContext

```typescript
import { useCart } from "@/contexts/CartContext";

const {
  cart, // Cart items
  addItem, // Add to cart
  removeItem, // Remove from cart
  updateItemAmount, // Update amount
  clearCart, // Clear all items
  getCartTotal, // Get total amount
  getServiceCharge, // Get service charge (10%, min ₹5)
  validateCartBalance, // Check if balance sufficient
} = useCart();
```

---

## ✅ VERIFICATION CHECKLIST

After fixing endpoints, verify:

- [ ] Color Trading screen loads rounds without errors
- [ ] Number Trading screen loads rounds without errors
- [ ] Can place trades and see success message
- [ ] My Trades screen shows order history
- [ ] Dashboard loads without errors
- [ ] No 404 errors in console/LogBox
- [ ] Wallet balance updates after trades
- [ ] Earnings display correctly on dashboard

---

**All endpoints are now correct and match what's actually mounted in the backend server.js!** ✅
