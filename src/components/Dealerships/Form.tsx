import React, { useState } from 'react';
import Logo from "@/assets/LogoWC.png"
import img from "@/assets/Group 3.png"

const Form = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    email: '',
    city: '',
    zip: '',
    district: '',
    state: '--None--',
    company: '',
    businessAddress: '',
    currentNatureBusiness: '',
    experienceCurrentBusiness: '',
    businessType: '',
    capacityInvestment: '',
    currentBusinessBrief: '',
    whyInterested: '',
    excitingManpower: '',
    referenceName: '',
    captchaVerified: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCaptchaChange = (verified: boolean) => {
    setFormData(prev => ({
      ...prev,
      captchaVerified: verified
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-[#F8F7E5] py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black font-suez">
            Let's team up
          </h1>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="border-2 border-black bg-transparent p-6 sm:p-8 lg:p-10 rounded-none overflow-visible">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Left Side - Form */}
              <div className="lg:col-span-6">
                <div className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-black mb-6 font-suez">Personal Information</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name*"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                      </div>
                      
                      <div>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name*"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                      </div>
                      
                      <div>
                        <input
                          type="text"
                          name="age"
                          placeholder="Age*"
                          value={formData.age}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="w-full sm:w-[160%] lg:w-[200%]">
                    <h2 className="text-xl sm:text-2xl font-bold text-black mb-6 font-suez">Contact Information</h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone*"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email*"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                        <input
                          type="text"
                          name="zip"
                          placeholder="Zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input
                          type="text"
                          name="district"
                          placeholder="District"
                          value={formData.district}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black text-gray-400 appearance-none"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        >
                          <option value="--None--">--None--</option>
                          <option value="state1">State 1</option>
                          <option value="state2">State 2</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <select
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black text-gray-400 appearance-none"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        >
                          <option value="">Company</option>
                          <option value="company1">Company 1</option>
                          <option value="company2">Company 2</option>
                        </select>
                        <div></div>
                      </div>
                      
                      <div>
                        <input
                          type="text"
                          name="businessAddress"
                          placeholder="Business address"
                          value={formData.businessAddress}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="w-full sm:w-[160%] lg:w-[200%]">
                    <h2 className="text-xl sm:text-2xl font-bold text-black mb-6 font-suez">Business Information</h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input
                          type="text"
                          name="currentNatureBusiness"
                          placeholder="Current nature Of Business"
                          value={formData.currentNatureBusiness}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                        <input
                          type="text"
                          name="experienceCurrentBusiness"
                          placeholder="Experience In current Business [Years]"
                          value={formData.experienceCurrentBusiness}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input
                          type="text"
                          name="businessType"
                          placeholder="Business Type"
                          value={formData.businessType}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                        <input
                          type="text"
                          name="capacityInvestment"
                          placeholder="Capacity Of Investment"
                          value={formData.capacityInvestment}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input
                          type="text"
                          name="currentBusinessBrief"
                          placeholder="Current Business Brief"
                          value={formData.currentBusinessBrief}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                        <input
                          type="text"
                          name="whyInterested"
                          placeholder="Why Are You Interested?"
                          value={formData.whyInterested}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                      </div>
                      
                      <div>
                        <input
                          type="text"
                          name="excitingManpower"
                          placeholder="Exciting Manpower"
                          value={formData.excitingManpower}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                      </div>
                      
                      <div>
                        <input
                          type="text"
                          name="referenceName"
                          placeholder="Reference By : name/ Agency Name"
                          value={formData.referenceName}
                          onChange={handleInputChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Captcha */}
                  <div className="flex justify-end">
                    <div className="border border-gray-300 p-4 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="captcha"
                          checked={formData.captchaVerified}
                          onChange={(e) => handleCaptchaChange(e.target.checked)}
                          className="w-5 h-5"
                        />
                        <label htmlFor="captcha" className="text-sm font-jost">
                          I'm not a robot
                        </label>
                        <div className="text-xs text-gray-500">reCAPTCHA</div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-[#F1B213] text-white px-12 py-3 rounded-full text-lg font-medium hover:bg-[#E5A612] transition-colors font-suez"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Images */}
              <div className="lg:col-span-5 mt-8 lg:mt-0">
                <div className="space-y-6">
                  {/* Logo */}
                  {/* <div className="flex justify-center lg:justify-start">
                    <img
                      src={Logo}
                      alt="Wild Crunch Logo"
                      className="h-16 sm:h-20 lg:h-64 w-auto  "
                    />
                  </div> */}
                  
                  {/* Products Image */}
                  <div className="flex justify-center lg:justify-start">
                    <img
                      src={img}
                      alt="Wild Crunch Products"
                      className="h-16 sm:h-20 lg:h-64 w-auto ml-24"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;