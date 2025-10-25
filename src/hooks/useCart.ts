import { useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface CartItem {
  productId: string;
  name: string;
  price: string;
  priceNumeric: number;
  imageSrc: string;
  weight: string;
  quantity: number;
  pack?: string;
  packPrice?: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.get();
      
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1, pack?: string, packPrice?: number) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to cart');
    }

    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.add({ productId, quantity, pack, packPrice });
      
      if (response.data.success) {
        setCart(response.data.data);
        return response.data;
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to add to cart';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number, pack?: string) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.update(productId, quantity, pack);
      
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update cart');
      console.error('Update cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string, pack?: string) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.remove(productId, pack);
      
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove from cart');
      console.error('Remove from cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.clear();
      
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      console.error('Clear cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
    cartItems: cart?.items || [],
    totalItems: cart?.totalItems || 0,
    totalPrice: cart?.totalPrice || 0,
  };
};
