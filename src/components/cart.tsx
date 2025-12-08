import { X, ChevronLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import products from "@/data/product";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, totalItems, updateQuantity, removeFromCart, addToCart } = useCart();

  // Use cart items directly from backend (already has images)
  const enhancedCartItems = cartItems.map((item: any) => {
    return {
      ...item,
      // Use image from backend cart item or populated product
      imageSrc: item.imageSrc || item.product?.images?.[0] || '',
    };
  });

  // Free delivery thresholds
  const REDUCED_DELIVERY_THRESHOLD = 249;
  const FREE_DELIVERY_THRESHOLD = 499;

  // Calculate delivery status
  const getDeliveryStatus = () => {
    if (totalPrice >= FREE_DELIVERY_THRESHOLD) {
      return {
        isFree: true,
        message: "FREE delivery unlocked!",
        progress: 100,
        deliveryCharge: 0
      };
    } else if (totalPrice >= REDUCED_DELIVERY_THRESHOLD) {
      const remaining = FREE_DELIVERY_THRESHOLD - totalPrice;
      return {
        isFree: false,
        message: `₹${remaining} away from FREE delivery`,
        progress: (totalPrice / FREE_DELIVERY_THRESHOLD) * 100,
        deliveryCharge: 50
      };
    } else {
      const remaining = REDUCED_DELIVERY_THRESHOLD - totalPrice;
      return {
        isFree: false,
        message: `₹${remaining} for ₹50 delivery`,
        progress: (totalPrice / FREE_DELIVERY_THRESHOLD) * 100,
        deliveryCharge: 60
      };
    }
  };

  const deliveryStatus = getDeliveryStatus();

  const handleContinueToCart = () => {
    navigate('/cart');
    onClose(); // Close the popup after navigation
  };

  const handleIncreaseQuantity = async (productId: string, currentQuantity: number, pack?: string) => {
    try {
      await updateQuantity(productId, currentQuantity + 1, pack);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleDecreaseQuantity = async (productId: string, currentQuantity: number, pack?: string) => {
    if (currentQuantity > 1) {
      try {
        await updateQuantity(productId, currentQuantity - 1, pack);
      } catch (error) {
        toast.error('Failed to update quantity');
      }
    }
  };

  const handleRemoveItem = async (productId: string, pack?: string, itemName?: string) => {
    try {
      await removeFromCart(productId, pack);
      toast.success(`${itemName} removed from cart`);
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleAddRecommendedProduct = async (product: any) => {
    try {
      const priceNumeric = parseInt(product.price.replace(/[^0-9]/g, ''));
      await addToCart(
        product.id,
        1,
        '1',
        priceNumeric,
        product.name,
        product.price,
        priceNumeric,
        product.imageSrc,
        product.weight
      );
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  // Get recommended products (filter out items already in cart)
  const recommendedProducts = products
    .filter(product => !cartItems.some(item => item.productId === product.id))
    .slice(0, 6);

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
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {enhancedCartItems.length === 0 ? (
              <div className="flex items-center justify-center p-8 text-gray-500">
                <p className="font-jost">Your cart is empty</p>
              </div>
            ) : (
              enhancedCartItems.map((item) => {
                const packLabel = item.pack === '1' ? 'Individual' : `Pack of ${item.pack}`;
                const itemTotal = (item.packPrice || item.priceNumeric) * item.quantity;

                return (
                  <motion.div
                    key={`${item.productId}-${item.pack}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white border-2 border-black rounded-lg p-3 shadow-sm"
                  >
                    {/* Product Card */}
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="w-20 h-20 border-2 border-black rounded-md flex-shrink-0 overflow-hidden bg-gray-50">
                        <img
                          src={item.imageSrc}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        {/* Product Name */}
                        <h3 className="font-suez text-sm font-bold text-black truncate">
                          {item.name}
                        </h3>

                        {/* Pack Label */}
                        <p className="font-jost text-xs text-gray-600 mt-0.5">
                          {packLabel}
                        </p>

                        {/* Weight */}
                        {item.weight && (
                          <p className="font-jost text-xs text-gray-500 mt-0.5">
                            {item.weight}
                          </p>
                        )}

                        {/* Price and Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDecreaseQuantity(item.productId, item.quantity, item.pack)}
                              disabled={item.quantity <= 1}
                              className={`w-7 h-7 flex items-center justify-center border-2 border-black rounded-md transition-all ${
                                item.quantity <= 1
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-white hover:bg-gray-100 active:scale-95'
                              }`}
                            >
                              <Minus size={14} />
                            </button>

                            <span className="font-suez text-sm font-bold min-w-[20px] text-center">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => handleIncreaseQuantity(item.productId, item.quantity, item.pack)}
                              className="w-7 h-7 flex items-center justify-center border-2 border-black rounded-md bg-white hover:bg-gray-100 active:scale-95 transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-suez text-sm font-bold text-black">
                              ₹{itemTotal}
                            </p>
                            {item.quantity > 1 && (
                              <p className="font-jost text-xs text-gray-500">
                                ₹{item.packPrice || item.priceNumeric} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemoveItem(item.productId, item.pack, item.name)}
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-all active:scale-95"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Recommended Products Section */}
          {recommendedProducts.length > 0 && (
            <div className="border-t-2 border-dashed border-black bg-gradient-to-b from-yellow-50 to-orange-50">
              <div className="p-3 pb-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <ShoppingBag size={16} className="text-[#F1B213]" />
                  <h3 className="font-suez text-sm font-bold text-black">
                    You Might Also Like
                  </h3>
                </div>

                {/* Horizontal scrollable product list */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {recommendedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex-shrink-0 w-[100px] bg-white border-2 border-black rounded-md overflow-hidden shadow-sm cursor-pointer"
                    >
                      {/* Product Image */}
                      <div className="relative h-[80px] bg-gray-50 border-b-2 border-black overflow-hidden">
                        <img
                          src={product.imageSrc}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-1.5">
                        <h4 className="font-suez text-[10px] font-bold text-black line-clamp-2 mb-0.5 h-7 leading-tight">
                          {product.name}
                        </h4>

                        <div className="flex flex-col gap-0.5">
                          <span className="font-suez text-xs font-bold text-black">
                            {product.price}
                          </span>

                          <button
                            onClick={() => handleAddRecommendedProduct(product)}
                            className="w-full bg-[#F1B213] text-white px-1.5 py-1 rounded text-[9px] font-suez font-bold hover:bg-[#E5A612] active:scale-95 transition-all"
                          >
                            ADD
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subtotal */}
          <div className="flex items-center justify-between p-4 border-t border-dashed border-black font-suez text-lg">
            <span>Subtotal ({totalItems} product{totalItems !== 1 ? "s" : ""})</span>
            <span>₹{totalPrice}</span>
          </div>

          {/* Free Delivery Progress Bar */}
          <div className="px-4 pb-3">
            <div className="p-3 border border-black rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-suez text-black">
                  {deliveryStatus.isFree ? '🎉 FREE Delivery!' : '🚚 Delivery'}
                </span>
                {!deliveryStatus.isFree && (
                  <span className="text-xs font-jost text-gray-600">
                    ₹{totalPrice} / ₹{FREE_DELIVERY_THRESHOLD}
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    deliveryStatus.isFree
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : deliveryStatus.deliveryCharge === 50
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gradient-to-r from-red-400 to-orange-400'
                  }`}
                  style={{ width: `${deliveryStatus.progress}%` }}
                ></div>
              </div>

              {/* Message */}
              <p className={`text-xs font-jost text-center ${deliveryStatus.isFree ? 'text-green-700 font-bold' : 'text-gray-700'}`}>
                {deliveryStatus.message}
              </p>

              {/* Milestones - Compact */}
              {!deliveryStatus.isFree && (
                <div className="flex justify-between mt-2 text-xs font-jost">
                  <span className={totalPrice >= REDUCED_DELIVERY_THRESHOLD ? 'text-green-600 font-bold' : 'text-gray-500'}>
                    ₹249
                  </span>
                  <span className={deliveryStatus.isFree ? 'text-green-600 font-bold' : 'text-gray-500'}>
                    ₹499
                  </span>
                </div>
              )}
            </div>
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