import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Store } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => console.log('Contact form submitted:', formData);

  const contactInfo = [
    { icon: <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-black" />, title: "Phone", info: "+91 25545 58920" },
    { icon: <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-black" />, title: "Whatsapp", info: "+91 25545 58920" },
    { icon: <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-black" />, title: "Email", info: "care@wildcrunch.in" },
    { icon: <Store className="w-8 h-8 sm:w-10 sm:h-10 text-black" />, title: "Our Shop", info: "Himalnagar" }
  ];

  return (
    <div className="min-h-screen bg-[#F8F7E5] py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 max-w-7xl mx-auto">

          {/* Left Side - Contact Info and Map */}
          <div className="lg:col-span-5 space-y-8 mb-12 lg:mb-0">

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-[#F4E6D9] rounded-2xl p-6 sm:p-8 text-center cursor-pointer"
                  initial={{ opacity: 0, x: -50, y: 50, rotate: -5 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 100, damping: 12, delay: index * 0.15 }}
                  whileHover={{ scale: 1.05, rotate: 2, boxShadow: '0px 15px 25px rgba(0,0,0,0.2)' }}
                >
                  <div className="flex justify-center mb-4">{item.icon}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-black mb-2 font-suez">{item.title}</h3>
                  <p className="text-sm sm:text-base text-black font-jost">{item.info}</p>
                </motion.div>
              ))}
            </div>

            {/* Map Placeholder */}
<motion.div
  className="bg-gray-200 rounded-2xl h-64 sm:h-80 lg:h-[410px] flex items-center justify-center border-2 border-gray-300 relative overflow-hidden"
  initial={{ scale: 0.8, rotate: -3, opacity: 0 }}
  whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
  viewport={{ once: true }}
  transition={{ type: 'spring', stiffness: 120, damping: 14 }}
  whileHover={{ scale: 1.02, rotate: 1, boxShadow: '0px 20px 40px rgba(0,0,0,0.15)' }}
>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2365.397511692727!2d72.96320005311398!3d23.630986535515152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395db9f77fa47ec5%3A0x8ff87481d69678b2!2sAirfix%20Build%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1758976804441!5m2!1sen!2sin"
    className="absolute inset-0 w-full h-full border-0"
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</motion.div>

          </div>

          {/* Right Side - Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              className="rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            >
              {/* Header */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 font-suez">Get In Touch</h1>
                <p className="text-base sm:text-lg text-gray-600 font-jost">
                  Discover Our Range And Serve Fresh, Premium Flavors That Keep Customers Coming Back.
                </p>
              </motion.div>

              {/* Contact Form */}
              <div className="space-y-6">
                {['name', 'email', 'subject', 'message'].map((field, idx) => (
                  <motion.div
                    key={field}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 90, damping: 12, delay: idx * 0.1 }}
                  >
                    <label className="block text-base sm:text-lg font-medium text-black mb-3 font-suez">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    {field !== 'message' ? (
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field}
                        placeholder={field === 'email' ? 'Wildcrunch@Gmail.Com' : 'Your ' + field.charAt(0).toUpperCase() + field.slice(1)}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 sm:py-2 border-2 border-gray-300 rounded-xl bg-transparent focus:outline-none focus:border-[#F1B213] placeholder-gray-400 text-black text-base sm:text-lg"
                        style={{ fontFamily: 'Jost, sans-serif' }}
                      />
                    ) : (
                      <textarea
                        name={field}
                        placeholder="Type Here..."
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full px-4 py-2 sm:py-2 border-2 border-gray-300 rounded-xl bg-transparent focus:outline-none focus:border-[#F1B213] placeholder-gray-400 text-black text-base sm:text-lg resize-none"
                        style={{ fontFamily: 'Jost, sans-serif' }}
                      />
                    )}
                  </motion.div>
                ))}

                {/* Submit Button */}
                <motion.div
                  className="pt-4"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.4 }}
                  whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.2)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-[#DD815C] text-white py-2 sm:py-3 rounded-full text-lg sm:text-xl transition-all duration-300 font-jost"
                  >
                    Send Now
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
