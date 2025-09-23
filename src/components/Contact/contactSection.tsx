import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Store } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Contact form submitted:', formData);
    // Handle form submission here
  };

  const contactInfo = [
    {
      icon: <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-black" />,
      title: "Phone",
      info: "+91 25545 58920"
    },
    {
      icon: <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-black" />,
      title: "Whatsapp",
      info: "+91 25545 58920"
    },
    {
      icon: <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-black" />,
      title: "Email",
      info: "Wildcrunch@Gmail.Com"
    },
    {
      icon: <Store className="w-8 h-8 sm:w-10 sm:h-10 text-black" />,
      title: "Our Shop",
      info: "Himalnagar"
    }
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
                <div key={index} className="bg-[#F4E6D9] rounded-2xl p-6 sm:p-8 text-center">
                  <div className="flex justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-black mb-2 font-suez">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-black font-jost">
                    {item.info}
                  </p>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-2xl h-64 sm:h-80 lg:h-96 flex items-center justify-center border-2 border-gray-300">
              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-600 font-suez">
                  MAP
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mt-2 font-jost">
                  Interactive map will be loaded here
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="lg:col-span-7">
            <div className="  rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 font-suez">
                  Get In Touch
                </h1>
                <p className="text-base sm:text-lg text-gray-600 font-jost">
                  Discover Our Range And Serve Fresh, Premium Flavors That Keep Customers Coming Back.
                </p>
              </div>

              {/* Contact Form */}
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-base sm:text-lg font-medium text-black mb-3 font-suez">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 sm:py-2 border-2 border-gray-300 rounded-xl bg-transparent focus:outline-none focus:border-[#F1B213] placeholder-gray-400 text-black text-base sm:text-lg"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-base sm:text-lg font-medium text-black mb-3 font-suez">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Wildcrunch@Gmail.Com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 sm:py-2 border-2 border-gray-300 rounded-xl bg-transparent focus:outline-none focus:border-[#F1B213] placeholder-gray-400 text-black text-base sm:text-lg"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-base sm:text-lg font-medium text-black mb-3 font-suez">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Title"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 sm:py-2 border-2 border-gray-300 rounded-xl bg-transparent focus:outline-none focus:border-[#F1B213] placeholder-gray-400 text-black text-base sm:text-lg"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-base sm:text-lg font-medium text-black mb-3 font-suez">
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Type Here..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-2 sm:py-2 border-2 border-gray-300 rounded-xl bg-transparent focus:outline-none focus:border-[#F1B213] placeholder-gray-400 text-black text-base sm:text-lg resize-none"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-[#DD815C] text-white py-2 sm:py-3 rounded-full text-lg sm:text-xl transition-all duration-300 font-jost"
                  >
                    Send Now
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

export default ContactSection;