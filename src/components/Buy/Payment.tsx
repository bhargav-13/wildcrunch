import React, { useState } from 'react';
import { ChevronLeft, User, Menu } from 'lucide-react';
import Header from '../Header';
// Mock cart data for order summary
const cartItems = [
  {
    id: "1",
    name: "HABANERO CHILLY",
    price: 40,
    quantity: 4,
  },
  {
    id: "2", 
    name: "HABANERO CHILLY",
    price: 40,
    quantity: 3,
  },
];



const PaymentPage = () => {
  const [selectedPayment, setSelectedPayment] = useState('razor');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryCharge = 60;
  const total = subtotal + deliveryCharge;

  // Progress steps
  const steps = [
    { name: 'Bag', completed: true, active: false },
    { name: 'Address', completed: true, active: false },
    { name: 'Payment', completed: false, active: true },
    { name: 'Confirm', completed: false, active: false },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7E5] font-jost">
      <Header />

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.name}>
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${
                    step.active 
                      ? 'bg-black' 
                      : step.completed
                      ? 'bg-black'
                      : 'bg-gray-300'
                  }`}></div>
                  <span className="text-sm mt-2 font-medium">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 sm:w-32 h-px bg-black mx-4 sm:mx-8 mt-[-20px]"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Side - Payment Section (8 columns) */}
          <div className="lg:col-span-8">
            {/* Payment */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-black font-suez">Payment</h1>
              <div className="border-b border-dashed border-black mb-6 w-full"></div>
              
              {/* Payment Options */}
              <div className="space-y-4">
                {/* Razor Pay Option */}
                <div 
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedPayment === 'razor' 
                      ? 'border-black bg-gray-50' 
                      : 'border-gray-300 bg-white'
                  }`}
                  onClick={() => setSelectedPayment('razor')}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                      selectedPayment === 'razor' 
                        ? 'border-black' 
                        : 'border-gray-300'
                    }`}>
                      {selectedPayment === 'razor' && (
                        <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {/* Razor Pay Icon */}
                          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                            <div className="w-4 h-3 bg-white rounded-sm flex items-center justify-center">
                              <div className="w-2 h-1 bg-blue-600 rounded-full"></div>
                            </div>
                          </div>
                          <span className="text-lg font-medium text-gray-600">Razor Pay</span>
                        </div>
                        <span className="text-lg font-medium">₹{total}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">
                        With Razorpay you can make online payments in a reliable, secure and easy way. You can pay using the mobile banking app or the online banking environment of your own bank.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Shipping Details */}
            <button 
              onClick={() => window.location.href = '/address'}
              className="flex items-center gap-2 text-black hover:text-[#F1B213] transition-colors font-suez"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to Shipping Details
            </button>
          </div>

          {/* Right Side - Order Summary (4 columns) */}
          <div className="lg:col-span-4 lg:pl-8 mt-8 lg:mt-0">
            {/* Vertical divider line for desktop */}
            <div className="hidden lg:block border-l border-dashed border-black h-full absolute left-[66.666667%] top-42"></div>
            
            {/* Order Summary */}
            <div className="bg-white lg:bg-transparent p-4 lg:p-0 rounded-lg lg:rounded-none border lg:border-none border-black mb-6">
              <h2 className="text-xl lg:text-3xl font-bold mb-4 lg:mb-8 text-black font-suez">Order Summary</h2>
              
              <div className="space-y-4 lg:space-y-6">
                {/* Summary Items */}
                {cartItems.map((item) => (
                  <div key={`summary-${item.id}`} className="flex justify-between items-center">
                    <span className="text-sm lg:text-lg font-suez">×{item.quantity} {item.name}</span>
                    <span className="text-sm lg:text-lg font-medium font-suez">₹{(item.price * item.quantity)}.00</span>
                  </div>
                ))}
                
                <div className="border-b border-dashed border-black my-4 lg:my-6"></div>
                
                {/* Totals */}
                <div className="flex justify-between items-center text-sm lg:text-lg">
                  <span className="font-suez">Subtotal</span>
                  <span className="font-medium font-suez">₹{subtotal}.00</span>
                </div>
                
                <div className="border-b border-dashed border-black my-4 lg:my-6"></div>
                
                <div className="flex justify-between items-center text-sm lg:text-lg">
                  <span className="font-suez">Delivery charge</span>
                  <span className="font-medium font-suez">₹{deliveryCharge}.00</span>
                </div>
                
                <div className="border-b border-dashed border-black my-4 lg:my-6"></div>
                
                <div className="flex justify-between items-center text-lg lg:text-xl font-bold">
                  <span className="font-suez">Total:</span>
                  <span className="font-suez">₹{total}.00</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 lg:space-y-4 mt-6 lg:mt-8">
                  <button 
                    onClick={() => window.location.href = '/confirm'}
                    className="w-full bg-[#F1B213] text-white py-3 rounded-full text-lg font-medium hover:bg-[#E5A612] transition-colors font-suez lg:block hidden"
                  >
                    Next Step
                  </button>
                  <button 
                    onClick={() => window.location.href = '/confirm'}
                    className="w-full bg-[#F1B213] text-white py-3 rounded-full text-lg font-medium hover:bg-[#E5A612] transition-colors font-suez lg:hidden"
                  >
                    View More Products
                  </button>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="w-full text-black py-3 text-lg font-medium hover:text-[#F1B213] transition-colors font-suez"
                  >
                    <ChevronLeft className="inline h-5 w-5 mr-2 lg:hidden" />
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;