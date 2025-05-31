import api from './api';

export interface CreatePaymentIntentData {
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  client_secret: string;
  amount: number;
  message?: string;
}

export interface ConfirmPaymentData {
  payment_intent_id: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_zip_code: string;
  shipping_phone: string;
  notes?: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  message: string;
  payment_intent: string;
  amount: number;
  items: any[];
}

const StripeService = {
  createPaymentIntent: async (data: CreatePaymentIntentData): Promise<CreatePaymentIntentResponse> => {
    try {
      const response = await api.post<CreatePaymentIntentResponse>('/payment/create-intent', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  processPayment: async (paymentMethodId: string, items: { product_id: number; quantity: number }[]): Promise<{ success: boolean; message?: string; payment_intent?: string }> => {
    try {
      const response = await api.post('/payment/process', {
        payment_method_id: paymentMethodId,
        items: items
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default StripeService;
