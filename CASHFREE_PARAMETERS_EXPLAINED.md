# Understanding CashFree Payment Parameters

## The Question: Why `undefined, undefined`?

In the original code:
```typescript
processCashFreePayment(
  transactionId,
  undefined, // paymentSessionId - backend should handle this
  undefined, // orderToken - backend should handle this
  handlePaymentSuccess,
  handlePaymentFailure,
  handlePaymentError
);
```

## The Problem

These `undefined` values were **placeholders** because I initially thought:
- The backend would handle CashFree order creation separately
- The frontend only needs the `transactionId`
- CashFree SDK would magically work with just the transaction ID

**This was WRONG!** ❌

## The Reality: How CashFree Actually Works

### Step 1: Backend Creates Order
When you call `POST /wallet/topup`, the backend:
1. Validates the request
2. Creates a pending transaction in your database
3. **Calls CashFree API** to create an order
4. Gets back important data from CashFree

### Step 2: CashFree Returns Critical Data
```javascript
// Backend calls CashFree API
const cashfreeResponse = await axios.post(
  'https://sandbox.cashfree.com/pg/orders',
  orderData,
  { headers: { 'x-client-id': ..., 'x-client-secret': ... } }
);

// CashFree returns:
{
  "payment_session_id": "session_abc123...",  // ⭐ CRITICAL!
  "order_token": "token_xyz789...",            // ⭐ CRITICAL!
  "order_id": "WALLET_1234567890_ABC",
  "order_status": "ACTIVE"
}
```

### Step 3: Frontend Needs This Data
The CashFree SDK **REQUIRES** these values to open the payment page:
```typescript
CFPaymentGatewayService.doWebPayment({
  orderId: transactionId,
  paymentSessionId: "session_abc123...",  // ❌ Was undefined!
  orderToken: "token_xyz789..."           // ❌ Was undefined!
});
```

## The Fix

### Before (Wrong) ❌
```typescript
const { transactionId, amounts } = response.data;

processCashFreePayment(
  transactionId,
  undefined,  // ❌ Missing payment session ID
  undefined,  // ❌ Missing order token
  ...callbacks
);
```

### After (Correct) ✅
```typescript
const { transactionId, amounts, paymentResponse } = response.data;

// Extract the critical CashFree data from backend response
const paymentSessionId = paymentResponse?.paymentData?.payment_session_id;
const orderToken = paymentResponse?.paymentData?.order_token;

processCashFreePayment(
  transactionId,
  paymentSessionId,  // ✅ Actual session ID from CashFree
  orderToken,        // ✅ Actual order token from CashFree
  ...callbacks
);
```

## Complete Flow Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                    CASHFREE PAYMENT FLOW                        │
└────────────────────────────────────────────────────────────────┘

1. User Enters Amount (₹250)
          ↓
2. Frontend: POST /wallet/topup
   {
     "amount": 250,
     "paymentMethod": "cashfree"
   }
          ↓
3. Backend Receives Request
          ↓
4. Backend Validates & Creates Transaction
   transactionId = "WALLET_1234567890_ABC"
          ↓
5. Backend Calls CashFree API
   POST https://sandbox.cashfree.com/pg/orders
   {
     "order_id": "WALLET_1234567890_ABC",
     "order_amount": 266,  // with GST
     "customer_details": { ... }
   }
   Headers: {
     "x-client-id": "your_cashfree_app_id",
     "x-client-secret": "your_cashfree_secret"
   }
          ↓
6. CashFree Creates Order & Returns:
   {
     "payment_session_id": "session_abc123xyz",  ⭐
     "order_token": "token_xyz789abc",           ⭐
     "order_id": "WALLET_1234567890_ABC",
     "order_status": "ACTIVE"
   }
          ↓
7. Backend Sends Response to Frontend:
   {
     "success": true,
     "data": {
       "transactionId": "WALLET_1234567890_ABC",
       "amounts": { ... },
       "paymentResponse": {
         "paymentGateway": "cashfree",
         "paymentData": {
           "payment_session_id": "session_abc123xyz",  ⭐
           "order_token": "token_xyz789abc"            ⭐
         }
       }
     }
   }
          ↓
8. Frontend Extracts Critical Values:
   paymentSessionId = "session_abc123xyz"
   orderToken = "token_xyz789abc"
          ↓
9. Frontend Opens CashFree SDK:
   CFPaymentGatewayService.doWebPayment({
     orderId: "WALLET_1234567890_ABC",
     paymentSessionId: "session_abc123xyz",  ✅
     orderToken: "token_xyz789abc"           ✅
   })
          ↓
10. CashFree SDK Opens Payment UI
    (User completes payment)
          ↓
11. CashFree Calls Backend Webhook
          ↓
12. Backend Updates Transaction Status
          ↓
13. Frontend onVerify Callback Triggered
          ↓
14. Wallet Balance Updated ✅
```

## Why These Values Are Required

### `payment_session_id`
- **Purpose**: Identifies the payment session in CashFree's system
- **Created by**: CashFree when backend creates an order
- **Used by**: CashFree SDK to authenticate and load payment page
- **Expires**: After a certain time or when payment is completed

### `order_token`
- **Purpose**: Security token to authorize payment initiation
- **Created by**: CashFree as a JWT token
- **Used by**: CashFree SDK to verify the request is legitimate
- **Contains**: Encrypted order details and authorization

### `orderId` (transactionId)
- **Purpose**: Links the payment to your database transaction
- **Created by**: Your backend
- **Used by**: Both systems to track and match the payment

## API Response Structure

```typescript
// Full backend response structure
interface TopupResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;                    // Your transaction ID
    amounts: {
      originalAmount: 250,
      discountAmount: 25,
      discountedAmount: 225,
      gstAmount: 41,
      finalAmount: 266,
      creditAmount: 250
    };
    paymentResponse: {
      paymentGateway: "cashfree";
      paymentUrl?: string;                    // Optional payment link
      paymentData: {
        payment_session_id: string;           // ⭐ CRITICAL
        order_token: string;                  // ⭐ CRITICAL
        order_id: string;
        order_status: string;
        cf_order_id: string;
        // ... other CashFree fields
      }
    };
    userDetails: {
      name: string;
      email: string;
      phone: string;
    }
  }
}
```

## Common Mistakes to Avoid

### ❌ Mistake 1: Passing undefined
```typescript
CFPaymentGatewayService.doWebPayment({
  orderId: transactionId,
  paymentSessionId: undefined,  // ❌ SDK will fail!
  orderToken: undefined         // ❌ SDK will fail!
});
```

### ❌ Mistake 2: Using transactionId as session ID
```typescript
CFPaymentGatewayService.doWebPayment({
  orderId: transactionId,
  paymentSessionId: transactionId,  // ❌ Wrong! Not the same thing
  orderToken: transactionId         // ❌ Wrong! Not the same thing
});
```

### ❌ Mistake 3: Not extracting from response
```typescript
const { transactionId } = response.data;
// ❌ Ignoring paymentResponse that contains the critical data!
```

### ✅ Correct Approach
```typescript
const { transactionId, amounts, paymentResponse } = response.data;

const paymentSessionId = paymentResponse?.paymentData?.payment_session_id;
const orderToken = paymentResponse?.paymentData?.order_token;

// Validate before proceeding
if (!paymentSessionId) {
  throw new Error('Payment session ID not received from backend');
}

CFPaymentGatewayService.doWebPayment({
  orderId: transactionId,
  paymentSessionId: paymentSessionId,  // ✅ Correct
  orderToken: orderToken               // ✅ Correct
});
```

## Backend Configuration Required

For this to work, your backend `.env` must have:

```env
# CashFree Configuration
CASHFREE_APP_ID=your_actual_cashfree_app_id_here
CASHFREE_SECRET_KEY=your_actual_cashfree_secret_key_here
CASHFREE_ENV=SANDBOX  # or PRODUCTION

# Backend URL for webhooks
BACKEND_DOMAIN=http://192.168.137.1:5000
```

## Testing

### Test in Sandbox Mode
1. Set `CASHFREE_ENV=SANDBOX`
2. Use CashFree test credentials
3. Test cards will work without real money

### Test Cards (Sandbox)
- **Success**: 4111 1111 1111 1111
- **Failure**: 4007 0000 0002 7
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Summary

| Parameter | Source | Purpose |
|-----------|--------|---------|
| `transactionId` | Your Backend | Track transaction in your DB |
| `payment_session_id` | CashFree API | Authenticate payment session |
| `order_token` | CashFree API | Authorize payment initiation |

**Key Takeaway**: The `undefined` values were a placeholder mistake. The backend creates the CashFree order and returns the real session ID and token, which the frontend MUST use to open the payment SDK.

**Now Fixed**: ✅ Frontend correctly extracts and uses these values!
