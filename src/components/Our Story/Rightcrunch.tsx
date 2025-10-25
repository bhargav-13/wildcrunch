import React from "react";
import { motion } from "framer-motion";

// Import images
import Crunch1 from "@/assets/Crunch1.png";
import Crunch2 from "@/assets/Crunch2.png";
import Crunch3 from "@/assets/Crunch3.png";
import Crunch4 from "@/assets/Crunch4.png";

const Rightcrunch = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const productVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateX: -20
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100
      }
    }
  };

  const headingVariants = {
    hidden: { 
      opacity: 0, 
      y: -30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 120
      }
    }
  };

  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
        delay: 0.2
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-[#F8F7E5] py-20"
    >
      {/* Heading Section */}
      <div className="max-w-6xl mx-auto text-center mb-12 px-6 lg:px-12">
        <motion.h2 
          variants={headingVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
          className="font-suez text-3xl sm:text-4xl lg:text-5xl text-foreground leading-snug mb-4"
        >
          With the right crunch, flavor and lightness in every bite
        </motion.h2>
        <motion.p 
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="font-jost text-lg text-gray-600 mt-10"
        >
          WildCrunch makes snacking simple, fun, and guilt-free. Every product is
          crafted to give you the taste you love and the lightness your body
          deserves. We're here to bring you snacks that fit perfectly into your
          everyday moments — from work breaks to movie nights.
        </motion.p>
      </div>

      {/* Products Section */}
      <div className="w-full">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-8 lg:px-16 justify-items-center"
        >
          {[Crunch1, Crunch2, Crunch3, Crunch4].map((img, idx) => (
            <motion.div 
              key={idx} 
              variants={productVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                rotateY: 5,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                transition: { 
                  type: "spring" as const,
                  damping: 15,
                  stiffness: 200
                }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.2 }
              }}
              className="w-full flex justify-center cursor-pointer"
            >
              <motion.img
                src={img}
                alt={`Crunch ${idx + 1}`}
                className="w-[100%] h-auto object-contain rounded-lg"
                initial={{ filter: "brightness(0.9)" }}
                whileHover={{ 
                  filter: "brightness(1.1)",
                  transition: { duration: 0.3 }
                }}
                animate={{
                  y: [0, -5, 0],
                  transition: {
                    y: {
                      repeat: Infinity,
                      duration: 3 + idx * 0.5,
                      ease: "easeInOut"
                    }
                  }
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Rightcrunch;