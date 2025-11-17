import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, CheckCircle2, XCircle, Loader2, Calendar } from 'lucide-react';
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
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [pincodeServiceable, setPincodeServiceable] = useState<boolean | null>(null);
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [shippingRate, setShippingRate] = useState<number | null>(null);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string | null>(null);

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

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch order details
        const orderResponse = await ordersAPI.getById(orderId);
        if (orderResponse.data.success) {
          setOrder(orderResponse.data.data);
        }

        // Fetch user profile with saved addresses
        const profileResponse = await authAPI.getProfile();
        if (profileResponse.data.success && profileResponse.data.data.addresses) {
          const addresses = profileResponse.data.data.addresses;
          setSavedAddresses(addresses);

          // Auto-select default address if available
          const defaultAddress = addresses.find((addr: any) => addr.isDefault);
          if (defaultAddress && !showNewAddressForm) {
            setSelectedAddressId(defaultAddress._id);
            // Calculate shipping for default address
            if (defaultAddress.pincode && orderResponse.data.data) {
              setTimeout(() => {
                checkPincodeServiceability(defaultAddress.pincode);
              }, 500);
            }
          }
        }
      } catch (error: any) {
        toast.error('Failed to fetch data');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Pre-fill email if available
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        contactNumber: user.phone || '',
      }));
    }
  }, [isAuthenticated, user, navigate, orderId]);

  // Check pincode serviceability and calculate shipping
  const checkPincodeServiceability = async (pincode: string) => {
    if (!pincode || pincode.length !== 6) {
      setPincodeServiceable(null);
      setShippingRate(null);
      setExpectedDeliveryDate(null);
      return;
    }

    setCheckingPincode(true);
    try {
      const response = await ordersAPI.calculateShipping(pincode, order?.itemsPrice || 0);
      console.log('📦 Shipping calculation response:', response.data);
      console.log('📦 Full response data:', JSON.stringify(response.data, null, 2));

      if (response.data.success && response.data.serviceable) {
        setPincodeServiceable(true);
        setShippingRate(response.data.shippingPrice || 60);

        // Set expected delivery date - check multiple possible field names
        let deliveryDate = null;

        // Check direct fields first
        if (response.data.expectedDeliveryDate) {
          deliveryDate = response.data.expectedDeliveryDate;
        } else if (response.data.expected_delivery_date) {
          deliveryDate = response.data.expected_delivery_date;
        }
        // Check in nested data object
        else if (response.data.data) {
          const rateData = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
          deliveryDate = rateData?.expected_delivery_date || rateData?.expectedDeliveryDate;
        }

        if (deliveryDate) {
          console.log('📅 Setting expected delivery date:', deliveryDate);
          setExpectedDeliveryDate(deliveryDate);
          console.log('✅ State updated - expectedDeliveryDate:', deliveryDate);
        } else {
          console.log('⚠️ No expected delivery date found in response');
          setExpectedDeliveryDate(null);
        }

        toast.success('Delivery available to this pincode!');
      } else {
        setPincodeServiceable(false);
        setShippingRate(null);
        setExpectedDeliveryDate(null);
        toast.error('Delivery not available to this pincode');
      }
    } catch (error: any) {
      console.error('Pincode check error:', error);
      setPincodeServiceable(null);
      setShippingRate(null);
      setExpectedDeliveryDate(null);
      // Fallback - allow checkout with default shipping
    } finally {
      setCheckingPincode(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Check pincode when user types in zipcode field
    if (name === 'zipcode' && value.length === 6) {
      checkPincodeServiceability(value);
    }
  };

  const handleAddressSelect = async (addressId: string) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(false);

    // Calculate shipping for selected address
    const selectedAddress = savedAddresses.find(addr => addr._id === addressId);
    if (selectedAddress && selectedAddress.pincode) {
      await checkPincodeServiceability(selectedAddress.pincode);
    }
  };

  const handleNewAddress = () => {
    setSelectedAddressId(null);
    setShowNewAddressForm(true);
  };

  const handleNextStep = async () => {
    if (!orderId) {
      toast.error('Order ID not found');
      return;
    }

    let shippingAddress;

    // If using saved address
    if (selectedAddressId && !showNewAddressForm) {
      const selectedAddress = savedAddresses.find(addr => addr._id === selectedAddressId);
      if (!selectedAddress) {
        toast.error('Please select an address');
        return;
      }

      // Validate privacy policy and general conditions
      if (!formData.privacyPolicy) {
        toast.error('Please accept the privacy policy');
        return;
      }

      if (!formData.generalConditions) {
        toast.error('Please accept the general conditions');
        return;
      }

      shippingAddress = {
        fullName: selectedAddress.name,
        email: formData.email || user?.email,
        phone: selectedAddress.phone,
        address: `${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : ''}`,
        area: selectedAddress.area || '',
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
      };
    } else {
      // Using new address form - only validate essential fields
      const requiredFields = [
        { field: 'firstName', label: 'First name' },
        { field: 'lastName', label: 'Last name' },
        { field: 'email', label: 'Email' },
        { field: 'contactNumber', label: 'Contact number' },
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

      shippingAddress = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.contactNumber,
        address: `${formData.blockHouseNo}, ${formData.buildingName}, ${formData.streetNumber}`,
        area: formData.area,
        city: formData.city,
        state: formData.state,
        pincode: formData.zipcode,
      };
    }

    try {
      // Update order with shipping address (Step 2) - This will also calculate shipping dynamically
      const response = await ordersAPI.updateAddress(orderId, shippingAddress);

      if (response.data.success) {
        const updatedOrder = response.data.data;

        // Log the updated shipping details
        console.log('�� Shipping calculated:', {
          shippingPrice: updatedOrder.shippingPrice,
          totalPrice: updatedOrder.totalPrice
        });

        // Update local order state with new shipping price
        setOrder(updatedOrder);
        setShippingRate(updatedOrder.shippingPrice);

        // Save new address to profile only if it's a new address
        if (showNewAddressForm && !selectedAddressId) {
          try {
            await authAPI.addAddress({
              name: shippingAddress.fullName,
              phone: shippingAddress.phone,
              addressLine1: `${formData.blockHouseNo}, ${formData.buildingName}`,
              addressLine2: formData.streetNumber,
              area: formData.area,
              city: formData.city,
              state: formData.state,
              pincode: formData.zipcode,
              isDefault: savedAddresses.length === 0 // Make default if first address
            });
          } catch (err) {
            // Ignore profile save error, continue with checkout
            console.log('Failed to save to profile, but continuing checkout');
          }
        }

        toast.success(`Address saved! Shipping: ₹${updatedOrder.shippingPrice}`);

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
  const deliveryCharge = shippingRate || order?.shippingPrice || 60;
  const total = subtotal + deliveryCharge;

  // Progress steps
  const steps = [
    { name: 'Bag', completed: true, active: false },
    { name: 'Address', completed: false, active: true },
    { name: 'Payment', completed: false, active: false },
    { name: 'Confirm', completed: false, active: false },
  ];

  // Debug log for rendering
  console.log('🎨 Rendering Address page - expectedDeliveryDate:', expectedDeliveryDate, 'shippingRate:', shippingRate);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7E5]">
        <Header />
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#F1B213] mb-4"></div>
          <p className="text-xl font-suez text-black">Loading...</p>
        </div>
      </div>
    );
  }

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
          {/* Left Side - Address Selection (8 columns) */}
          <div className="lg:col-span-8">
            {/* Saved Addresses */}
            {savedAddresses.length > 0 && !showNewAddressForm && (
              <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-black font-suez">Select Delivery Address</h1>
                <div className="border-b border-dashed border-black mb-6 w-full"></div>

                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => handleAddressSelect(address._id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAddressId === address._id
                          ? 'border-[#F1B213] bg-[#F1B213]/10'
                          : 'border-gray-300 hover:border-[#F1B213]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-suez font-bold text-lg">{address.name}</span>
                            {address.isDefault && (
                              <span className="bg-[#F1B213] text-white text-xs px-2 py-1 rounded-full">Default</span>
                            )}
                          </div>
                          <p className="text-sm font-jost text-gray-700">{address.phone}</p>
                          <p className="text-sm font-jost text-gray-700 mt-1">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm font-jost text-gray-700">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                        <input
                          type="radio"
                          checked={selectedAddressId === address._id}
                          onChange={() => handleAddressSelect(address._id)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleNewAddress}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#F1B213] transition-colors flex items-center justify-center gap-2 text-[#F1B213] font-suez"
                  >
                    <Plus className="h-5 w-5" />
                    Add New Address
                  </button>
                </div>
              </div>
            )}

            {/* New Address Form */}
            {(showNewAddressForm || savedAddresses.length === 0) && (
              <>
                {/* Personal Information */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-black font-suez">Personal Information</h1>
                    {savedAddresses.length > 0 && (
                      <button
                        onClick={() => setShowNewAddressForm(false)}
                        className="text-sm text-[#F1B213] font-suez hover:underline"
                      >
                        Use Saved Address
                      </button>
                    )}
                  </div>
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
                      <label className="block text-sm font-medium mb-2 font-suez">Building name</label>
                      <input
                        type="text"
                        name="buildingName"
                        placeholder="Building Name (Optional)"
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
                        placeholder="Enter --- (Optional)"
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
                        placeholder="Street number (Optional)"
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
                      <div className="relative">
                        <input
                          type="text"
                          name="zipcode"
                          placeholder="Code"
                          value={formData.zipcode}
                          onChange={handleInputChange}
                          maxLength={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#F1B213] placeholder-jost"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                        {checkingPincode && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="w-5 h-5 text-[#F1B213] animate-spin" />
                          </div>
                        )}
                        {!checkingPincode && pincodeServiceable === true && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          </div>
                        )}
                        {!checkingPincode && pincodeServiceable === false && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <XCircle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {pincodeServiceable === true && shippingRate !== null && (
                        <p className="text-xs text-green-600 mt-1 font-jost">
                          Delivery available • Shipping: ₹{shippingRate}
                        </p>
                      )}
                      {pincodeServiceable === false && (
                        <p className="text-xs text-red-600 mt-1 font-jost">
                          Delivery not available to this pincode
                        </p>
                      )}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 font-suez">State*</label>
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
                </div>
              </>
            )}

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
                  {checkingPincode ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#F1B213]" />
                      <span className="font-medium font-suez text-gray-500">Calculating...</span>
                    </div>
                  ) : !selectedAddressId && !showNewAddressForm ? (
                    <span className="font-medium font-suez text-gray-500 text-sm">Select address</span>
                  ) : shippingRate ? (
                    <span className="font-medium font-suez">₹{deliveryCharge}.00</span>
                  ) : (
                    <span className="font-medium font-suez text-gray-500 text-sm">--</span>
                  )}
                </div>

                <div className="border-b border-dashed border-black my-4 lg:my-6"></div>

                <div className="flex justify-between items-center text-lg lg:text-xl font-bold">
                  <span className="font-suez">Total:</span>
                  <span className="font-suez">₹{total}.00</span>
                </div>

                {/* Expected Delivery Date */}
                {expectedDeliveryDate && shippingRate && (
                  <div className="mt-4 lg:mt-6 bg-green-50 border border-green-200 rounded-lg p-3 lg:p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="font-jost text-green-700 text-sm font-semibold">Expected Delivery</span>
                    </div>
                    <p className="font-suez text-base lg:text-lg font-bold text-green-800 ml-6">
                      {expectedDeliveryDate}
                    </p>
                  </div>
                )}

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
