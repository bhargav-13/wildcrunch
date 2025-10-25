import { useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface WishlistItem {
  productId: string;
  product: any;
  addedAt: Date;
}

interface Wishlist {
  _id: string;
  items: WishlistItem[];
}

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await wishlistAPI.get();
      
      if (response.data.success) {
        setWishlist(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch wishlist');
      console.error('Fetch wishlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      throw new Error('Please login to manage wishlist');
    }

    try {
      setLoading(true);
      setError(null);
      const response = await wishlistAPI.toggle(productId);
      
      if (response.data.success) {
        setWishlist(response.data.data);
        return response.data.action; // 'added' or 'removed'
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update wishlist';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to wishlist');
    }

    try {
      setLoading(true);
      setError(null);
      const response = await wishlistAPI.add(productId);
      
      if (response.data.success) {
        setWishlist(response.data.data);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to add to wishlist';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await wishlistAPI.remove(productId);
      
      if (response.data.success) {
        setWishlist(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove from wishlist');
      console.error('Remove from wishlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist?.items?.some(item => item.productId === productId) || false;
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  return {
    wishlist,
    loading,
    error,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    refreshWishlist: fetchWishlist,
    isInWishlist,
    wishlistItems: wishlist?.items || [],
    wishlistCount: wishlist?.items?.length || 0,
  };
};
