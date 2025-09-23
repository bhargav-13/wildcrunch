import React from 'react';

// Import your local images from assets
import ProteinPuff from '@/assets/ProteinPuff.png';
import PopCorn from '@/assets/PopCorn.png';
import CrunchyMakhana from '@/assets/CrunchyMakhana.png';



const Others = () => {
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
    },]
   

  return (
    <section className="w-screen h-auto bg-[#F8F7E5] flex flex-col items-center py-16 gap-12 ">
    

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Main Heading */}
<div className="w-full flex justify-between items-center mb-12 lg:mb-16 px-4">
  {/* Left Side */}
  <h2 className="font-suez text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-800 tracking-wider">
    OTHER PRODUCT FROM CRUNCH
  </h2>

  {/* Right Side */}
  <span className="font-jost text-lg sm:text-xl md:text-xl text-gray-800">
    All Product
  </span>
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
        


        
       


      </div>

    </section>
  );
};

export default Others;
