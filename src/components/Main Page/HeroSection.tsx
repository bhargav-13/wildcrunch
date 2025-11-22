import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Desktop Images
import img2 from "@/assets/img2.png";
import img10 from "@/assets/img10.jpg";
import img11 from "@/assets/img11.jpg";
import img12 from "@/assets/img12.png";

// ✅ Mobile Images (3M to 8M)
import img3M from "@/assets/3M.png";
import img4M from "@/assets/4M.png";
import img5M from "@/assets/5M.png";
import img6M from "@/assets/6M.png";
import img7M from "@/assets/7M.png";
import img8M from "@/assets/8M.png";

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState(1); // +1 for next, -1 for previous

  // ✅ Image sets
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

  // ✅ Auto change every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDotClick = (i) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <section className="relative w-full bg-[#F8F7E5] overflow-hidden">
      {/* Top gap for floating header */}
      <div className="h-[100px] lg:h-[85px] bg-[#F8F7E5]"></div>

      {/* ✅ Slider */}
      <div
        className={`relative overflow-hidden ${
          isMobile ? "w-screen h-[60vh]" : "w-full h-[85vh]"
        }`}
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.img
            key={images[index]}
            src={images[index]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
            }}
            alt={`slide-${index}`}
            className={`absolute inset-0 ${
              isMobile
                ? "w-screen h-[55vh] bg-[#F8F7E5]"
                : "w-screen h-full"
            }`}
          />
        </AnimatePresence>


        {/* ✅ Dots */}
        <div className="absolute bottom-5 w-full flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === index ? "bg-black/80 scale-110" : "bg-black/30 hover:bg-black/50"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
