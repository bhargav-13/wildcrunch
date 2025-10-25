import React, { useState } from 'react';
import Logo from "@/assets/LogoWC.png";
import img from "@/assets/Group 3.png";
import { motion } from 'framer-motion';

const Form = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', age: '', phone: '', email: '', city: '', zip: '', district: '', state: '--None--', company: '', businessAddress: '', currentNatureBusiness: '', experienceCurrentBusiness: '', businessType: '', capacityInvestment: '', currentBusinessBrief: '', whyInterested: '', excitingManpower: '', referenceName: '', captchaVerified: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => console.log('Form submitted:', formData);

  const inputClass = "w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black font-jost";
  const selectClass = "w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black text-gray-400 appearance-none font-jost";

  return (
    <div className="min-h-screen bg-[#F8F7E5] py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black font-suez">Let's team up</h1>
        </motion.div>

        <div className="max-w-7xl mx-auto relative overflow-visible">
          <motion.div
            className="border-2 border-black bg-transparent p-6 sm:p-8 lg:p-10 rounded-none overflow-visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">

              {/* Left Side - Form */}
              <div className="lg:col-span-7">
                <div className="space-y-8">

                  {/* Personal Information */}
                  <motion.div
                    className="w-full lg:w-[530px]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 100, damping: 14 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-black mb-6 font-suez">Personal Information</h2>
                    <div className="space-y-6">
                      <motion.input whileFocus={{ scale: 1.02 }} type="text" name="firstName" placeholder="First Name*" value={formData.firstName} onChange={handleInputChange} className={inputClass} />
                      <motion.input whileFocus={{ scale: 1.02 }} type="text" name="lastName" placeholder="Last Name*" value={formData.lastName} onChange={handleInputChange} className={inputClass} />
                      <motion.input whileFocus={{ scale: 1.02 }} type="text" name="age" placeholder="Age*" value={formData.age} onChange={handleInputChange} className={inputClass} />
                    </div>
                  </motion.div>

                  {/* Contact Information */}
                  <motion.div
                    className="w-full lg:w-[1150px]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 100, damping: 14, delay: 0.1 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-black mb-6 font-suez">Contact Information</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-24">
                        <motion.input whileFocus={{ scale: 1.02 }} type="tel" name="phone" placeholder="Phone*" value={formData.phone} onChange={handleInputChange} className={inputClass} />
                        <motion.input whileFocus={{ scale: 1.02 }} type="email" name="email" placeholder="Email*" value={formData.email} onChange={handleInputChange} className={inputClass} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-24">
                        <motion.input whileFocus={{ scale: 1.02 }} type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className={inputClass} />
                        <motion.input whileFocus={{ scale: 1.02 }} type="text" name="zip" placeholder="Zip" value={formData.zip} onChange={handleInputChange} className={inputClass} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-24">
                        <motion.input whileFocus={{ scale: 1.02 }} type="text" name="district" placeholder="District" value={formData.district} onChange={handleInputChange} className={inputClass} />
                        <motion.select whileFocus={{ scale: 1.02 }} name="state" value={formData.state} onChange={handleInputChange} className={selectClass}>
                          <option value="--None--">--None--</option>
                          <option value="state1">State 1</option>
                          <option value="state2">State 2</option>
                        </motion.select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-24">
                        <motion.select whileFocus={{ scale: 1.02 }} name="company" value={formData.company} onChange={handleInputChange} className={selectClass}>
                          <option value="">Company</option>
                          <option value="company1">Company 1</option>
                          <option value="company2">Company 2</option>
                        </motion.select>
                        <div></div>
                      </div>
                      <motion.input whileFocus={{ scale: 1.02 }} type="text" name="businessAddress" placeholder="Business address" value={formData.businessAddress} onChange={handleInputChange} className={inputClass} />
                    </div>
                  </motion.div>

                  {/* Business Information */}
                  <motion.div
                    className="w-full lg:w-[1150px]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 100, damping: 14, delay: 0.2 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-black mb-6 font-suez">Business Information</h2>
                    <div className="space-y-6">
                      <motion.input whileFocus={{ scale: 1.02 }} type="text" name="currentNatureBusiness" placeholder="Current nature Of Business" value={formData.currentNatureBusiness} onChange={handleInputChange} className={inputClass} />
                      <motion.input whileFocus={{ scale: 1.02 }} type="text" name="experienceCurrentBusiness" placeholder="Experience In current Business [Years]" value={formData.experienceCurrentBusiness} onChange={handleInputChange} className={inputClass} />
                      <motion.input whileFocus={{ scale: 1.02 }} type="text" name="businessType" placeholder="Business Type" value={formData.businessType} onChange={handleInputChange} className={inputClass} />
                      <motion.input whileFocus={{ scale: 1.02 }} type="text" name="capacityInvestment" placeholder="Capacity Of Investment" value={formData.capacityInvestment} onChange={handleInputChange} className={inputClass} />
                      <motion.input whileFocus={{ scale: 1.02 }} type="text" name="currentBusinessBrief" placeholder="Current Business Brief" value={formData.currentBusinessBrief} onChange={handleInputChange} className={inputClass} />
                      <motion.input whileFocus={{ scale: 1.02 }} type="text" name="whyInterested" placeholder="Why Are You Interested?" value={formData.whyInterested} onChange={handleInputChange} className={inputClass} />
                      <motion.input whileFocus={{ scale: 1.02 }} type="text" name="excitingManpower" placeholder="Exciting Manpower" value={formData.excitingManpower} onChange={handleInputChange} className={inputClass} />
                      <motion.input whileFocus={{ scale: 1.02 }} type="text" name="referenceName" placeholder="Reference By : name/ Agency Name" value={formData.referenceName} onChange={handleInputChange} className={inputClass} />
                    </div>
                  </motion.div>

                  {/* Captcha */}
<motion.div
                    className="flex justify-center sm:justify-end"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 100, damping: 14, delay: 0.3 }}
                  >
                    <div className="border border-gray-300 p-4 bg-gray-50 rounded flex items-center gap-3">
                      <input type="checkbox" id="captcha" checked={formData.captchaVerified} onChange={(e) => setFormData(prev => ({ ...prev, captchaVerified: e.target.checked }))} className="w-5 h-5" />
                      <label htmlFor="captcha" className="text-sm font-jost">I'm not a robot</label>
                      <div className="text-xs text-gray-500">reCAPTCHA</div>
                    </div>
                  </motion.div>

                </div>
              </div>

              {/* Right Side - Images */}
              <div className="hidden lg:block lg:col-span-5 mt-8 lg:mt-0 relative">
                <motion.div
                  className="absolute -top-[150px] -right-[-50px] z-10"
                  initial={{ opacity: 0, y: -50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                >
                  <img src={Logo} alt="Wild Crunch Logo" className="h-64 w-auto" />
                </motion.div>
                <motion.div
                  className="flex justify-center pt-20"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 100, damping: 14, delay: 0.2 }}
                >
                  <img src={img} alt="Wild Crunch Products" className="h-72 w-auto" />
                </motion.div>
              </div>

            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            className="flex justify-center mt-8"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <button type="button" onClick={handleSubmit} className="bg-[#F1B213] text-white px-12 py-3 rounded-full text-lg font-medium hover:bg-[#E5A612] transition-colors font-suez">
              Submit
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Form;
