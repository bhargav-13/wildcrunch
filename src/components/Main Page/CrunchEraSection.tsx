import React from 'react';

// Import your local images from assets
import ProteinPuff from '@/assets/proteinpuff.png';
import PopCorn from '@/assets/popcorn1.png';
import CrunchyMakhana from '@/assets/crunchymakhana.png';
import Makhana from '@/assets/makhana.png';
import PremiumMakhana from '@/assets/premiummakhana.png';

import HighProteinIcon from "@/assets/proteinLogo.png";
import LowCaloriesIcon from "@/assets/calourielogo.png";
import IngredientsIcon from "@/assets/ingredientslogo.png";
import GlutenFreeIcon from "@/assets/Glutenlogo.png";
import FlavorIcon from "@/assets/deliciouslogo.png";
import pointsBG from "@/assets/pointsbg.png";

const CrunchEraSection = () => {
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
    {
      name: ["CRUNCHY", "MAKHANA"],
      description: "OUR MAKHANA IS LIGHT, CRUNCHY, AND WHOLESOME. A TASTY SNACK YOU'LL LOVE, GUILT-FREE.",
      imageSrc: Makhana,
      bgColor: "bg-[#F0C4A7]",
    },
    {
      name: ["PREMIUM", "MAKHANA"],
      description: "PREMIUM MAKHANA THAT BLENDS PURITY, FLAVOR, AND ELEGANCE IN EVERY CRUNCH.",
      imageSrc: PremiumMakhana,
      bgColor: "bg-[#BE9A5E]",
    },
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-[#F8F7E5] overflow-hidden">
      {/* Tilted background div (desktop only) */}
      <div className="absolute top-[680px] left-[-150px] w-[1200px] h-[300px] bg-white transform -rotate-[35deg] sm:top-[900px] sm:left-[-200px] sm:w-[2800px] sm:h-[400px] sm:-rotate-[10deg] origin-top-left z-0"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Main Heading */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-suez text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-gray-800 tracking-wider">
            CRUNCH ERA
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-12 xl:gap-x-16 gap-y-24 sm:gap-y-48 max-w-7xl mx-auto mt-24 sm:mt-48">
          {products.map((product, index) => (
            <div
              key={index}
              className={`${product.bgColor} rounded-3xl p-3 sm:p-6 relative min-h-[200px] sm:min-h-[100px] overflow-visible`}
              style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }} // Added small side margins for mobile
            >
              <div className="flex flex-col h-full">
                {/* Product Image */}
                <div className="text-center mb-[-10px] flex-shrink-0 -mt-24 sm:-mt-48">
                  <img
                    src={product.imageSrc}
                    alt={product.name.join(" ")}
                    className="max-w-none w-[160px] sm:w-[400px] h-auto mx-auto transform transition-transform duration-500 hover:-rotate-45"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow flex flex-col justify-end text-white text-left">
                  <h3 className="font-suez text-base sm:text-4xl md:text-5xl mb-2 sm:mb-3 uppercase tracking-wide leading-tight">
                    {product.name.map((line, i) => (
                      <span key={i} className="block">{line}</span>
                    ))}
                  </h3>
                  <p className="font-jost text-[8px] sm:text-xs leading-relaxed uppercase">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Arrow Button */}
              <div className="absolute -bottom-3 sm:-bottom-5 -right-4 sm:-right-8 w-10 sm:w-16 h-10 sm:h-16 bg-[#F1E613] rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 sm:w-6 h-3 sm:h-6 text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 19L19 5m0 0H5.5M19 5v13.5"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
        
        {/* Explore More Button */}
        <div className="text-center mt-8 sm:mt-16">
          <button className="font-sfpro text-xs sm:text-sm uppercase tracking-wide px-6 sm:px-8 py-2 sm:py-3 border border-[#C06441] text-[#C06441] rounded-full hover:bg-[#F1B213] hover:border-[#F1B213] hover:text-white transition-colors">
           Explore More
          </button>
        </div>

        
       


      </div>



        <div className="relative w-full py-20 px-6 overflow-hidden z-10 mt-10">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={pointsBG}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Features */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-12 md:gap-x-20 md:gap-y-16 max-w-7xl mx-auto">
        {/* Feature 1 */}
        <div className="flex items-center space-x-4 max-w-xs">
          <img src={HighProteinIcon} alt="High Protein" className="w-12 h-12" />
          <div>
            <h3 className="text-xl font-suez text-[#325DE8]">High Protein</h3>
            <p className="text-[#466DDF] font-jost">
              Fuel your body with every crunchy bite.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-center space-x-4 max-w-xs">
          <img
            src={LowCaloriesIcon}
            alt="Low In Calories"
            className="w-12 h-12"
          />
          <div>
            <h3 className="text-xl font-suez text-[#325DE8]">Low In Calories</h3>
            <p className="text-[#466DDF] font-jost">Guilt-free snacking anytime.</p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-center space-x-4 max-w-xs">
          <img
            src={IngredientsIcon}
            alt="Good Ingredients"
            className="w-12 h-12"
          />
          <div>
            <h3 className="text-xl font-suez text-[#325DE8]">Good Ingredients</h3>
            <p className="text-[#466DDF] font-jost">Only the best for you.</p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="flex items-center space-x-4 max-w-xs">
          <img
            src={GlutenFreeIcon}
            alt="Gluten Free & Healthy"
            className="w-12 h-12"
          />
          <div>
            <h3 className="text-xl font-suez text-[#325DE8]">
              Gluten-Free & Healthy
            </h3>
            <p className="text-[#466DDF] font-jost">Better snacking, no worries.</p>
          </div>
        </div>

        {/* Feature 5 */}
        <div className="flex items-center space-x-4 max-w-xs">
          <img src={FlavorIcon} alt="Deliciously Flavorful" className="w-12 h-12" />
          <div>
            <h3 className="text-xl font-suez text-[#325DE8]">
              Deliciously Flavorful
            </h3>
            <p className="text-[#466DDF] font-jost">
              Exciting flavors in every bite.
            </p>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default CrunchEraSection;
