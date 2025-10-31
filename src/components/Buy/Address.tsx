import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../Header';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { authAPI, ordersAPI } from '@/services/api';



const AddressPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { isAuthenticated, user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    state: 'Maharashtra',
    privacyPolicy: false,
    generalConditions: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (!orderId) {
      toast.error('Order ID not found');
      navigate('/cart');
      return;
    }

    // Fetch order details
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getById(orderId);
        if (response.data.success) {
          setOrder(response.data.data);
        }
      } catch (error: any) {
        toast.error('Failed to fetch order');
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Pre-fill email if available
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
      }));
    }
  }, [isAuthenticated, user, navigate, orderId]);

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNextStep = async () => {
    // Validate required fields
    const requiredFields = [
      { field: 'firstName', label: 'First name' },
      { field: 'lastName', label: 'Last name' },
      { field: 'email', label: 'Email' },
      { field: 'contactNumber', label: 'Contact number' },
      { field: 'buildingName', label: 'Building name' },
      { field: 'blockHouseNo', label: 'Block/flat/house number' },
      { field: 'streetNumber', label: 'Street number' },
      { field: 'area', label: 'Area' },
      { field: 'zipcode', label: 'Zipcode' },
      { field: 'city', label: 'City' },
      { field: 'state', label: 'State' },
    ];

    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`${label} is required`);
        return;
      }
    }

    if (!formData.privacyPolicy) {
      toast.error('Please accept the privacy policy');
      return;
    }

    if (!formData.generalConditions) {
      toast.error('Please accept the general conditions');
      return;
    }

    if (!orderId) {
      toast.error('Order ID not found');
      return;
    }

    try {
      // Prepare shipping address
      const shippingAddress = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.contactNumber,
        address: `${formData.blockHouseNo}, ${formData.buildingName}, ${formData.streetNumber}`,
        area: formData.area,
        city: formData.city,
        state: formData.state,
        pincode: formData.zipcode,
      };

      // Update order with shipping address (Step 2)
      const response = await ordersAPI.updateAddress(orderId, shippingAddress);
      
      if (response.data.success) {
        // Also save address to user profile for future use
        try {
          await authAPI.addAddress({
            name: shippingAddress.fullName,
            phone: shippingAddress.phone,
            addressLine1: `${formData.blockHouseNo}, ${formData.buildingName}`,
            addressLine2: formData.streetNumber,
            city: formData.city,
            state: formData.state,
            pincode: formData.zipcode,
            isDefault: true
          });
        } catch (err) {
          // Ignore profile save error, continue with checkout
          console.log('Failed to save to profile, but continuing checkout');
        }

        toast.success('Address saved successfully!');
        // Navigate to payment page with order ID
        navigate(`/payment?orderId=${orderId}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save address');
      console.error('Address save error:', error);
    }
  };

  // Get order items
  const orderItems = order?.items || [];
  const cartItems = orderItems.map((item: any) => {
    const packLabel = item.pack === '1' ? 'Individual' : item.pack === '2' ? 'Pack of 2' : item.pack === '4' ? 'Pack of 4' : '';
    return {
      ...item,
      packLabel,
      displayPrice: item.packPrice || item.priceNumeric,
    };
  });

  const subtotal = order?.itemsPrice || 0;
  const deliveryCharge = order?.shippingPrice || 60;
  const total = order?.totalPrice || 0;

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
          {/* Left Side - Personal Information & Shipping Address (8 columns) */}
          <div className="lg:col-span-8">
            {/* Personal Information */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-black font-suez">Personal Information</h1>
              <div className="border-b border-dashed border-black mb-6 w-full"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 font-suez">First name</label>
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
                  <label className="block text-sm font-medium mb-2 font-suez">Last name</label>
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
                  <label className="block text-sm font-medium mb-2 font-suez">Email</label>
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
                  <label className="block text-sm font-medium mb-2 font-suez">Contact Number</label>
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
                  <label className="block text-sm font-medium mb-2 font-suez">Building name</label>
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
                  <label className="block text-sm font-medium mb-2 font-suez">Block/flat/house No.</label>
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
                  <label className="block text-sm font-medium mb-2 font-suez">Street Number</label>
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
                  <label className="block text-sm font-medium mb-2 font-suez">Area</label>
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
                  <label className="block text-sm font-medium mb-2 font-suez">Zipcode</label>
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
                  <label className="block text-sm font-medium mb-2 font-suez">City</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 font-suez">State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
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
                  <div key={`summary-${item.productId}-${item.pack}`} className="flex justify-between items-center">
                    <span className="text-sm lg:text-lg font-suez">×{item.quantity} {item.name}{item.pack !== '1' ? ` (${item.packLabel})` : ''}</span>
                    <span className="text-sm lg:text-lg font-medium font-suez">₹{(item.displayPrice * item.quantity)}.00</span>
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
                    onClick={handleNextStep}
                    disabled={loading || cartItems.length === 0}
                    className="w-full bg-[#F1B213] text-white py-3 rounded-full text-lg font-medium hover:bg-[#E5A612] transition-colors font-suez disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
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