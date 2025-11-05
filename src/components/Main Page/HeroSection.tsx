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

  // ✅ Choose correct image set
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
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // ✅ Randomize direction for subtle transitions
  const randomDir = () => (Math.random() > 0.5 ? 1 : -1);

  return (
    <section className="relative w-full bg-[#F8F7E5] overflow-hidden">
      {/* ✅ Top gap for floating header */}
      <div className="h-[100px] lg:h-[85px] bg-[#F8F7E5]"></div>

      {/* ✅ Image slider container */}
      <div
        className={`relative overflow-hidden perspective-[1500px] ${
          isMobile ? "w-screen h-[60vh]" : "w-full h-[85vh]"
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={images[index]}
            src={images[index]}
            alt={`slide-${index}`}
            className={`absolute inset-0 ${
              isMobile
                ? "w-screen h-[55vh] object-cover bg-[#F8F7E5]" // ✅ Full-width mobile fix
                : "w-full h-full object-cover"
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
  );
};

export default HeroSection;
