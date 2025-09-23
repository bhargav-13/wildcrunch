import React from "react";
import Oustory_hero from "@/assets/Ourstory_Hero.png";
import hero2 from "@/assets/Ourstory_Hero2.png";

const Hero = () => {
  return (
    <div className="w-full bg-[#F8F7E5] py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Right side content (heading + text) */}
        <div className="w-full lg:w-1/2 flex flex-col order-1 lg:order-2 mt-10 lg:mt-10">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-suez text-foreground leading-snug mb-6 text-center lg:text-left">
            We believe snacking should be tasty, light, and guilt-free
          </h1>

          {/* Mobile only spacing so details come below images */}
          <div className="hidden lg:block">
            <p className="font-jost text-lg text-gray-600 mb-4">
              Snacking is often seen as either healthy or delicious — but we
              believe it can be both. At WildCrunch, our goal is simple: to make
              snacks that taste amazing while keeping you light and energized.
            </p>
            <p className="font-jost text-lg text-gray-600">
              From crunchy makhana to flavorful popcorn and protein puffs, every
              pack is made with natural ingredients and a lot of care. We want our
              snacks to fit into your everyday life — whether it’s a quick break
              at work, a movie night, or just something to share with friends.
            </p>
          </div>
        </div>

        {/* Left side images */}
        <div className="relative w-full lg:w-1/2 flex justify-center min-h-[350px] sm:min-h-[450px] lg:min-h-[550px] order-2 lg:order-1">
          {/* First Hero Image */}
          <img
            src={Oustory_hero}
            alt="Hero main"
            className="w-[290px] h-[280px] sm:w-[350px] lg:w-[450px] lg:h-[400px] h-auto object-cover relative top-6 sm:top-10 -left-2 sm:-left-6"
          />
          {/* Second Hero Image overlapping */}
          <img
            src={hero2}
            alt="Hero secondary"
            className="w-[180px] sm:w-[220px] lg:w-[250px] border-8 border-white object-cover absolute top-52 sm:top-80 right-[-10px] sm:right-[-10px]"
          />
        </div>

        {/* Details (only visible on mobile under images) */}
        <div className="w-full order-3 lg:hidden mt-6">
          <p className="font-jost text-lg text-gray-600 mb-4">
            Snacking is often seen as either healthy or delicious — but we
            believe it can be both. At WildCrunch, our goal is simple: to make
            snacks that taste amazing while keeping you light and energized.
          </p>
          <p className="font-jost text-lg text-gray-600">
            From crunchy makhana to flavorful popcorn and protein puffs, every
            pack is made with natural ingredients and a lot of care. We want our
            snacks to fit into your everyday life — whether it’s a quick break
            at work, a movie night, or just something to share with friends.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
