import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { Product } from "@/data/product";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    // ✅ Load from localStorage on init
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => [...prev, product]);
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => String(item.id) !== id));
  };

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.find((item) => String(item.id) === String(product.id));
    if (exists) removeFromWishlist(String(product.id));
    else addToWishlist(product);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
