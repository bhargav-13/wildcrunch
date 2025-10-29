import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ✅ Desktop Image
import img6 from "@/assets/img6.jpg";

// ✅ Mobile Image
import img9M from "@/assets/9M.png";

const FullScreenSlider = () => {
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative w-full bg-[#F8F7E5] overflow-hidden">
      {/* ✅ On-scroll animation for single image */}
      <motion.div
        className={`relative w-full overflow-hidden ${
          isMobile
            ? "h-[65vh]" // taller on mobile
            : "h-[40vh] sm:h-[55vh] md:h-[70vh] lg:h-[85vh]"
        }`}
        initial={{ opacity: 0, scale: 1.1, y: 100 }}
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
            w-full h-full shadow-lg mx-auto
            ${isMobile ? "object-contain" : "object-cover"}
          `}
        />
      </motion.div>
    </section>
  );
};

export default FullScreenSlider;
