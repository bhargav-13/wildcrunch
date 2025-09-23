import React from "react";

// Import images
import Crunch1 from "@/assets/Crunch1.png";
import Crunch2 from "@/assets/Crunch2.png";
import Crunch3 from "@/assets/Crunch3.png";
import Crunch4 from "@/assets/Crunch4.png";

const Rightcrunch = () => {
  return (
    <div className="w-full bg-[#F8F7E5] py-20">
      {/* Heading Section */}
      <div className="max-w-6xl mx-auto text-center mb-12 px-6 lg:px-12">
        <h2 className="font-suez text-3xl sm:text-4xl lg:text-5xl text-foreground leading-snug mb-4">
          With the right crunch, flavor and lightness in every bite
        </h2>
        <p className="font-jost text-lg text-gray-600 mt-10">
          WildCrunch makes snacking simple, fun, and guilt-free. Every product is
          crafted to give you the taste you love and the lightness your body
          deserves. We’re here to bring you snacks that fit perfectly into your
          everyday moments — from work breaks to movie nights.
        </p>
      </div>

      {/* Products Section */}
      <div className="w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 px-6 lg:px-0 justify-items-center lg:justify-items-stretch">
          <div className="w-full">
            <img
              src={Crunch1}
              alt="Crunch 1"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="w-full">
            <img
              src={Crunch2}
              alt="Crunch 2"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="w-full">
            <img
              src={Crunch3}
              alt="Crunch 3"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="w-full">
            <img
              src={Crunch4}
              alt="Crunch 4"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightcrunch;
