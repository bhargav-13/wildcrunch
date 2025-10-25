import React, { useState, useEffect } from 'react';
import { ChevronLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import localProducts from '@/data/product';
import { ordersAPI } from '@/services/api';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, loading, updateQuantity, removeFromCart, refreshCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your cart');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated]);

  const handleUpdateQuantity = async (productId: string, newQuantity: number, pack?: string) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity, pack);
      toast.success('Cart updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (productId: string, pack?: string) => {
    try {
      await removeFromCart(productId, pack);
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  // Create unpaid order and navigate to address page
  const handleCheckout = async () => {
    try {
      setCreatingOrder(true);
      
      console.log('🛒 Creating order from cart...');
      
      // Create unpaid order from cart (Step 1)
      const response = await ordersAPI.createFromCart();
      
      console.log('✅ Order creation response:', response.data);
      
      if (response.data.success) {
        const order = response.data.data.order;
        console.log('✅ Order created successfully:', order._id);
        toast.success('Order created! Please add shipping address.');
        // Navigate to address page with order ID
        navigate(`/address?orderId=${order._id}`);
      } else {
        console.error('❌ Order creation failed:', response.data);
        toast.error(response.data.message || 'Failed to create order');
        setCreatingOrder(false);
      }
    } catch (error: any) {
      console.error('❌ Checkout error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      // Show specific error message
      const errorMessage = error.response?.data?.message || 'Failed to create order. Please try again.';
      toast.error(errorMessage);
      setCreatingOrder(false);
    }
  };

  const rawCartItems = cart?.items || [];
  
  // Merge cart items with local product data for images
  const cartItems = rawCartItems.map(item => {
    const localProduct = localProducts.find(p => p.id === item.productId);
    const packLabel = item.pack === '1' ? 'Individual' : item.pack === '2' ? 'Pack of 2' : item.pack === '4' ? 'Pack of 4' : '';
    return {
      ...item,
      imageSrc: localProduct?.imageSrc || item.imageSrc,
      packLabel,
      displayPrice: item.packPrice || item.priceNumeric,
    };
  });
  
  const subtotal = cart?.totalPrice || 0;
  const deliveryCharge = 60;
  const total = subtotal + deliveryCharge;
  const totalQuantity = cart?.totalItems || 0;

  // Progress steps
  const steps = [
    { name: 'Bag', completed: true, active: true },
    { name: 'Address', completed: false, active: false },
    { name: 'Payment', completed: false, active: false },
    { name: 'Confirm', completed: false, active: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7E5]">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C06441]"></div>
        </div>
      </div>
    );
  }

  // Full screen loader while creating order
  if (creatingOrder) {
    return (
      <div className="min-h-screen bg-[#F8F7E5]">
        <Header />
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#F1B213] mb-4"></div>
          <p className="text-xl font-suez text-black">Creating order with Razorpay...</p>
          <p className="text-sm font-jost text-gray-600 mt-2">Please wait, this may take a moment</p>
        </div>
      </div>
    );
  }

  if (!cart || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F7E5]">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl font-suez mb-4">Your cart is empty</h2>
          <p className="text-lg font-jost mb-8">Add some products to get started!</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-[#F1B213] text-white px-8 py-3 rounded-full font-suez hover:bg-[#E5A612] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7E5]">
      <Header />

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-8 mt-24">
<div className="flex items-center justify-center mb-8 relative w-full">
  {/* Gray background line */}
  <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-300 z-0"></div>

  {/* Black progress line */}
  <div
    className="absolute top-2 left-0 h-0.5 bg-black transition-all duration-500 z-0"
    style={{
      width: `${(steps.findIndex(step => step.active) / (steps.length - 1)) * 100}%`,
    }}
  ></div>

  {/* Steps */}
  <div className="flex items-center justify-between w-full max-w-3xl relative z-10">
    {steps.map((step, index) => (
      <div key={step.name} className="flex flex-col items-center">
        {/* Circle */}
        <div
          className={`w-4 h-4 rounded-full border-2 border-white ${
            step.active
              ? "bg-black"
              : step.completed
              ? "bg-black"
              : "bg-gray-300"
          }`}
        ></div>
        {/* Label */}
        <span className="text-sm mt-2 font-medium">{step.name}</span>
      </div>
    ))}
  </div>
</div>



        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Left Side - Your Order */}
          <div>
            <h1 className="text-3xl font-bold mb-8 text-black font-suez">Your Order</h1>
            
            {/* Cart Items */}
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <div key={`${item.productId}-${item.pack}`}>
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="w-32 h-32 border border-black flex items-center justify-center bg-white flex-shrink-0">
                      <img 
                        src={item.imageSrc} 
                        alt={item.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    {/* Product Name */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-suez">{item.name}</h3>
                      <p className="text-sm font-jost text-gray-600">{item.weight}</p>
                      {item.packLabel && item.pack !== '1' && (
                        <p className="text-sm font-jost text-[#F1B213] mt-1">{item.packLabel}</p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-black">
                      <button 
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, item.pack)}
                        className="p-2 hover:bg-gray-100"
                        disabled={loading}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 min-w-[50px] text-center font-suez">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, item.pack)}
                        className="p-2 hover:bg-gray-100"
                        disabled={loading}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => handleRemoveItem(item.productId, item.pack)}
                      className="p-2 hover:bg-gray-100 rounded"
                      disabled={loading}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    {/* Price */}
                    <div className="text-lg font-medium font-suez w-20 text-right">₹{item.displayPrice}</div>
                  </div>
                  
                  <div className="border-b border-dashed border-black my-6"></div>
                </div>
              ))}
            </div>

            {/* Coupon Section */}
            <div className="mt-6 p-1 border border-dashed border-black rounded-full w-[500px]">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Apply coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-transparent border-none outline-none text-black placeholder-gray-500 font-suez text-sm"
                />
                <button className="bg-[#F1B213] text-white px-4 py-2 rounded-full font-medium hover:bg-[#E5A612] transition-colors font-suez text-sm">
                  APPLY
                </button>
              </div>
            </div>

            {/* Continue Shopping */}
            <button 
              onClick={() => window.location.href = '/products'}
              className="flex items-center gap-2 mt-6 text-black hover:text-[#F1B213] transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium font-suez">Continue Shopping</span>
            </button>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:pl-8">
            {/* Dashed line separator */}
            <div className="border-l border-dashed border-black h-[500px] absolute left-1/2 transform -translate-x-1/2 top-42"></div>
            
            <h2 className="text-3xl font-bold mb-8 text-black font-suez">Order Summary</h2>
            
            <div className="space-y-6">
              {/* Summary Items */}
              {cartItems.map((item) => (
                <div key={`summary-${item.productId}-${item.pack}`} className="flex justify-between items-center">
                  <span className="text-lg font-suez">×{item.quantity} {item.name}{item.pack !== '1' ? ` (${item.packLabel})` : ''}</span>
                  <span className="text-lg font-medium font-jost">₹{(item.displayPrice * item.quantity)}.00</span>
                </div>
              ))}
              
              <div className="border-b border-dashed border-black my-6"></div>
              
              {/* Totals */}
              <div className="flex justify-between items-center text-lg">
                <span className="font-suez">Subtotal</span>
                <span className="font-medium font-jost">₹{subtotal}.00</span>
              </div>
              
              <div className="border-b border-dashed border-black my-6"></div>
              
              <div className="flex justify-between items-center text-lg">
                <span className="font-suez">Delivery charge</span>
                <span className="font-medium font-jost">₹{deliveryCharge}.00</span>
              </div>
              
              <div className="border-b border-dashed border-black my-6"></div>
              
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="font-suez">Total:</span>
                <span className="font-jost">₹{total}.00</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mt-8">
                <button 
                  onClick={handleCheckout}
                  disabled={creatingOrder || cartItems.length === 0}
                  className="w-full bg-[#F1B213] text-white py-3 rounded-full text-lg font-medium hover:bg-[#E5A612] transition-colors font-suez disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingOrder ? 'Creating Order...' : 'Next Step'}
                </button>
                <button 
                  onClick={() => window.location.href = '/products'}
                  className="w-full text-black py-3 text-lg font-medium hover:text-[#F1B213] transition-colors font-suez"
                  disabled={creatingOrder}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <h1 className="text-2xl font-bold mb-6 text-black font-suez">Your Order</h1>
          
          {/* Cart Items */}
          <div className="space-y-4 mb-8">
              {cartItems.map((item, index) => (
              <div key={`${item.productId}-${item.pack}`}>
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 border border-black flex items-center justify-center bg-white flex-shrink-0">
                    <img 
                      src={item.imageSrc} 
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* Product Name */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold font-suez">{item.name}</h3>
                    {item.packLabel && item.pack !== '1' && (
                      <p className="text-xs font-jost text-[#F1B213]">{item.packLabel}</p>
                    )}
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-black">
                    <button 
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, item.pack)}
                      className="p-1"
                      disabled={loading}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 py-1 text-sm font-suez">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, item.pack)}
                      className="p-1"
                      disabled={loading}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => handleRemoveItem(item.productId, item.pack)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Price */}
                  <div className="text-lg font-medium font-suez">₹{item.displayPrice}</div>
                </div>
                
                <div className="border-b border-dashed border-black my-4"></div>
              </div>
            ))}
          </div>

          {/* Coupon Section */}
          <div className="mb-6 p-1 border border-dashed border-black rounded-full">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Apply coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent border-none outline-none text-black placeholder-gray-500 text-sm font-suez"
              />
              <button className="bg-[#F1B213] text-white px-4 py-2 rounded-full text-sm font-medium font-suez">
                APPLY
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-4 rounded-lg border border-black mb-6">
            <h3 className="text-xl font-bold mb-4 font-suez">Order Summary</h3>
            
            {cartItems.map((item) => (
              <div key={`mobile-summary-${item.productId}`} className="flex justify-between mb-2">
                <span className="text-sm font-suez">×{item.quantity} {item.name}</span>
                <span className="text-sm font-medium font-suez">₹{(item.priceNumeric * item.quantity)}.00</span>
              </div>
            ))}
            
            <div className="border-t border-dashed border-black pt-2 mt-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-suez">Subtotal</span>
                <span className="text-sm font-medium font-suez">₹{subtotal}.00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-suez">Delivery charge</span>
                <span className="text-sm font-medium font-suez">₹{deliveryCharge}.00</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="font-suez">Total:</span>
                <span className="font-suez">₹{total}.00</span>
              </div>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="space-y-3">
            <button 
            onClick={handleCheckout}
            disabled={creatingOrder || cartItems.length === 0}
            className="w-full bg-[#F1B213] text-white py-3 rounded-full text-lg font-medium font-suez disabled:opacity-50 disabled:cursor-not-allowed">
              {creatingOrder ? 'Creating Order...' : 'Next Step'}
            </button>
            <button 
              onClick={() => window.location.href = '/ '}
              className="w-full text-black py-3 text-lg font-medium font-suez"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;