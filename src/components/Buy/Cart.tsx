import React, { useState } from 'react';
import { ChevronLeft, Minus, Plus, Trash2 } from 'lucide-react';
import Header from '../Header'; // Import your existing header

// Mock cart data - using the same products from the popup
const initialCartItems = [
  {
    id: "1",
    name: "HABANERO CHILLY",
    price: 40,
    quantity: 4,
    imageSrc: "/api/placeholder/150/200", // Replace with your actual image path
  },
  {
    id: "2", 
    name: "HABANERO CHILLY",
    price: 40,
    quantity: 3,
    imageSrc: "/api/placeholder/150/200", // Replace with your actual image path
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [couponCode, setCouponCode] = useState('');

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryCharge = 60;
  const total = subtotal + deliveryCharge;

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Progress steps
  const steps = [
    { name: 'Bag', completed: true, active: true },
    { name: 'Address', completed: false, active: false },
    { name: 'Payment', completed: false, active: false },
    { name: 'Confirm', completed: false, active: false },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7E5]">
      {/* Use your existing header component */}
      <Header />

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.name} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.active 
                      ? 'bg-black text-white' 
                      : 'bg-gray-300 text-gray-500'
                  }`}>
                    <div className="w-3 h-3 rounded-full bg-current"></div>
                  </div>
                  <span className="text-sm mt-2 font-medium">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-300 mx-4 mt-[-20px]"></div>
                )}
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
                <div key={item.id}>
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
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-black">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 min-w-[50px] text-center font-suez">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    {/* Price */}
                    <div className="text-lg font-medium font-suez w-20 text-right">₹{item.price}.00</div>
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
                <div key={`summary-${item.id}`} className="flex justify-between items-center">
                  <span className="text-lg font-suez">×{item.quantity} {item.name}</span>
                  <span className="text-lg font-medium font-jost">₹{(item.price * item.quantity)}.00</span>
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
              <div 
              onClick={() => window.location.href = '/address '}
              className="space-y-4 mt-8">
                <button className="w-full bg-[#F1B213] text-white py-3 rounded-full text-lg font-medium hover:bg-[#E5A612] transition-colors font-suez">
                  Next Step
                </button>
                <button 
                  onClick={() => window.location.href = '/products'}
                  className="w-full text-black py-3 text-lg font-medium hover:text-[#F1B213] transition-colors font-suez"
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
              <div key={item.id}>
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
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-black">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 py-1 text-sm font-suez">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  
                  {/* Remove Button */}
                  <button onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Price */}
                  <div className="text-lg font-medium font-suez">₹{item.price}.00</div>
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
              <div key={`mobile-summary-${item.id}`} className="flex justify-between mb-2">
                <span className="text-sm font-suez">×{item.quantity} {item.name}</span>
                <span className="text-sm font-medium font-suez">₹{(item.price * item.quantity)}.00</span>
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
            <button className="w-full bg-[#F1B213] text-white py-3 rounded-full text-lg font-medium font-suez">
              View More Products
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