import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import your local images from assets
import ProteinPuff from '@/assets/proteinpuff.png';
import PopCorn from '@/assets/popcorn.png';
import CrunchyMakhana from '@/assets/crunchymakhana.png';

const Others = () => {
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
  ];

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

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.8,
      rotateX: -30
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

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      y: -50,
      scale: 0.7,
      rotate: -180
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 150,
        delay: 0.3
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100
      }
    }
  };

  const allProductVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
        delay: 0.2
      }
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-screen h-auto bg-[#F8F7E5] flex flex-col items-center py-16 gap-12"
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Main Heading */}
        <div className="w-full flex justify-between items-center mb-12 lg:mb-16 px-4">
          {/* Left Side */}
          <motion.h2 
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
            className="font-suez text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-800 tracking-wider"
          >
            OTHER PRODUCT FROM CRUNCH
          </motion.h2>

          {/* Right Side */}
          <motion.span 
            variants={allProductVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 1.1,
              color: "#9EC417",
              transition: { duration: 0.3 }
            }}
            className="font-jost text-lg sm:text-xl md:text-xl text-gray-800 cursor-pointer"
          >
            All Product
          </motion.span>
        </div>

        {/* Products Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-12 xl:gap-x-16 gap-y-24 sm:gap-y-48 max-w-7xl mx-auto mt-24 sm:mt-48"
        >
          {products.map((product, index) => (
            <Link key={index} to="/products" className="block">
              <motion.div
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
                      className="max-w-none w-[160px] sm:w-[400px] h-auto mx-auto"
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

                {/* Background floating particles */}

              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Others;