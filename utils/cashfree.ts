import { CFPaymentGatewayService } from 'react-native-cashfree-pg-sdk';

/**
 * Get CashFree environment from environment variables
 * Defaults to SANDBOX if not specified
 */
const getCashfreeEnvironment = (): 'SANDBOX' | 'PROD' => {
  const env = process.env.EXPO_PUBLIC_CASHFREE_ENV?.toUpperCase();
  return env === 'PROD' ? 'PROD' : 'SANDBOX';
};

/**
 * Cashfree Payment Callbacks
 */
export interface CashfreePaymentCallbacks {
  onSuccess: (data: { orderId: string; status: string }) => void;
  onFailure: (error: { orderId: string; error: any }) => void;
  onError?: (error: { orderId: string; error: any }) => void;
}

/**
 * Initialize Cashfree Payment Gateway
 * This is optional - the SDK will auto-initialize if not called
 */
export const initializeCashfree = () => {
  try {
    const environment = getCashfreeEnvironment();
    console.log('✅ Cashfree environment set to:', environment);
    return true;
  } catch (error) {
    console.error('❌ Failed to set Cashfree environment:', error);
    return false;
  }
};

/**
 * Simplified payment processing using just payment_session_id
 * This is the recommended approach as per Cashfree documentation
 */
export const processCashfreePaymentSimple = async (
  orderId: string,
  paymentSessionId: string,
  callbacks: CashfreePaymentCallbacks
) => {
  try {
    // Validate required fields
    if (!orderId || !paymentSessionId) {
      const error = `Missing required payment parameters: orderId=${orderId ? 'present' : 'MISSING'}, paymentSessionId=${paymentSessionId ? 'present' : 'MISSING'}`;
      console.error(error);
      throw new Error(error);
    }

    console.log('🔄 Initiating Cashfree payment with:', {
      orderId,
      paymentSessionId: paymentSessionId.substring(0, 20) + '...',
      environment: getCashfreeEnvironment(),
    });

    // Wrap everything in try-catch to catch the real error
    try {
      // Set up Cashfree callbacks BEFORE opening payment
      console.log('Setting up CashFree callbacks...');
      
      CFPaymentGatewayService.setCallback({
        onVerify(orderID: string) {
          console.log('✅ Payment verified successfully:', orderID);
          callbacks.onSuccess({
            orderId: orderID,
            status: 'SUCCESS',
          });
        },
        onError(error: any, orderID: string) {
          console.error('❌ Payment error:', error, orderID);
          if (callbacks.onError) {
            callbacks.onError({
              orderId: orderID,
              error,
            });
          } else {
            callbacks.onFailure({
              orderId: orderID,
              error,
            });
          }
        },
      });

      console.log('Callbacks set successfully');

      // Prepare payment session object for Cashfree SDK
      const session = {
        payment_session_id: paymentSessionId,
        orderID: orderId,
        environment: getCashfreeEnvironment(),
      };

      console.log('📱 Attempting to open Cashfree payment gateway...');
      console.log('Session object:', JSON.stringify(session, null, 2));

      // Check if CFPaymentGatewayService exists and has doWebPayment
      if (!CFPaymentGatewayService) {
        throw new Error('CFPaymentGatewayService is not available');
      }

      if (typeof CFPaymentGatewayService.doWebPayment !== 'function') {
        throw new Error('doWebPayment method is not available on CFPaymentGatewayService');
      }

      // Open Cashfree payment gateway
      // Note: This is NOT async in the SDK - it returns void
      CFPaymentGatewayService.doWebPayment(session);
      
      console.log('🚀 Cashfree payment gateway opened successfully');
      
      // The actual payment result will come through callbacks (onVerify/onError)
      
    } catch (innerError: any) {
      console.error('💥 Inner error when opening payment gateway:', innerError);
      console.error('Error name:', innerError.name);
      console.error('Error message:', innerError.message);
      console.error('Error stack:', innerError.stack);
      throw innerError;
    }
    
  } catch (error: any) {
    console.error('⚠️ Cashfree payment processing error:', error);
    console.error('Error type:', typeof error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    callbacks.onFailure({
      orderId: orderId,
      error: error.message || 'Failed to process payment',
    });
  }
};

export default {
  initializeCashfree,
  processCashfreePaymentSimple,
};
