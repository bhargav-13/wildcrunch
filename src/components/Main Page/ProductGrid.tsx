import productGrid from "@/assets/Our Story_BG.png";
import { ArrowDown } from "lucide-react";
import { ChevronDown } from "lucide-react";

const ProductGrid = () => {
  return (
    <section className="py-20 bg-[#F8F7E5] text-center">


 

{/* Top text with custom arrow */}
<div className="mb-10">
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
</div>



      {/* Product grid image */}
      <div className="max-w-6xl mx-auto h-[600px] overflow-hidden rounded-xl">
  <img
    src={productGrid}
    alt="Grid of four colorful snack packages showcasing different flavor varieties"
    className="w-full h-full object-cover"
  />
</div>


      {/* Paragraph */}
      <div className="max-w-4xl mx-auto mt-10">
        <p className="font-jost text-xl leading-relaxed text-black">
          Our story began with a simple idea, snacking should be tasty, light, and guilt-free. 
          From crunchy makhana to flavorful popcorn, every bite is made with care and quality ingredients. 
          We believe snacks should bring joy, not heaviness. That’s why we create flavors that make you feel good, inside and out.
        </p>
      </div>

      {/* Discover button */}
      <div className="mt-8">
        <button className="font-sfpro text-sm uppercase tracking-wide px-8 py-3 border border-[#C06441] text-[#C06441] rounded-full hover:bg-[#F1B213] hover:border-[#F1B213] hover:text-white transition-colors">
          Discover More
        </button>
      </div>
    </section>
  );
};

export default ProductGrid;
