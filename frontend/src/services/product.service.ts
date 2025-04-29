import axios from 'axios';

export const fetchProducts = async () => {
    console.log('Fetching products from API...');
    const response = await axios.get('/api/products');
    console.log('API Response:', response.data);
    return response.data;
};

export const getFeaturedProducts = async () => {
    const response = await axios.get('/api/products?featured=true');
    return response.data;
};

const ProductService = { fetchProducts, getFeaturedProducts };
export default ProductService;
