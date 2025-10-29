import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Perks from "@/components/Dealerships/Perks";
import OurWork from "@/components/Dealerships/OurWorking";
import Form from "@/components/Dealerships/Form";

// ✅ Desktop images
import img12 from "@/assets/img12.jpg";
import img10 from "@/assets/img10.jpg";
import img11 from "@/assets/img11.jpg";
import img2 from "@/assets/img2.jpg";

// ✅ Mobile images
import img3M from "@/assets/3M.png";
import img4M from "@/assets/4M.png";
import img5M from "@/assets/5M.png";
import img6M from "@/assets/6M.png";
import img7M from "@/assets/7M.png";
import img8M from "@/assets/8M.png";

const Dealerships = () => {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Image arrays
  const desktopImages = [img12, img10, img11, img2];
  const mobileImages = [img3M, img4M, img5M, img6M, img7M, img8M];
  const images = isMobile ? mobileImages : desktopImages;

  // ✅ Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ Auto-change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // ✅ Slightly randomize direction for natural transitions
  const randomDir = () => (Math.random() > 0.5 ? 1 : -1);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ✅ Hero Section with image slider */}
      <section className="relative w-full bg-[#F8F7E5] overflow-hidden">
        {/* ✅ Top gap for floating header */}
        <div className="h-24 lg:h-30 bg-[#F8F7E5]"></div>

        {/* ✅ Image slider container */}
        <div
          className={`relative overflow-hidden perspective-[1500px] ${
            isMobile ? "w-full h-[65vh]" : "w-[200vh] h-[85vh]"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={images[index]}
              src={images[index]}
              alt={`slide-${index}`}
              className={`absolute inset-0 w-full h-full rounded-xl ${
                isMobile ? "object-contain bg-[#F8F7E5]" : "object-cover"
              }`}
              initial={{
                opacity: 0,
                scale: 1.2,
                rotateY: 15 * randomDir(),
                rotateX: 10 * randomDir(),
                filter: "blur(10px)",
                y: 50 * randomDir(),
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateY: 0,
                rotateX: 0,
                filter: "blur(0px)",
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 1.1,
                rotateY: -15 * randomDir(),
                rotateX: -10 * randomDir(),
                filter: "blur(8px)",
                y: -50 * randomDir(),
              }}
              transition={{
                duration: 1.6,
                ease: [0.45, 0, 0.55, 1],
              }}
            />
          </AnimatePresence>

          {/* ✨ Moving light streak */}
          <motion.div
            className="absolute top-0 left-[-50%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />

          {/* 🌫️ Ambient glow overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-black/40 mix-blend-soft-light pointer-events-none"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* 🎥 Parallax floating effect */}
          <motion.div
            className="absolute inset-0"
            animate={{
              y: [0, -10, 0, 10, 0],
              rotateZ: [0.5, -0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </section>

      {/* ✅ Additional sections */}
      <OurWork />
      <Perks />
      <Form />
      <Footer />
    </div>
  );
};

export default Dealerships;
