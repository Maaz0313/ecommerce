import axios from 'axios';
import api from './api';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  quantity: number;
  image: string | null;
  category_id: number;
  is_active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductResponse {
  success: boolean;
  data: Product | Product[];
  message?: string;
}

export const fetchProducts = async () => {
  try {
    const response = await api.get<ProductResponse>('/products');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get<ProductResponse>('/products?featured=true');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  try {
    // First get all products
    const response = await api.get<ProductResponse>('/products');
    const products = response.data.data as Product[];

    // Find the product with the matching slug
    const product = products.find(p => p.slug === slug);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  } catch (error) {
    throw error;
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<ProductResponse>('/products');
    return response.data.data as Product[];
  } catch (error) {
    throw error;
  }
};

const ProductService = {
  fetchProducts,
  getFeaturedProducts,
  getProductBySlug,
  getAllProducts
};

export default ProductService;
