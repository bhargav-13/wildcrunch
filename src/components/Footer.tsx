import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import LogoWC from "../assets/LogoWC.png";
import { Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.2 });

  // Generate a smooth random ECG/heartbeat-like path
  const generateRandomPath = (width = 1200, segments = 80) => {
    const segmentWidth = width / segments;
    let path = `M0,14`;
    for (let i = 1; i <= segments; i++) {
      const x = i * segmentWidth;
      const y = 8 + Math.sin(i * 0.6) * 6 + (Math.random() - 0.5) * 3;
      path += ` Q${x - segmentWidth / 2},${y} ${x},14`;
    }
    return path;
  };

  const pathData = generateRandomPath();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const sectionVariants: Variants = {
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
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  const linkVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120
      }
    }
  };

  const logoVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      rotate: -180
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: -20,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150
      }
    }
  };

  const pathVariants: Variants = {
    hidden: { 
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.5 }
      }
    }
  };

  const handleTestimonialClick = (e) => {
    e.preventDefault();
    
    // Check if we're on the homepage
    if (window.location.pathname === '/') {
      // We're on homepage, just scroll to section
      const element = document.getElementById('testimonials');
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // We're on another page, navigate to homepage with hash
      window.location.href = '/#testimonials';
    }
  };

  return (
    <motion.footer 
      ref={footerRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-full min-h-[70vh] lg:min-h-[40vh] bg-[#F8F7E5] overflow-hidden"
    >
      {/* Full background yellow shape */}
      <div className="absolute inset-0 z-0">
        <motion.svg
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewBox="0 0 1440 1400"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M0,120 C150,60 350,40 500,90 C650,140 850,70 1000,110 C1150,150 1350,95 1440,115 L1440,1400 L0,1400 Z"
            fill="#FCEB81"
          />
        </motion.svg>
      </div>

      {/* ================= Desktop View ================= */}
      <div className="relative z-10 hidden lg:flex flex-col">
        {/* Large heading */}
        <motion.h2
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -50, scale: 0.9 }}
          transition={{ 
            type: "spring",
            damping: 20,
            stiffness: 100,
            delay: 0.5
          }}
          whileHover={{
            scale: 1.02,
            color: "#275AF3",
            transition: { duration: 0.3 }
          }}
          className="text-center font-suez text-[#325DE8] leading-tight mb-16
                       text-4xl sm:text-5xl md:text-6xl lg:text-[6.25rem] mt-48"
        >
          Thank You For Your Curiosity.
        </motion.h2>

        {/* 4-column row */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 items-start w-full"
        >
          {/* Logo (tilted) */}
          <motion.div 
            variants={sectionVariants}
            className="flex justify-center lg:justify-center items-center"
          >
            <motion.div 
              variants={logoVariants}
              whileHover={{
                rotate: 10,
                scale: 1.1,
                transition: { duration: 0.5 }
              }}
              animate={isInView ? {
                rotate: [-20, -15, -25, -20],
                transition: {
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                }
              } : {}}
              className="transform -rotate-[20deg]"
            >
              <img
                src={LogoWC}
                alt="Wild Crunch Logo"
                className="h-36 w-auto"
              />
            </motion.div>
          </motion.div>

          {/* Explore */}
          <motion.div 
            variants={sectionVariants}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.h3 
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="font-jost font-bold text-[#275AF3] text-lg mb-4"
            >
              EXPLORE
            </motion.h3>
            <ul className="space-y-3">
              {["Our Story", "Dealerships", "Contact"].map((item, index) => (
                <motion.li key={item} variants={linkVariants}>
                  <motion.a 
                    href={`/${item.toLowerCase().replace(" ", "-")}`} 
                    className="text-[#466DDF] font-jost"
                    whileHover={{
                      color: "#275AF3",
                      x: 10,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {item}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Learn */}
          <motion.div 
            variants={sectionVariants}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.h3 
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="font-jost font-bold text-[#275AF3] text-lg mb-4"
            >
              LEARN
            </motion.h3>

            
<ul className="space-y-2">
  {[
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Testimonial", path: "#testimonials", onClick: handleTestimonialClick },
    { label: "Cart", path: "/cart" },
    { label: "WishList", path: "/wishlist" },
  ].map((link) => (
    <motion.li key={link.label} variants={linkVariants}>
      <motion.a
        href={link.path}
        className="text-[#466DDF] font-jost"
        onClick={link.onClick || undefined}
        whileHover={{
          color: "#275AF3",
          x: 10,
          transition: { duration: 0.3 },
        }}
      >
        {link.label}
      </motion.a>
    </motion.li>
  ))}
</ul>

          </motion.div>

          {/* Location */}
          <motion.div 
            variants={sectionVariants}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.h3 
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="font-jost font-bold text-[#275AF3] text-lg mb-4"
            >
              LOCATION
            </motion.h3>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="text-[#466DDF] font-jost leading-relaxed text-sm"
            >
              <p>Survey No. 43, Shed No. 33,</p>
              <p>Dhanda, Himmatnagar—Idar Highway,</p>
              <p>Near Montage Laboratories,</p>
              <p>Himmatnagar — 383001, Gujarat, India</p>

<div className="flex items-center gap-3 mt-4 justify-center lg:justify-start text-[#466DDF]">
  {[Instagram, Linkedin, Twitter].map((Icon, index) => {
    // Social links array in the same order as icons
    const links = [
      "https://www.instagram.com/wild_crunch?igsh=MWl1c21xdzd6cmYwbQ%3D%3D&utm_source=qr", 
      "#", 
      "#"
    ];

    return (
      <motion.a
        key={index}
        href={links[index]}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`social-${index}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{
          delay: 1.6 + index * 0.2,
          type: "spring",
          damping: 15,
          stiffness: 200,
        }}
        whileHover={{
          scale: 1.3,
          color: "#275AF3",
          y: -5,
          transition: { duration: 0.3 },
        }}
        whileTap={{
          scale: 0.9,
          transition: { duration: 0.2 },
        }}
        className="hover:opacity-80"
      >
        <Icon size={18} />
      </motion.a>
    );
  })}
</div>

            </motion.div>
          </motion.div>
        </motion.div>

        {/* Heartbeat / wavy line */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 3.0, duration: 0.8 }}
          className="mt-16 relative"
        >
          <svg
            viewBox="0 0 1200 28"
            preserveAspectRatio="none"
            className="w-full h-7"
          >
            <motion.path
              variants={pathVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              d={pathData}
              fill="none"
              stroke="#466DDF"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Bottom copyright */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 3.5, duration: 0.8 }}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row items-center justify-between text-[#466DDF] mt-2 mb-4 ml-6 mr-6">
            <p className="text-sm font-jost">
              © {new Date().getFullYear()} WildCrunch - All Rights Reserved
            </p>
            <motion.a
              href="https://codelix.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-jost mt-3 md:mt-0 hover:underline"
              whileHover={{
                color: "#275AF3",
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              Powered By Codelix IT Solutions Pvt. Ltd.
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* ================= Mobile View ================= */}
      <div className="relative z-10 flex flex-col lg:hidden px-6 py-8 min-h-[70vh]">
        {/* Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -30, scale: 0.9 }}
          transition={{ 
            type: "spring",
            damping: 20,
            stiffness: 100,
            delay: 0.3
          }}
          className="text-center font-suez text-[#325DE8] text-3xl leading-snug mb-8 mt-12"
        >
          Thank You For Your Curiosity.
        </motion.h2>

        {/* Explore + Learn row */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex justify-between mr-8 ml-8"
        >
          {/* Explore */}
          <div className="flex flex-col text-left">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="font-jost font-bold text-[#275AF3] text-lg mb-2"
            >
              EXPLORE
            </motion.h3>
            <ul className="space-y-2">
              {["Our Story", "Dealerships", "Contact"].map((item, index) => (
                <motion.li 
                  key={item}
                  initial={{ opacity: 0, x: -15 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
                  transition={{ delay: 1.0 + index * 0.1, duration: 0.5 }}
                  className="text-[#466DDF] font-jost"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div className="flex flex-col text-left">
            <motion.h3 
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="font-jost font-bold text-[#275AF3] text-lg mb-2"
            >
              LEARN
            </motion.h3>
<ul className="space-y-2">
  {[
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Testimonial", path: "#testimonials", onClick: handleTestimonialClick },
    { label: "Cart", path: "/cart" },
    { label: "WishList", path: "/wishlist" },
  ].map((link) => (
    <motion.li key={link.label} variants={linkVariants}>
      <motion.a
        href={link.path}
        className="text-[#466DDF] font-jost"
        onClick={link.onClick || undefined}
        whileHover={{
          color: "#275AF3",
          x: 10,
          transition: { duration: 0.3 },
        }}
      >
        {link.label}
      </motion.a>
    </motion.li>
  ))}
</ul>

          </div>
        </motion.div>

        {/* Custom border full screen */}
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ delay: 1.5, duration: 1.5 }}
          className="mt-6 w-screen relative right-6"
        >
          <svg
            viewBox="0 0 1200 28"
            preserveAspectRatio="none"
            className="w-screen h-6"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ delay: 1.8, duration: 2 }}
              d={pathData}
              fill="none"
              stroke="#466DDF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Location with heading + icons inline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="mt-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-jost font-bold text-[#275AF3] text-lg">
              LOCATION
            </h3>
            <div className="flex gap-3 text-[#466DDF]">
              {[Instagram, Linkedin, Twitter].map((Icon, index) => (
                <motion.a 
                  key={index}
                  href="#" 
                  aria-label={`social-mobile-${index}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ 
                    delay: 2.4 + index * 0.2,
                    type: "spring",
                    damping: 15,
                    stiffness: 200
                  }}
                  whileTap={{
                    scale: 1.3,
                    transition: { duration: 0.2 }
                  }}
                  className="hover:opacity-80"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Address */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 2.8, duration: 0.6 }}
            className="text-[#466DDF] font-jost leading-relaxed text-sm mt-4 text-left"
          >
            <p>Survey No. 43, Shed No. 33,</p>
            <p>Dhanda, Himmatnagar—Idar Highway,</p>
            <p>Near Montage Laboratories,</p>
            <p>Himmatnagar — 383001, Gujarat, India</p>
          </motion.div>
        </motion.div>

        {/* Custom border full screen */}
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ delay: 3.0, duration: 1.5 }}
          className="mt-6 w-screen relative right-6"
        >
          <svg
            viewBox="0 0 1200 28"
            preserveAspectRatio="none"
            className="w-screen h-6"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ delay: 3.2, duration: 2 }}
              d={pathData}
              fill="none"
              stroke="#466DDF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 3.5, duration: 0.8 }}
          className="text-left text-[#466DDF] mt-4"
        >
          <p className="text-sm font-jost">
            © {new Date().getFullYear()} WildCrunch - All Rights Reserved
          </p>
          <motion.a
            href="https://codelix.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-jost mt-3 md:mt-0 hover:underline"
            whileTap={{
              color: "#275AF3",
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
          >
            Powered By Codelix IT Solutions Pvt. Ltd.
          </motion.a>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;