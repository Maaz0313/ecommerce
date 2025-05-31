import api from './api';
import { Product } from './product.service';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'canceled';
  payment_method: 'cash';
  payment_status: 'pending' | 'paid' | 'failed';
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_zip_code: string;
  shipping_phone: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderResponse {
  success: boolean;
  data: Order | Order[];
  message?: string;
}

export interface CartItem {
  product_id: number;
  quantity: number;
  product: Product;
}

export interface CreateOrderData {
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_zip_code: string;
  shipping_phone: string;
  payment_method: 'cash' | 'credit_card';
  notes?: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

const OrderService = {
  getAllOrders: async (): Promise<Order[]> => {
    try {
      const response = await api.get<OrderResponse>('/orders');
      return response.data.data as Order[];
    } catch (error) {
      throw error;
    }
  },

  getOrderById: async (id: number): Promise<Order> => {
    try {
      const response = await api.get<OrderResponse>(`/orders/${id}`);
      return response.data.data as Order;
    } catch (error) {
      throw error;
    }
  },

  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    try {
      const response = await api.post<OrderResponse>('/orders', orderData);
      return response.data.data as Order;
    } catch (error) {
      throw error;
    }
  },

  updateOrder: async (id: number, notes: string): Promise<Order> => {
    try {
      const response = await api.put<OrderResponse>(`/orders/${id}`, { notes });
      return response.data.data as Order;
    } catch (error) {
      throw error;
    }
  },

  cancelOrder: async (id: number): Promise<Order> => {
    try {
      const response = await api.post<OrderResponse>(`/orders/${id}/cancel`);
      return response.data.data as Order;
    } catch (error) {
      throw error;
    }
  },
};

export default OrderService;
