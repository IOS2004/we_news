import api, { ApiResponse } from './api';

// Wallet topup interfaces
export interface TopupRequest {
  amount: number;
  paymentMethod: 'cashfree' | 'easebuzz';
}

export interface TopupResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    amounts: {
      originalAmount: number;
      discountAmount: number;
      discountedAmount: number;
      gstAmount: number;
      finalAmount: number;
      creditAmount: number;
    };
    paymentResponse: {
      paymentGateway: string;
      paymentUrl?: string;
      paymentData: {
        cf_order_id: number;
        created_at: string;
        customer_details: {
          customer_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          customer_uid: string | null;
        };
        entity: string;
        order_amount: number;
        order_currency: string;
        order_expiry_time: string;
        order_id: string;
        order_meta: {
          return_url: string;
          notify_url: string;
          payment_methods: string | null;
        };
        order_note: string | null;
        order_splits: any[];
        order_status: string;
        order_tags: string | null;
        payment_session_id: string;
        payments: {
          url: string;
        };
        refunds: {
          url: string;
        };
        settlements: {
          url: string;
        };
        terminal_data: any | null;
      };
    };
    userDetails: {
      name: string;
      email: string;
      phone: string;
    };
  };
}

export interface WalletBalance {
  balance: number;
  currency: string;
}

/**
 * Wallet API Service
 * Handles all wallet-related API calls
 */
const walletApi = {
  /**
   * Initiate wallet topup
   * @param request - Topup request with amount and payment method
   * @returns TopupResponse with payment details and session ID
   */
  async topup(request: TopupRequest): Promise<TopupResponse> {
    try {
      console.log('🚀 [Wallet API] Sending topup request:', JSON.stringify(request, null, 2));
      
      const response = await api.post<TopupResponse>('/wallet/topup', request);
      
      console.log('✅ [Wallet API] Topup response received:');
      console.log('📦 Full Response:', JSON.stringify(response.data, null, 2));
      console.log('💰 Transaction ID:', response.data.data?.transactionId);
      console.log('💵 Amounts:', response.data.data?.amounts);
      console.log('🏦 Payment Gateway:', response.data.data?.paymentResponse?.paymentGateway);
      console.log('🔑 Payment Session ID:', response.data.data?.paymentResponse?.paymentData?.payment_session_id);
      console.log('📋 Order ID:', response.data.data?.paymentResponse?.paymentData?.order_id);
      console.log('🌐 Payment URL:', response.data.data?.paymentResponse?.paymentUrl);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ [Wallet API] Topup error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get wallet balance
   * @returns Current wallet balance
   */
  async getBalance(): Promise<WalletBalance> {
    try {
      const response = await api.get<ApiResponse<WalletBalance>>('/wallet/balance');
      return response.data.data!;
    } catch (error: any) {
      console.error('Get wallet balance error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get wallet transaction history
   * @param limit - Number of transactions to fetch (default: 50)
   * @param skip - Number of transactions to skip (default: 0)
   * @param type - Filter by transaction type (credit, debit, refund, cashback)
   * @param status - Filter by status (pending, success, failed)
   * @returns Transaction history response
   */
  async getTransactions(params?: {
    limit?: number;
    skip?: number;
    type?: 'credit' | 'debit' | 'refund' | 'cashback';
    status?: 'pending' | 'success' | 'failed';
  }): Promise<{
    transactions: any[];
    totalTransactions: number;
    currentBalance: number;
    formattedBalance: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.skip) queryParams.append('skip', params.skip.toString());
      if (params?.type) queryParams.append('type', params.type);
      if (params?.status) queryParams.append('status', params.status);
      
      const url = `/wallet/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{
        success: boolean;
        message: string;
        data: {
          transactions: any[];
          totalTransactions: number;
          currentBalance: number;
          formattedBalance: string;
        };
      }>(url);
      
      return response.data.data;
    } catch (error: any) {
      console.error('Get transactions error:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default walletApi;
