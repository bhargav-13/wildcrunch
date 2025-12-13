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

// Mock user data
const userData = {
  name: "KUSHAL PATEL",
  email: "kushal.mungalpara@gmail.com",
  company: "CODELUX",
  address: "12 A-301",
  zipcode: "380054",
  city: "Ahmedabad",
  country: "India"
};


const ConfirmPage = () => {
  const [message, setMessage] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryCharge = 0;
  const total = subtotal + deliveryCharge;

  // Progress steps
  const steps = [
    { name: 'Bag', completed: true, active: false },
    { name: 'Address', completed: true, active: false },
    { name: 'Payment', completed: true, active: false },
    { name: 'Confirm', completed: false, active: true },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7E5] font-jost">
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


        {/* Main Content */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Side - Confirm Order Section (8 columns) */}
          <div className="lg:col-span-8">
            {/* Check your order */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-black font-suez">Check your order</h1>
              <div className="border-b border-dashed border-black mb-6 w-full"></div>
              
              {/* Details Grid - Desktop */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 mb-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Shipping Details */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold font-suez">Shipping details</h3>
                      <button className="text-[#F1B213] text-sm font-medium hover:underline">Change</button>
                    </div>
                    <div className="text-sm space-y-1 font-suez">
                      <p>{userData.name}</p>
                      <p>{userData.company}</p>
                      <p>{userData.address}</p>
                      <p>{userData.zipcode} {userData.city}</p>
                      <p>{userData.country}</p>
                      <p>{userData.email}</p>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold font-suez">Personal Information</h3>
                      <button className="text-[#F1B213] text-sm font-medium hover:underline">Change</button>
                    </div>
                    <div className="text-sm space-y-1 font-suez">
                      <p>{userData.name}</p>
                      <p>{userData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Invoice Address */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold font-suez">Invoice Address</h3>
                      <button className="text-[#F1B213] text-sm font-medium hover:underline">Change</button>
                    </div>
                    <div className="text-sm space-y-1 font-suez">
                      <p>{userData.name}</p>
                      <p>{userData.company}</p>
                      <p>{userData.address}</p>
                      <p>{userData.zipcode} {userData.city}</p>
                      <p>{userData.country}</p>
                      <p>{userData.email}</p>
                    </div>
                  </div>

                  {/* Payment */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold font-suez">Payment</h3>
                      <button className="text-[#F1B213] text-sm font-medium hover:underline">Change</button>
                    </div>
                    <div className="text-sm font-suez">
                      <p>Razorpay</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Stack - Mobile */}
              <div className="lg:hidden space-y-6 mb-8">
                {/* Shipping Details */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-suez">Shipping details</h3>
                    <button className="text-[#F1B213] text-sm font-medium hover:underline">Change</button>
                  </div>
                  <div className="text-sm space-y-1 font-suez">
                    <p>{userData.name}</p>
                    <p>{userData.company}</p>
                    <p>{userData.address}</p>
                    <p>{userData.zipcode} {userData.city}</p>
                    <p>{userData.country}</p>
                    <p>{userData.email}</p>
                  </div>
                </div>

                {/* Invoice Address */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-suez">Invoice Address</h3>
                    <button className="text-[#F1B213] text-sm font-medium hover:underline">Change</button>
                  </div>
                  <div className="text-sm space-y-1 font-suez">
                    <p>{userData.name}</p>
                    <p>{userData.company}</p>
                    <p>{userData.address}</p>
                    <p>{userData.zipcode} {userData.city}</p>
                    <p>{userData.country}</p>
                    <p>{userData.email}</p>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-suez">Personal Information</h3>
                    <button className="text-[#F1B213] text-sm font-medium hover:underline">Change</button>
                  </div>
                  <div className="text-sm space-y-1 font-suez">
                    <p>{userData.name}</p>
                    <p>{userData.email}</p>
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-suez">Payment</h3>
                    <button className="text-[#F1B213] text-sm font-medium hover:underline">Change</button>
                  </div>
                  <div className="text-sm font-suez">
                    <p>Razorpay</p>
                  </div>
                </div>
              </div>

              <div className="border-b border-dashed border-black mb-6 w-full"></div>

              {/* Extra order information */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 font-suez">Extra order information</h3>
                <p className="text-sm text-gray-600 mb-4 font-suez">Do you have extra information for us we should know?</p>
                <textarea
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#F1B213] placeholder-jost resize-none"
                  style={{ fontFamily: 'Jost, sans-serif' }}
                />
              </div>
            </div>

            {/* Back to Payment */}
            <button 
              onClick={() => window.location.href = '/payment'}
              className="flex items-center gap-2 text-black hover:text-[#F1B213] transition-colors font-suez"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to Payment
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
                    onClick={() => alert('Order placed successfully!')}
                    className="w-full bg-[#F1B213] text-white py-3 rounded-full text-lg font-medium hover:bg-[#E5A612] transition-colors font-suez lg:block hidden"
                  >
                    Next Step
                  </button>
                  <button 
                    onClick={() => alert('Order placed successfully!')}
                    className="w-full bg-[#F1B213] text-white py-3 rounded-full text-lg font-medium hover:bg-[#E5A612] transition-colors font-suez lg:hidden"
                  >
                    Place order
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

export default ConfirmPage;