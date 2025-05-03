import api from './api';
import { Category } from './product.service';

export interface CategoryResponse {
  success: boolean;
  data: Category | Category[];
  message?: string;
}

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<CategoryResponse>('/categories');
    return response.data.data as Category[];
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
    throw error;
  }
};

const CategoryService = {
  getAllCategories,
  getCategoryBySlug
};

export default CategoryService;
