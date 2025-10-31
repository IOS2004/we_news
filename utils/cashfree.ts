import { CFPaymentGatewayService } from 'react-native-cashfree-pg-sdk';
import { getCurrentConfig, isDevelopment } from '../config/environment';

/**
 * Get CashFree environment from configuration
 * Uses environment-aware configuration
 */
const getCashfreeEnvironment = (): 'SANDBOX' | 'PRODUCTION' => {
  const config = getCurrentConfig();
  const env = config.cashfreeEnv;
  
  if (isDevelopment()) {
    console.log('💳 CashFree Environment:', env);
  }
  
  return env === 'PROD' ? 'PRODUCTION' : 'SANDBOX';
};

/**
 * Cashfree Payment Callbacks
 */
export interface CashfreePaymentCallbacks {
  onSuccess: (data: { orderId: string; status: string }) => void;
  onFailure: (error: { orderId: string; error: any }) => void;
  onError?: (error: { orderId: string; error: any }) => void;
}

// Global callback storage for managing payment callbacks
let globalCallbacks: CashfreePaymentCallbacks | null = null;

/**
 * Initialize Cashfree Payment Gateway
 * Call this once when app starts or before making any payments
 */
export const initializeCashfree = () => {
  try {
    console.log('🔄 Initializing CashFree SDK...');
    
    // Set the environment (SANDBOX or PROD) from environment variables
    const environment = getCashfreeEnvironment();
    
    // Set up global callbacks that handle all payment responses
    CFPaymentGatewayService.setCallback({
      onVerify: (orderID: string) => {
        console.log('✅ CashFree payment verified:', orderID);
        if (globalCallbacks) {
          globalCallbacks.onSuccess({
            orderId: orderID,
            status: 'SUCCESS',
          });
        }
      },
      onError: (error: any, orderID: string) => {
        console.error('❌ CashFree payment error:', error, orderID);
        if (globalCallbacks) {
          if (globalCallbacks.onError) {
            globalCallbacks.onError({
              orderId: orderID,
              error,
            });
          } else {
            globalCallbacks.onFailure({
              orderId: orderID,
              error,
            });
          }
        }
      },
    });

    console.log('✅ CashFree SDK initialized successfully with environment:', environment);
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize CashFree SDK:', error);
    throw error;
  }
};

/**
 * Simplified payment processing using just payment_session_id
 * This is the recommended approach as per Cashfree documentation
 * Uses doWebPayment method for native payment experience
 */
export const processCashfreePaymentSimple = async (
  orderId: string,
  paymentSessionId: string,
  callbacks: CashfreePaymentCallbacks
) => {
  try {
    // Ensure CashFree SDK is initialized
    console.log('🔄 Ensuring CashFree SDK is initialized...');
    initializeCashfree();

    // Validate required fields
    if (!orderId || !paymentSessionId) {
      const error = `Missing required payment parameters: orderId=${orderId ? 'present' : 'MISSING'}, paymentSessionId=${paymentSessionId ? 'present' : 'MISSING'}`;
      console.error(error);
      throw new Error(error);
    }

    // Validate payment session ID format (more flexible validation)
    if (!paymentSessionId || paymentSessionId.length < 10) {
      const error = `Invalid payment session ID: ${paymentSessionId}. Must be a valid session ID from CashFree`;
      console.error(error);
      throw new Error(error);
    }

    console.log('🚀 Initiating Cashfree payment with:', {
      orderId,
      paymentSessionId: paymentSessionId.substring(0, 20) + '...',
      environment: getCashfreeEnvironment(),
    });

    // Store callbacks globally for the SDK to use
    globalCallbacks = callbacks;

    // Prepare payment session object for Cashfree SDK
    // This is the correct format as per CashFree documentation
    const session = {
      payment_session_id: paymentSessionId,
      orderID: orderId,
      environment: getCashfreeEnvironment(),
    };

    console.log('📱 Opening Cashfree payment gateway with session:', session);

    // Open Cashfree payment gateway using doWebPayment
    try {
      const result = CFPaymentGatewayService.doWebPayment(session);
      console.log('✅ Cashfree doWebPayment initiated successfully, result:', result);
    } catch (sdkError) {
      console.error('💥 Cashfree SDK error:', sdkError);
      // Clear global callbacks on error
      globalCallbacks = null;
      throw sdkError;
    }
  } catch (error: any) {
    console.error('⚠️ Cashfree payment processing error:', error);
    // Clear global callbacks on error
    globalCallbacks = null;
    callbacks.onFailure({
      orderId: orderId,
      error: error.message || 'Failed to process payment',
    });
  }
};

/**
 * Clear global callbacks (useful for cleanup)
 */
export const clearCashfreeCallbacks = () => {
  globalCallbacks = null;
  console.log('🧹 CashFree callbacks cleared');
};

export default {
  initializeCashfree,
  processCashfreePaymentSimple,
  clearCashfreeCallbacks,
};
