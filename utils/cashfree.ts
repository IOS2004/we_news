import { CFPaymentGatewayService } from 'react-native-cashfree-pg-sdk';

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
 * Call this once when app starts or before making any payments
 */
export const initializeCashfree = () => {
  try {
    // Set the environment (SANDBOX or PROD)
    const environment = __DEV__ ? 'SANDBOX' : 'PROD';
    
    CFPaymentGatewayService.setCallback({
      onVerify: (orderID: string) => {
        console.log('Cashfree payment verified:', orderID);
      },
      onError: (error: any, orderID: string) => {
        console.error('Cashfree payment error:', error, orderID);
      },
    });

    console.log('Cashfree SDK initialized with environment:', environment);
  } catch (error) {
    console.error('Failed to initialize Cashfree SDK:', error);
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

    console.log('Initiating Cashfree payment (simple) with:', {
      orderId,
      paymentSessionId: paymentSessionId.substring(0, 20) + '...',
      environment: __DEV__ ? 'SANDBOX' : 'PROD',
    });

    // Set up Cashfree callbacks
    CFPaymentGatewayService.setCallback({
      onVerify: (orderID: string) => {
        console.log('✅ Payment verified successfully:', orderID);
        callbacks.onSuccess({
          orderId: orderID,
          status: 'SUCCESS',
        });
      },
      onError: (error: any, orderID: string) => {
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

    // Prepare payment session object for Cashfree SDK
    // Using the same structure as your working project
    const session = {
      payment_session_id: paymentSessionId,
      orderID: orderId,
      environment: __DEV__ ? 'SANDBOX' : 'PROD',
    };

    console.log('📱 Opening Cashfree payment gateway with session:', session);

    // Open Cashfree payment gateway using doWebPayment
    try {
      const result = CFPaymentGatewayService.doWebPayment(session);
      console.log('🚀 Cashfree doWebPayment called, result:', result);
    } catch (sdkError) {
      console.error('💥 Cashfree SDK error:', sdkError);
      throw sdkError;
    }
  } catch (error: any) {
    console.error('⚠️ Cashfree payment processing error:', error);
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
