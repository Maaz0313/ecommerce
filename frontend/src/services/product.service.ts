import axios from 'axios';

export const fetchProducts = async () => {
    const response = await axios.get('/api/products');
    return response.data;
};

export const getFeaturedProducts = async () => {
    const response = await axios.get('/api/products?featured=true');
    return response.data;
};

const ProductService = { fetchProducts, getFeaturedProducts };
export default ProductService;
