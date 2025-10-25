import { X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import localProducts from "@/data/product";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, totalItems } = useCart();
  
  // Merge cart items with local product data for images
  const enhancedCartItems = cartItems.map(item => {
    const localProduct = localProducts.find(p => p.id === item.productId);
    return {
      ...item,
      imageSrc: localProduct?.imageSrc || item.imageSrc,
    };
  });

  const handleContinueToCart = () => {
    navigate('/cart');
    onClose(); // Close the popup after navigation
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 right-0 w-[400px] h-full bg-[#F8F7E5] shadow-2xl z-[9999] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dashed border-black font-suez text-lg">
            <span>Product Added To Cart</span>
            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-auto">
            {enhancedCartItems.length === 0 ? (
              <div className="flex items-center justify-center p-8 text-gray-500">
                <p className="font-jost">Your cart is empty</p>
              </div>
            ) : (
              enhancedCartItems.map((item) => {
                const packLabel = item.pack === '1' ? '' : ` (Pack of ${item.pack})`;
                return (
                <div key={`${item.productId}-${item.pack}`} className="flex items-center justify-between p-4 border-b border-dashed border-black">
                  <div className="flex items-center gap-3">
                    {/* Product Image with black border */}
                    <div className="w-16 h-16 border border-black flex items-center justify-center">
                      <img src={item.imageSrc} alt={item.name} className="max-w-full max-h-full" />
                    </div>
                    {/* Name, pack, and quantity */}
                    <div>
                      <p className="font-suez text-sm">{item.quantity}x {item.name}</p>
                      {packLabel && <p className="font-jost text-xs text-gray-600">{packLabel}</p>}
                    </div>
                  </div>
                  {/* Price */}
                  <p className="font-suez text-sm">₹{item.packPrice || item.priceNumeric}</p>
                </div>
                );
              })
            )}
          </div>

          {/* Subtotal */}
          <div className="flex items-center justify-between p-4 border-t border-dashed border-black font-suez text-lg">
            <span>Subtotal ({totalItems} product{totalItems !== 1 ? "s" : ""})</span>
            <span>₹{totalPrice}</span>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between p-4">
            <button 
              className="flex items-center gap-2 text-sm font-suez text-black"
              onClick={onClose}
            >
              <ChevronLeft size={16} />
              Continue Shopping
            </button>
            <button 
              className="bg-[#F1B213] text-white px-4 py-2 rounded-full text-sm font-suez hover:bg-[#E5A612] transition-colors"
              onClick={handleContinueToCart}
            >
              Continue to Cart
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart;