import { Product } from './product.service';

export interface CartItem {
  product_id: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

const CART_STORAGE_KEY = 'ecommerce_cart';

const CartService = {
  getCart: (): Cart => {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (cartData) {
      return JSON.parse(cartData);
    }
    return { items: [], total: 0 };
  },

  saveCart: (cart: Cart): void => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  },

  addToCart: (product: Product, quantity: number = 1): Cart => {
    const cart = CartService.getCart();
    const existingItemIndex = cart.items.findIndex(item => item.product_id === product.id);

    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product_id: product.id,
        quantity,
        product,
      });
    }

    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    
    CartService.saveCart(cart);
    return cart;
  },

  updateQuantity: (productId: number, quantity: number): Cart => {
    const cart = CartService.getCart();
    const itemIndex = cart.items.findIndex(item => item.product_id === productId);

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
      }

      // Recalculate total
      cart.total = cart.items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
      
      CartService.saveCart(cart);
    }

    return cart;
  },

  removeFromCart: (productId: number): Cart => {
    const cart = CartService.getCart();
    const itemIndex = cart.items.findIndex(item => item.product_id === productId);

    if (itemIndex !== -1) {
      cart.items.splice(itemIndex, 1);
      
      // Recalculate total
      cart.total = cart.items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
      
      CartService.saveCart(cart);
    }

    return cart;
  },

  clearCart: (): Cart => {
    const emptyCart = { items: [], total: 0 };
    CartService.saveCart(emptyCart);
    return emptyCart;
  },

  getItemCount: (): number => {
    const cart = CartService.getCart();
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  },
};

export default CartService;
