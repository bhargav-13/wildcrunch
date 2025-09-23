import React from "react";
import HeaderImg from "@/assets/Header_img.png";

const Top: React.FC = () => {
  const items = Array(5).fill("Happy client");

  return (
    <div className="w-full flex items-center justify-center bg-[#f1b213] py-2 font-suez">
      {/* Responsive number of items */}
      <div className="flex justify-center items-center text-[#C06441]">
        {/* Mobile: show 2 */}
        <div className="flex sm:hidden gap-6 text-sm">
          {items.slice(0, 2).map((text, idx) => (
            <div key={idx} className="flex items-center gap-1 whitespace-nowrap">
              <img src={HeaderImg} alt="Header" className="h-5 w-auto" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Small screens: show 3 */}
        <div className="hidden sm:flex md:hidden gap-10 text-base">
          {items.slice(0, 3).map((text, idx) => (
            <div key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
              <img src={HeaderImg} alt="Header" className="h-6 w-auto" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Medium screens: show 4 */}
        <div className="hidden md:flex lg:hidden gap-14 text-lg">
          {items.slice(0, 4).map((text, idx) => (
            <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
              <img src={HeaderImg} alt="Header" className="h-7 w-auto" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Large screens: show 5 */}
        <div className="hidden lg:flex gap-[170px] text-lg">
          {items.map((text, idx) => (
            <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
              <img src={HeaderImg} alt="Header" className="h-8 w-auto" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Top;
