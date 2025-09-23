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



const AddressPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    buildingName: '',
    blockHouseNo: '',
    streetNumber: '',
    area: '',
    zipcode: '',
    city: '',
    privacyPolicy: false,
    generalConditions: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryCharge = 60;
  const total = subtotal + deliveryCharge;

  // Progress steps
  const steps = [
    { name: 'Bag', completed: true, active: false },
    { name: 'Address', completed: false, active: true },
    { name: 'Payment', completed: false, active: false },
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
          {/* Left Side - Personal Information & Shipping Address (8 columns) */}
          <div className="lg:col-span-8">
            {/* Personal Information */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-black font-suez">Personal Information</h1>
              <div className="border-b border-dashed border-black mb-6 w-full"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 font-suez">First name*</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#F1B213] placeholder-jost"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 font-suez">Last name*</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#F1B213] placeholder-jost"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 font-suez">Email*</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#F1B213] placeholder-jost"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 font-suez">Contact Number*</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder="Contact Number"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#F1B213] placeholder-jost"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-black font-suez">Shipping address</h2>
              <div className="border-b border-dashed border-black mb-6 w-full"></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 font-suez">Building name*</label>
                  <input
                    type="text"
                    name="buildingName"
                    placeholder="Building Name"
                    value={formData.buildingName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#F1B213] placeholder-jost"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 font-suez">Block/flat/house No.*</label>
                  <input
                    type="text"
                    name="blockHouseNo"
                    placeholder="Enter ---"
                    value={formData.blockHouseNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#F1B213] placeholder-jost"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 font-suez">Street Number*</label>
                  <input
                    type="text"
                    name="streetNumber"
                    placeholder="Street number"
                    value={formData.streetNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#F1B213] placeholder-jost"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 font-suez">Area*</label>
                  <input
                    type="text"
                    name="area"
                    placeholder="Area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#F1B213] placeholder-jost"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 font-suez">Zipcode*</label>
                  <input
                    type="text"
                    name="zipcode"
                    placeholder="Code"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#F1B213] placeholder-jost"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 font-suez">City*</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#F1B213] placeholder-jost"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4 mb-8">
                <div className="border-b border-dashed border-black pb-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="privacyPolicy"
                      checked={formData.privacyPolicy}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <span className="text-sm font-suez">I've read the <span className="underline">privacy policy</span>.</span>
                  </label>
                </div>
                
                <div className="border-b border-dashed border-black pb-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="generalConditions"
                      checked={formData.generalConditions}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <span className="text-sm font-suez">I agree to the <span className="underline">general conditions</span>.</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary (4 columns) */}
          <div className="lg:col-span-4 lg:pl-8">
            {/* Vertical divider line for desktop */}
            <div className="hidden lg:block border-l border-dashed border-black h-full absolute left-[66.666667%] top-48"></div>
            
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
                    onClick={() => window.location.href = '/payment'}
                    className="w-full bg-[#F1B213] text-white py-3 rounded-full text-lg font-medium hover:bg-[#E5A612] transition-colors font-suez lg:block hidden"
                  >
                    Next Step
                  </button>
                  <button 
                    onClick={() => window.location.href = '/payment'}
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

export default AddressPage;