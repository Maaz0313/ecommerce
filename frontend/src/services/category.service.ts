import api from './api';
import { Category } from './product.service';

export interface CategoryResponse {
  success: boolean;
  data: Category | Category[];
  message?: string;
}

export const getAllCategories = async (): Promise<CategoryResponse> => {
  try {
    const response = await api.get<CategoryResponse>('/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  try {
    // First get all categories
    const response = await api.get<CategoryResponse>('/categories');
    const categories = response.data.data as Category[];

    // Find the category with the matching slug
    const category = categories.find(c => c.slug === slug);

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    throw error;
  }
};

const CategoryService = {
  getAllCategories,
  getCategoryBySlug
};

export default CategoryService;
