import React from "react";
import { motion } from "framer-motion";
import Img from "@/assets/OurMission.png"

const OurMission = () => {
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

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: 100,
      rotateY: -15,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100
      }
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotateY: 15
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 120
      }
    }
  };

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: -50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 150
      }
    }
  };

  return (
    <div className="w-full bg-[#F8F7E5] py-16 px-6 md:px-12">
      {/* Heading */}
      <motion.h2 
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ 
          scale: 1.05,
          textShadow: "0px 0px 8px rgba(0,0,0,0.3)",
          transition: { duration: 0.3 }
        }}
        className="text-4xl md:text-6xl text-center font-bold text-[#1a1a1a] mb-16 font-suez"
      >
        Our Mission
      </motion.h2>

      {/* Main container */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left side - Image */}
        <div className="lg:w-1/2">
          <div className="relative">
            <motion.img
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ 
                scale: 1.02,
                rotateY: -2,
                transition: { duration: 0.4 }
              }}
              src={Img} 
              alt="Wild Crunch snacks"
              className="w-full h-[910px] object-cover shadow-lg"
            />
            
            {/* Floating elements for extra creativity */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -10, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                opacity: { delay: 1.2, duration: 0.6 },
                scale: { delay: 1.2, duration: 0.6 },
                y: { repeat: Infinity, duration: 3 },
                rotate: { repeat: Infinity, duration: 8 }
              }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-[#FFE0D3] rounded-full"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: [1, 1.2, 1],
                x: [0, 15, 0]
              }}
              transition={{ 
                opacity: { delay: 1.4, duration: 0.6 },
                scale: { delay: 1.4, duration: 0.6, repeat: Infinity },
                x: { repeat: Infinity, duration: 4 }
              }}
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#2D1B13] rounded-full"
            />
          </div>
        </div>

        {/* Right side - Mission cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:w-1/2 space-y-4"
        >
          {/* Card 1: Promote Healthy Living */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ 
              scale: 1.03,
              rotateY: 2,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              transition: { duration: 0.3 }
            }}
            className="bg-[#FFE0D3] p-8 shadow-sm cursor-pointer"
          >
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-2xl font-bold text-[#2D1B13] mb-4 font-suez font-jost"
            >
              Promote Healthy Living
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-[#6B4E3D] text-base leading-relaxed"
            >
              At WildCrunch, we believe snacking should make you feel good — not
              guilty. That's why we carefully craft every product with natural, clean
              ingredients that are light, wholesome, and nourishing. Our mission is to
              inspire healthier lifestyles by offering snacks that balance taste and wellness
              in every crunch.
            </motion.p>
          </motion.div>

          {/* Card 2: Encourage Better Choices */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ 
              scale: 1.03,
              rotateY: -2,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              transition: { duration: 0.3 }
            }}
            className="bg-[#FFE0D3] p-8 shadow-sm cursor-pointer"
          >
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-2xl font-bold text-[#2D1B13] mb-4 font-suez"
            >
              Encourage Better Choices
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-[#6B4E3D] text-base leading-relaxed font-jost"
            >
              We want to change the way people think about snacking. Instead of heavy,
              oily, or processed options, we provide smarter alternatives that keep you
              energized throughout the day. From protein-packed puffs to low-calorie
              makhana, our snacks are designed to fuel your body and support better
              choices.
            </motion.p>
          </motion.div>

          {/* Card 3: Redefine Snacking */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ 
              scale: 1.03,
              rotateY: 2,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              transition: { duration: 0.3 }
            }}
            className="bg-[#FFE0D3] p-8 shadow-sm cursor-pointer"
          >
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="text-2xl font-bold text-[#2D1B13] mb-4 font-suez"
            >
              Redefine Snacking
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-[#6B4E3D] text-base leading-relaxed font-jost"
            >
              Snacking isn't just about filling your stomach — it's about enjoyment. At
              WildCrunch, we're redefining the snacking experience by combining bold
              flavors with mindful recipes. Every bite is crafted to be fun, exciting, and
              satisfying, so you never have to compromise between taste and health.
            </motion.p>
          </motion.div>

          {/* Card 4: Support Sustainability */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ 
              scale: 1.03,
              rotateY: -2,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              transition: { duration: 0.3 }
            }}
            className="bg-[#FFE0D3] p-8 shadow-sm cursor-pointer"
          >
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="text-2xl font-bold text-[#2D1B13] mb-4 font-suez"
            >
              Support Sustainability
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="text-[#6B4E3D] text-base leading-relaxed font-jost"
            >
              We care not just about people, but also about the planet. Our commitment
              to sustainability is reflected in the way we source our ingredients and
              design our packaging. By using eco-friendly practices and reducing waste,
              we aim to create snacks that are good for you and kind to the Earth.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OurMission;