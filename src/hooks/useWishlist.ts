import { useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';

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

  const fetchWishlist = async () => {
    // Wishlist disabled - requires authentication
    return;
  };

  const toggleWishlist = async (productId: string) => {
    // Wishlist disabled for guest checkout
    throw new Error('Wishlist feature is not available in guest mode');
  };

  const addToWishlist = async (productId: string) => {
    // Wishlist disabled for guest checkout
    throw new Error('Wishlist feature is not available in guest mode');
  };

  const removeFromWishlist = async (productId: string) => {
    // Wishlist disabled for guest checkout
    return;
  };

  const isInWishlist = (productId: string): boolean => {
    // Always return false since wishlist is disabled
    return false;
  };

  useEffect(() => {
    // No need to fetch wishlist for guest users
  }, []);

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
