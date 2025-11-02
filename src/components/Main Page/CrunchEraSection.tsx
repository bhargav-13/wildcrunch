import React from 'react';
import { motion } from 'framer-motion'; // Added
// Import your local images from assets
import ProteinPuff from '@/assets/proteinpuff.png';
import PopCorn from '@/assets/popcorn.png';
import CrunchyMakhana from '@/assets/crunchymakhana.png';
import Makhana from '@/assets/makhana.png';
import PremiumMakhana from '@/assets/premiummakhana.png';

import HighProteinIcon from "@/assets/proteinLogo.png";
import LowCaloriesIcon from "@/assets/calourieLogo.png";
import IngredientsIcon from "@/assets/ingredientsLogo.png";
import GlutenFreeIcon from "@/assets/GlutenLogo.png";
import FlavorIcon from "@/assets/deliciousLogo.png";
import pointsBG from "@/assets/pointsBG.png";
import Combo from "@/assets/combo2.png"
import { Link } from "react-router-dom";

const CrunchEraSection = () => {
  const products = [
    {
      name: ["PROTEIN", "PUFF"],
      description: "PROTEIN PUFFS ARE LIGHT, CRUNCHY SNACKS THAT WILL TANGO WITH YOUR TASTEBUDS.",
      imageSrc: ProteinPuff,
      bgColor: "bg-[#9EC417]",
    },
    {
      name: ["POP", "CORN"],
      description: "CRISPY POPCORN THAT'S FUN TO EAT, FULL OF FLAVOR, AND ALWAYS FEELS LIGHT.",
      imageSrc: PopCorn,
      bgColor: "bg-[#DD815C]",
    },
    {
      name: ["CRUNCHY", "MAKHANA"],
      description: "OUR MAKHANA IS LIGHT, CRUNCHY, AND WHOLESOME. A TASTY SNACK YOU'LL LOVE, GUILT-FREE.",
      imageSrc: CrunchyMakhana,
      bgColor: "bg-[#F1B213]",
    },
    {
      name: ["CRUNCHY", "MAKHANA"],
      description: "OUR MAKHANA IS LIGHT, CRUNCHY, AND WHOLESOME. A TASTY SNACK YOU'LL LOVE, GUILT-FREE.",
      imageSrc: Makhana,
      bgColor: "bg-[#F0C4A7]",
    },
    {
      name: ["PREMIUM", "MAKHANA"],
      description: "PREMIUM MAKHANA THAT BLENDS PURITY, FLAVOR, AND ELEGANCE IN EVERY CRUNCH.",
      imageSrc: PremiumMakhana,
      bgColor: "bg-[#BE9A5E]",
    },
    {
      name: ["ALL", "COMBOS"],
      description: "PREMIUM MAKHANA THAT BLENDS PURITY, FLAVOR, AND ELEGANCE IN EVERY CRUNCH.",
      imageSrc: Combo,
      bgColor: "bg-[#BE9A5E]",
    },
  ];

  const features = [
    { icon: HighProteinIcon, title: "High Protein", text: "Fuel your body with every crunchy bite." },
    { icon: LowCaloriesIcon, title: "Low In Calories", text: "Guilt-free snacking anytime." },
    { icon: IngredientsIcon, title: "Good Ingredients", text: "Only the best for you." },
    { icon: GlutenFreeIcon, title: "Gluten-Free & Healthy", text: "Better snacking, no worries." },
    { icon: FlavorIcon, title: "Deliciously Flavorful", text: "Exciting flavors in every bite." },
  ];

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
      y: 60,
      scale: 0.8
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

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 120
      }
    }
  };

  return (
    <section className="relative py-16 lg:py-24 bg-[#F8F7E5] overflow-hidden">

      {/* Features Section with animation */}
      <div className="relative w-full py-20 px-6 overflow-hidden z-10 mt-10">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <img
            src={pointsBG}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Features Grid */}
<div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 md:flex flex-wrap items-center justify-center gap-x-10 gap-y-12 md:gap-x-20 md:gap-y-16 max-w-7xl mx-auto">
  {features.map((feature, index) => (
    <motion.div
      key={index}
      className={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-4 max-w-xs mx-auto
        ${index === features.length - 1 ? "col-span-2 justify-self-center" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 1.2,
        delay: index * 0.2,
      }}
    >
      <img src={feature.icon} alt={feature.title} className="w-12 h-12" />
      <div>
        <h3 className="text-xl font-suez text-[#325DE8]">{feature.title}</h3>
        <p className="text-[#466DDF] font-jost">{feature.text}</p>
      </div>
    </motion.div>
  ))}
