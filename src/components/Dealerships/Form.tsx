import React, { useState } from 'react';
import Logo from "@/assets/LogoWC.png";
import img from "@/assets/Group 3.png";
import { motion, AnimatePresence } from 'framer-motion';
import { dealershipAPI } from '@/services/api';
import { toast } from 'sonner';
import { CheckCircle, X } from 'lucide-react';

const Form = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', age: '', phone: '', email: '', city: '', zip: '', district: '', state: '--None--', company: '', businessAddress: '', currentNatureBusiness: '', experienceCurrentBusiness: '', businessType: '', capacityInvestment: '', currentBusinessBrief: '', whyInterested: '', excitingManpower: '', referenceName: '', captchaVerified: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.age || !formData.phone || !formData.email) {
      toast.error('Please fill in all required fields (marked with *)');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate captcha
    if (!formData.captchaVerified) {
      toast.error('Please verify that you are not a robot');
      return;
    }

    try {
      setSubmitting(true);
      const response = await dealershipAPI.submitForm(formData);

      if (response.data.success) {
        setShowSuccessModal(true);
        // Reset form
        setFormData({
          firstName: '', lastName: '', age: '', phone: '', email: '', city: '', zip: '', district: '', state: '--None--', company: '', businessAddress: '', currentNatureBusiness: '', experienceCurrentBusiness: '', businessType: '', capacityInvestment: '', currentBusinessBrief: '', whyInterested: '', excitingManpower: '', referenceName: '', captchaVerified: false
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400 text-black font-jost";
  const selectClass = "w-full px-0 py-3 border-0 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black text-gray-400 appearance-none font-jost";

  return (
    <>
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
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                          <option value="Assam">Assam</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Chhattisgarh">Chhattisgarh</option>
                          <option value="Goa">Goa</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Haryana">Haryana</option>
                          <option value="Himachal Pradesh">Himachal Pradesh</option>
                          <option value="Jharkhand">Jharkhand</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Manipur">Manipur</option>
                          <option value="Meghalaya">Meghalaya</option>
                          <option value="Mizoram">Mizoram</option>
                          <option value="Nagaland">Nagaland</option>
                          <option value="Odisha">Odisha</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Sikkim">Sikkim</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Tripura">Tripura</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Uttarakhand">Uttarakhand</option>
                          <option value="West Bengal">West Bengal</option>
                        </motion.select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-24">
                        <motion.input whileFocus={{ scale: 1.02 }} type="text" name="company" placeholder="Company" value={formData.company} onChange={handleInputChange} className={inputClass} />
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
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#F1B213] text-white px-12 py-3 rounded-full text-lg font-medium hover:bg-[#E5A612] transition-colors font-suez disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </motion.div>

        </div>
      </div>
    </div>

    {/* Success Modal */}
    <AnimatePresence>
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => setShowSuccessModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15, stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={48} className="text-green-500" />
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-3 font-suez">
                Thank You! 🎉
              </h2>
              <p className="text-gray-600 mb-4 font-jost">
                Your dealership application has been successfully submitted!
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800 font-jost">
                  ✅ A confirmation email has been sent to your email address
                </p>
              </div>
              <p className="text-sm text-gray-600 font-jost mb-6">
                Our team will review your application and get back to you within <strong>2-3 business days</strong>.
              </p>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[#F1B213] text-white py-3 rounded-full font-semibold hover:bg-[#E5A612] transition-colors font-suez"
              >
                Got it!
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Form;
