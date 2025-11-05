import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ✅ Desktop Image
import img6 from "@/assets/img6.png";

// ✅ Mobile Image
import img9M from "@/assets/9M.png";

const FullScreenSlider = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallLaptop, setIsSmallLaptop] = useState(false);

  // ✅ Detect screen size for mobile & small laptops
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmallLaptop(window.innerWidth > 768 && window.innerWidth <= 1280);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <section className="relative w-full bg-[#F8F7E5] overflow-hidden">
      <motion.div
        className={`relative w-full overflow-hidden flex items-center justify-center ${
          isMobile
            ? "h-[65vh]" // taller for mobile
            : "h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[80vh] xl:h-[85vh]"
        }`}
        initial={{ opacity: 0, scale: 1.05, y: 100 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <img
          src={isMobile ? img9M : img6}
          alt="Offer"
          className={`
            w-full h-full
            ${isMobile
              ? "object-contain"
              : isSmallLaptop
              ? "object-contain" // ✅ show full image on smaller laptops
              : "object-cover"} // ✅ fill large screens beautifully
            bg-[#F8F7E5]
          `}
        />
      </motion.div>
    </section>
  );
};

export default FullScreenSlider;
