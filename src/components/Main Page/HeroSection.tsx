import { Button } from "@/components/ui/button";
import HeroImg from "@/assets/HeroImg.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate(); // ✅ hook inside the component

  return (
    <section className="relative w-full">
      {/* Bigger Top gap */}
      <div className="h-20 lg:h-30 bg-[#F8F7E5]"></div>

      {/* Background with text */}
      <div
        className="relative w-full min-h-[90vh] flex items-start justify-center"
        style={{
          backgroundImage: `url(${HeroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Content with animation */}
        <motion.div
          className="relative z-10 text-center px-4 mt-24 lg:mt-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, duration: 1 }}
        >
          <h1 className="font-sfpro font-semibold text-4xl lg:text-6xl text-[#BE9A5E] mb-3">
            CRUNCH, Taste, LIGHT
          </h1>

          <p className="font-sfpro font-normal text-lg lg:text-2xl mb-6 uppercase text-[#BE9A5E]">
            Snacks that delight keep you light.
          </p>

          <Button
            size="lg"
            className="font-sfpro font-light bg-[#F1B213] hover:bg-[#d99c10] text-white px-8 py-6 text-lg rounded-full shadow-warm"
            onClick={() => navigate("/products")} // ✅ works now
          >
            SHOP NOW
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
