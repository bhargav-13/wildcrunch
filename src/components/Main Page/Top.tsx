import React from "react";
import HeaderImg from "@/assets/Header_img.png";

const Top: React.FC = () => {
  const items = Array(50).fill("Happy client");

  return (
    <div className="w-full overflow-hidden py-2 bg-[#f1b213] z-[61] relative">
      <div className="flex animate-marquee whitespace-nowrap gap-24">
        {items.map((text, idx) => (
          <div
            key={idx}
            className="flex items-center mx-6 text-[#C06441] font-suez"
          >
            <img
              src={HeaderImg}
              alt="Header"
              className="h-5 w-auto sm:h-6 md:h-7 lg:h-8"
            />
            <span className="ml-2 text-sm sm:text-base md:text-lg lg:text-xl whitespace-nowrap">
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top;
