import productGrid from "@/assets/Our Story_BG.png";
import { ArrowDown, ChevronDown } from "lucide-react";
import { motion } from "framer-motion"; 
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate

const ProductGrid = () => {
  const navigate = useNavigate(); // ✅ inside the component

  return (
    <section className="py-20 bg-[#F8F7E5] text-center">
      {/* Top text with custom arrow */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, duration: 1 }}
      >
        <div className="flex flex-col items-center">
          {/* Longer line */}
          <span className="w-[3px] h-20 bg-[#BE9A5E]"></span>

          {/* Arrow head touching the line */}
          <ChevronDown
            size={28}
            strokeWidth={2}
            className="text-[#BE9A5E] -mt-[15px]"
          />

          {/* Heading */}
          <h3 className="font-sfpro text-[#BE9A5E] tracking-widest uppercase text-2xl mt-2">
            DISCOVER OUR STORY
          </h3>
        </div>
      </motion.div>

      {/* Product grid image */}
      <motion.div
        className="max-w-6xl mx-auto h-[600px] overflow-hidden rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, duration: 1 }}
      >
        <img
          src={productGrid}
          alt="Grid of four colorful snack packages showcasing different flavor varieties"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Paragraph */}
      <motion.div
        className="max-w-4xl mx-auto mt-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, duration: 1, delay: 0.2 }}
      >
        <p className="font-jost text-xl leading-relaxed text-black">
          Our story began with a simple idea, snacking should be tasty, light, and guilt-free. 
          From crunchy makhana to flavorful popcorn, every bite is made with care and quality ingredients. 
          We believe snacks should bring joy, not heaviness. That’s why we create flavors that make you feel good, inside and out.
        </p>
      </motion.div>

      {/* Discover button */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, duration: 1, delay: 0.4 }}
      >
        <button
          className="font-sfpro text-sm uppercase tracking-wide px-8 py-3 border border-[#C06441] text-[#C06441] rounded-full hover:bg-[#F1B213] hover:border-[#F1B213] hover:text-white transition-colors"
          onClick={() => navigate("/our-story")} // ✅ navigate to internal route
        >
          Discover More
        </button>
      </motion.div>
    </section>
  );
};

export default ProductGrid;
