// Review.tsx
import React from "react";
import { motion } from "framer-motion";
import { Camera, ThumbsUp, ThumbsDown } from "lucide-react";

const reviews = [
  {
    name: "John Doe",
    rating: "★★★★☆",
    text: "Absolutely loved this product! Very tasty and healthy.",
    time: "3 weeks ago",
  },
  {
    name: "Jane Smith",
    rating: "★★★★★",
    text: "Perfect snack for evenings. Highly recommend!",
    time: "2 weeks ago",
  },
  {
    name: "Mike Lee",
    rating: "★★★★☆",
    text: "Healthy, tasty, and guilt-free. Love it!",
    time: "1 week ago",
  },
];

const Review = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100
      }
    }
  };

  const reviewCardVariants = {
    hidden: { 
      opacity: 0, 
      x: -50,
      rotateY: -15
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 120
      }
    }
  };

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 150
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-screen h-auto bg-[#F8F7E5] flex flex-col items-center py-16 gap-12"
    >
      {/* First Review Div */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="w-screen flex justify-center"
      >
        <div className="w-full max-w-[1500px] flex flex-col gap-4 px-6 py-6 bg-transparent">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring" as const,
                damping: 15,
                stiffness: 200,
                delay: 0.2
              }}
              whileHover={{
                scale: 1.1,
                rotate: 360,
                transition: { duration: 0.6 }
              }}
              className="w-12 h-12 rounded-full border-2 border-[#DD815C] flex items-center justify-center bg-gray-200 cursor-pointer"
            >
              <span className="text-xl font-bold text-gray-700">U</span>
            </motion.div>
            <motion.span 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-suez text-3xl text-[#212121]"
            >
              Gail Gardner
            </motion.span>
          </div>

          {/* Review Input */}
          <motion.textarea
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileFocus={{
              scale: 1.02,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              transition: { duration: 0.3 }
            }}
            className="w-full border-2 border-black p-4 resize-none h-32 bg-transparent"
            placeholder="Write your review here..."
          />

          {/* Buttons Side by Side */}
          <div className="flex gap-4">
           
            <motion.button 
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.0 }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "#9EC417",
                transition: { duration: 0.3 }
              }}
              whileTap={{
                scale: 0.95,
                transition: { duration: 0.2 }
              }}
              className="px-6 py-3 border border-black text-white rounded-full bg-black font-jost cursor-pointer"
            >
              Share Your Content
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Second Review Div */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="w-screen flex justify-center"
      >
        <div className="w-full max-w-[1500px] px-6 py-4 flex flex-col gap-2 bg-transparent">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-between items-center"
          >
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="font-jost text-lg text-[#212121] font-semibold"
            >
              5 Reviews
            </motion.span>
            <div className="flex items-center gap-4 text-[#212121] font-jost cursor-pointer font-semibold">
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{
                  color: "#DD815C",
                  transition: { duration: 0.3 }
                }}
              >
                Filter
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                whileHover={{
                  color: "#DD815C",
                  transition: { duration: 0.3 }
                }}
                className="flex items-center gap-1"
              >
                Oldest First
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="6"
                  viewBox="0 0 12 6"
                  fill="none"
                  animate={{
                    rotate: [0, 180, 0],
                    transition: {
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <path d="M1 1L6 5L11 1" stroke="#212121" strokeWidth="2" />
                </motion.svg>
              </motion.span>
            </div>
          </motion.div>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="w-full border-t border-black mt-4"
            style={{ originX: 0 }}
          />
        </div>
      </motion.div>

      {/* Third Review Div */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="w-screen flex justify-center"
      >
        <div className="w-full max-w-[1500px] px-6 py-8 bg-transparent flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-[0.3] flex flex-col gap-2">
              <motion.span 
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-suez font-semibold text-4xl text-[#212121]"
              >
                Customer Reviews
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.4,
                  type: "spring" as const,
                  damping: 15,
                  stiffness: 200
                }}
                whileHover={{
                  scale: 1.1,
                  color: "#F1B213",
                  transition: { duration: 0.3 }
                }}
                className="font-suez font-semibold text-2xl text-[#DD815C] cursor-pointer"
              >
                4.8 ★
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="font-jost text-2xl text-gray-700"
              >
                Based on 18 Reviews
              </motion.span>
            </div>

            {/* Right Column: Review Cards */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-[0.7] flex flex-col gap-6"
            >
              {reviews.map((review, index) => (
                <motion.div 
                  key={index} 
                  variants={reviewCardVariants}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                    transition: { duration: 0.3 }
                  }}
                  className="border border-black p-4 bg-white relative flex gap-4 flex-col md:flex-row justify-between cursor-pointer"
                >


                  {/* Left Side: Review Content */}
                  <div className="flex-1 flex flex-col justify-between relative">
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0 + index * 0.2, duration: 0.5 }}
                      className="absolute top-0 right-0 text-lg text-gray-500"
                    >
                      {review.time}
                    </motion.span>
                    <div className="flex flex-col gap-2">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
                        className="flex items-center gap-1 text-xl text-[#DD815C]"
                      >
                        {review.rating}
                      </motion.div>
                      <motion.span 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + index * 0.2, duration: 0.5 }}
                        className="font-suez font-semibold text-2xl text-[#212121]"
                      >
                        {review.name}
                      </motion.span>
                      <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6 + index * 0.2, duration: 0.5 }}
                        className="font-jost text-xl text-gray-700"
                      >
                        {review.text}
                      </motion.p>
                    </div>

                    {/* Helpful Section */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8 + index * 0.2, duration: 0.5 }}
                      className="flex items-center gap-4 mt-4"
                    >
                      <span className="font-jost text-sm text-gray-500">Was this helpful?</span>
                      <div className="flex gap-2">
                        <motion.button 
                          whileHover={{
                            scale: 1.2,
                            color: "#9EC417",
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{
                            scale: 0.9,
                            transition: { duration: 0.1 }
                          }}
                          className="text-gray-500 hover:text-black"
                        >
                          <ThumbsUp size={16} />
                        </motion.button>
                        <motion.button 
                          whileHover={{
                            scale: 1.2,
                            color: "#DD815C",
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{
                            scale: 0.9,
                            transition: { duration: 0.1 }
                          }}
                          className="text-gray-500 hover:text-black"
                        >
                          <ThumbsDown size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}

              {/* View More Button */}
              <div className="flex justify-center mt-8">
                <motion.button 
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: 2.5,
                    type: "spring" as const,
                    damping: 15,
                    stiffness: 200
                  }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#DD815C",
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.2 }
                  }}
                  className="px-10 py-2 bg-[#F1B213] text-white rounded-full font-jost text-lg hover:brightness-110 transition cursor-pointer"
                >
                  View More
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Review;