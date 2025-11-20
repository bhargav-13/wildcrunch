import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number, pack?: string, packPrice?: number, name?: string, price?: string, priceNumeric?: number, imageSrc?: string, weight?: string) => Promise<any>;
  updateQuantity: (productId: string, quantity: number, pack?: string) => Promise<void>;
  removeFromCart: (productId: string, pack?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'wildcrunch_guest_cart';

// Helper function to calculate cart totals
const calculateCartTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.packPrice || item.priceNumeric) * item.quantity, 0);
  return { totalItems, totalPrice };
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage on mount
  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } else {
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    }
  };

  // Save cart to localStorage
  const saveCart = (updatedCart: Cart) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      setCart(updatedCart);
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  };

  const addToCart = async (
    productId: string,
    quantity: number = 1,
    pack: string = '1',
    packPrice?: number,
    name?: string,
    price?: string,
    priceNumeric?: number,
    imageSrc?: string,
    weight?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const currentCart = cart || { items: [], totalItems: 0, totalPrice: 0 };

      // Check if same product with same pack already in cart
      const existingItemIndex = currentCart.items.findIndex(
        item => item.productId === productId && item.pack === pack
      );

      let updatedItems: CartItem[];

      if (existingItemIndex > -1) {
        // Update quantity
        updatedItems = [...currentCart.items];
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        const newItem: CartItem = {
          productId,
          name: name || '',
          price: price || '',
          priceNumeric: priceNumeric || 0,
          imageSrc: imageSrc || '',
          weight: weight || '',
          quantity,
          pack,
          packPrice: packPrice || priceNumeric || 0
        };
        updatedItems = [...currentCart.items, newItem];
      }

      const totals = calculateCartTotals(updatedItems);
      const updatedCart = {
        items: updatedItems,
        ...totals
      };

      saveCart(updatedCart);
      return { success: true, data: updatedCart };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to add to cart';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number, pack?: string) => {
    if (quantity < 1) return;

    try {
      setLoading(true);
      setError(null);

      const currentCart = cart || { items: [], totalItems: 0, totalPrice: 0 };

      // Find item by productId and pack
      const itemIndex = pack
        ? currentCart.items.findIndex(item => item.productId === productId && item.pack === pack)
        : currentCart.items.findIndex(item => item.productId === productId);

      if (itemIndex === -1) {
        throw new Error('Item not found in cart');
      }

      const updatedItems = [...currentCart.items];
      updatedItems[itemIndex].quantity = quantity;

      const totals = calculateCartTotals(updatedItems);
      const updatedCart = {
        items: updatedItems,
        ...totals
      };

      saveCart(updatedCart);
    } catch (err: any) {
      setError(err.message || 'Failed to update cart');
      console.error('Update cart error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string, pack?: string) => {
    try {
      setLoading(true);
      setError(null);

      const currentCart = cart || { items: [], totalItems: 0, totalPrice: 0 };

      // Remove specific pack variant if pack is provided, otherwise remove all variants
      let updatedItems: CartItem[];
      if (pack) {
        updatedItems = currentCart.items.filter(item => !(item.productId === productId && item.pack === pack));
      } else {
        updatedItems = currentCart.items.filter(item => item.productId !== productId);
      }

      const totals = calculateCartTotals(updatedItems);
      const updatedCart = {
        items: updatedItems,
        ...totals
      };

      saveCart(updatedCart);
    } catch (err: any) {
      setError(err.message || 'Failed to remove from cart');
      console.error('Remove from cart error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const emptyCart = { items: [], totalItems: 0, totalPrice: 0 };
      saveCart(emptyCart);
    } catch (err: any) {
      setError(err.message || 'Failed to clear cart');
      console.error('Clear cart error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const value: CartContextType = {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: loadCart,
    cartItems: cart?.items || [],
    totalItems: cart?.totalItems || 0,
    totalPrice: cart?.totalPrice || 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