</div>

      </div>

      {/* Tilted background div (desktop only) */}
      <div className="hidden sm:block absolute top-[780px] left-[-150px] w-[1200px] h-[300px] bg-white transform -rotate-[35deg] sm:top-[1200px] sm:left-[-200px] sm:w-[2800px] sm:h-[400px] sm:-rotate-[10deg] origin-top-left z-0"></div>


      <div className="container mx-auto px-4 sm:px-6 relative z-10 mt-24">
        
        {/* Main Heading */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              type: "spring" as const,
              damping: 25,
              stiffness: 120,
              duration: 0.8
            }}
            whileHover={{
              scale: 1.05,
              textShadow: "0px 0px 20px rgba(158, 196, 23, 0.5)",
              color: "black",
              transition: { 
                type: "spring" as const,
                damping: 10,
                stiffness: 300,
                duration: 0.3
              }
            }}
            className="font-suez text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-gray-800 tracking-wider cursor-pointer"
          >
            CRUNCH ERA
          </motion.h2>
        </div>

        {/* Products Grid with animation */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-12 xl:gap-x-16 gap-y-24 sm:gap-y-48 max-w-7xl mx-auto mt-24 sm:mt-48"
        >
          {products.map((product, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 10,
                boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
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
              className={`${product.bgColor} rounded-3xl p-3 sm:p-6 relative min-h-[200px] sm:min-h-[100px] overflow-visible cursor-pointer`}
              style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
            >
              <div className="flex flex-col h-full">
                {/* Product Image */}
                <div className="text-center mb-[-10px] flex-shrink-0 -mt-24 sm:-mt-48">
                  <motion.img
                    variants={imageVariants}
                    src={product.imageSrc}
                    alt={product.name.join(" ")}
                    className={`max-w-none ${index === 5 ? 'w-[120px] sm:w-[330px] mt-16' : 'w-[160px] sm:w-[400px]'} h-auto mx-auto`}
                    whileHover={{
                      rotate: -15,
                      scale: 1.1,
                      transition: { 
                        type: "spring" as const,
                        damping: 10,
                        stiffness: 200
                      }
                    }}
                    animate={{
                      y: [0, -8, 0],
                      transition: {
                        y: {
                          repeat: Infinity,
                          duration: 3 + index * 0.5,
                          ease: "easeInOut"
                        }
                      }
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow flex flex-col justify-end text-white text-left">
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    className="font-suez text-base sm:text-4xl md:text-5xl mb-2 sm:mb-3 uppercase tracking-wide leading-tight"
                  >
                    {product.name.map((line, i) => (
                      <motion.span 
                        key={i} 
                        className="block"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 + i * 0.1, duration: 0.5 }}
                      >
                        {line}
                      </motion.span>
                    ))}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                    className="font-jost text-[8px] sm:text-xs leading-relaxed uppercase"
                  >
                    {product.description}
                  </motion.p>
                </div>
              </div>

              {/* Arrow Button */}
              <Link to="/products">
                <motion.div 
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 1.2 + index * 0.1, 
                    type: "spring" as const,
                    damping: 15,
                    stiffness: 200
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotate: 360,
                    backgroundColor: "#9EC417",
                    transition: { duration: 0.4 }
                  }}
                  whileTap={{
                    scale: 0.9,
                    transition: { duration: 0.2 }
                  }}
                  className="absolute -bottom-3 sm:-bottom-5 -right-4 sm:-right-8 w-10 sm:w-16 h-10 sm:h-16 bg-[#F1E613] rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 sm:w-6 h-3 sm:h-6 text-gray-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    whileHover={{
                      scale: 1.2,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 19L19 5m0 0H5.5M19 5v13.5"
                    />
                  </motion.svg>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Explore More Button */}
        <div className="text-center mt-8 sm:mt-16">
<a
  href="/products"
  className="font-sfpro text-xs sm:text-sm uppercase tracking-wide px-6 sm:px-8 py-2 sm:py-3 border border-[#C06441] text-[#C06441] rounded-full hover:bg-[#F1B213] hover:border-[#F1B213] hover:text-white transition-colors inline-block"
>
  explore All Products
</a>

        </div>
      </div>

      
    </section>
  );
};

export default CrunchEraSection;