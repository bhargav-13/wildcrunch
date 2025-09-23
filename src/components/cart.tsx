import { X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import img1 from "@/assets/1.png"
import img2 from "@/assets/2.png"
// Mock cart data for now
const cartItems = [
  {
    id: "1",
    name: "Salt & Pepper Makhana",
    price: 200,
    quantity: 1,
    imageSrc: img1,
  },
  {
    id: "2",
    name: "Indian Masala Puffs",
    price: 40,
    quantity: 1,
    imageSrc: img2,
  },
];

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const navigate = useNavigate();
  
  // subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
          className="fixed top-0 right-0 w-[400px] h-full bg-[#F8F7E5] shadow-2xl z-50 flex flex-col"
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
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border-b border-dashed border-black">
                <div className="flex items-center gap-3">
                  {/* Product Image with black border */}
                  <div className="w-16 h-16 border border-black flex items-center justify-center">
                    <img src={item.imageSrc} alt={item.name} className="max-w-full max-h-full" />
                  </div>
                  {/* Name and quantity */}
                  <div>
                    <p className="font-suez text-sm">{item.quantity}x {item.name}</p>
                  </div>
                </div>
                {/* Price */}
                <p className="font-suez text-sm">₹{item.price}</p>
              </div>
            ))}
          </div>

          {/* Subtotal */}
          <div className="flex items-center justify-between p-4 border-t border-dashed border-black font-suez text-lg">
            <span>Subtotal ({cartItems.length} product{cartItems.length > 1 ? "s" : ""})</span>
            <span>₹{subtotal}</span>
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