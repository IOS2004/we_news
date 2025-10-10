# Wallet Topup - Cashfree Integration

## Overview
This document describes the implementation of the wallet top-up feature integrated with Cashfree payment gateway.

## Implementation Summary

### 1. Wallet API Service (`services/walletApi.ts`)
Created a new service to handle wallet-related API calls:

- **Endpoint**: `POST {{baseUrl}}/wallet/topup`
- **Headers**: Automatically includes `Authorization: Bearer <token>` via API interceptor
- **Request Body**:
  ```json
  {
    "amount": 250,
    "paymentMethod": "cashfree"
  }
  ```

- **Response**: Returns transaction details including `payment_session_id` needed for Cashfree SDK

### 2. Cashfree Payment Utility (`utils/cashfree.ts`)
Created utility functions to integrate with Cashfree SDK:

#### Key Functions:
- `initializeCashfree()` - Initialize the SDK (optional, for app startup)
- `processCashfreePaymentSimple()` - Open Cashfree payment UI with session ID

#### Features:
- Automatic environment detection (SANDBOX for dev, PRODUCTION for prod)
- Comprehensive error handling
- Success/failure callbacks
- Payment verification

### 3. Add Money Screen Updates (`app/add-money.tsx`)
Updated the add-money screen to:

1. Call the wallet topup API when user clicks "Pay" button
2. Extract `payment_session_id` from the API response
3. Open Cashfree payment gateway using the SDK
4. Handle payment callbacks (success, failure, error)
5. Show appropriate toast messages
6. Navigate back on successful payment

## Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT FLOW                              │
└─────────────────────────────────────────────────────────────┘

1. User enters amount (e.g., ₹250)
          ↓
2. User clicks "Pay ₹250" button
          ↓
3. Frontend: POST /wallet/topup
   {
     "amount": 250,
     "paymentMethod": "cashfree"
   }
   Headers: { Authorization: "Bearer <token>" }
          ↓
4. Backend validates, creates transaction, calls Cashfree API
          ↓
5. Backend returns response with payment_session_id:
   {
     "success": true,
     "data": {
       "transactionId": "WALLET_1760069015600_B8B68EA8",
       "amounts": { finalAmount: 266, creditAmount: 250 },
       "paymentResponse": {
         "paymentData": {
           "payment_session_id": "session_abc123...",
           "order_id": "WALLET_1760069015600_B8B68EA8",
           ...
         }
       }
     }
   }
          ↓
6. Frontend extracts payment_session_id
          ↓
7. Frontend opens Cashfree SDK:
   processCashfreePaymentSimple(
     transactionId,
     payment_session_id,
     callbacks
   )
          ↓
8. Cashfree payment UI opens
          ↓
9. User completes payment
          ↓
10. Cashfree SDK triggers callback:
    - onSuccess: Show success message, navigate back
    - onFailure: Show error message
    - onError: Show error message
          ↓
11. Wallet balance updated ✅
```

## Key Features

### 1. Secure Authentication
- All API calls include Authorization header automatically
- Token is retrieved from AsyncStorage via API interceptor

### 2. Amount Validation
- Minimum amount: ₹10
- Maximum amount: ₹1,00,000
- Real-time validation before API call

### 3. Payment Method Support
All payment methods (UPI, Cards, Net Banking, Wallets) use Cashfree gateway:
- User can select preferred method in the UI
- All methods funnel to Cashfree which handles the actual payment processing
- Cashfree payment page shows all available options

### 4. Error Handling
- API errors displayed with toast notifications
- Payment failures handled gracefully
- Network errors caught and displayed
- Missing payment_session_id validation

### 5. User Feedback
- Loading state during API call ("Processing...")
- Success toast with credited amount
- Error toasts with specific messages
- Automatic navigation after success

## Usage Example

```typescript
// The integration is automatic - users just need to:

// 1. Enter amount
// 2. Click "Pay" button
// 3. Complete payment in Cashfree UI
// 4. Wallet is automatically updated
```

## Testing

### Test with Sandbox Environment
The app automatically uses Cashfree SANDBOX in development mode:

1. Run the app in development
2. Go to Add Money screen
3. Enter amount (e.g., ₹100)
4. Click "Pay ₹100"
5. Cashfree test payment page will open
6. Use test credentials to complete payment

### Cashfree Test Cards (Sandbox)
- **Success**: Card Number: 4111111111111111
- **Failure**: Card Number: 4012001037141112

## Files Modified/Created

### Created:
1. `services/walletApi.ts` - Wallet API service
2. `utils/cashfree.ts` - Cashfree payment utility

### Modified:
1. `app/add-money.tsx` - Integrated API and Cashfree SDK

## Environment Configuration

The app uses these environment variables (configured in backend):
- `CASHFREE_APP_ID` - Cashfree application ID
- `CASHFREE_SECRET_KEY` - Cashfree secret key
- `CASHFREE_ENV` - Environment (TEST/SANDBOX or PROD)

Frontend automatically detects environment:
- `__DEV__` → SANDBOX
- Production build → PRODUCTION

## Dependencies

### Already Installed:
- `react-native-cashfree-pg-sdk`: ^2.2.5
- `axios`: ^1.11.0
- `@react-native-async-storage/async-storage`: ^2.2.0

No new dependencies needed! ✅

## Security Considerations

1. **Token Management**: Auth token automatically included in headers
2. **HTTPS**: All API calls use HTTPS in production
3. **Payment Session**: Short-lived payment_session_id from backend
4. **No Sensitive Data**: Card details never touch our app/backend
5. **Cashfree PCI Compliance**: Payment processing handled by Cashfree

## Future Enhancements

- [ ] Add payment history screen
- [ ] Add refund functionality
- [ ] Support for multiple payment gateways
- [ ] Save preferred payment method
- [ ] Add payment retry mechanism
- [ ] Implement payment timeout handling

## Support

For issues related to:
- **API Integration**: Check backend logs and API response
- **Cashfree SDK**: Check Cashfree documentation and console logs
- **Payment Failures**: Check transaction status in backend database

## References

- [Cashfree Payment Gateway Docs](https://docs.cashfree.com/)
- [React Native Cashfree SDK](https://github.com/cashfree/react-native-cashfree-pg-sdk)
- Backend API: `/api/wallet/topup`
