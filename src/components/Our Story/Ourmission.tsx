import React from "react";
import { UserCircle } from "lucide-react";
import OurStoryBG from "@/assets/ourstorybg.png";

const OurMission = () => {
  return (
    <div className="w-full bg-[#F8F7E5] py-16 px-6 md:px-12">
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl text-center font-suez text-[#1a1a1a] mb-12">
        Our Mission
      </h2>

      {/* Grid layout */}
      <div className="grid grid-cols-5 grid-rows-3 gap-4 max-w-7xl mx-auto">
        {/* Div1: Big Photo */}
        <div className="col-span-3 row-span-2">
          <img
            src={OurStoryBG}
            alt="Our Story"
            className="w-[800px] h-[400px] object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Div2: Card with L-shape */}
        <div className="col-span-4 row-span-1 col-start-1 row-start-3">
          <div
            className="bg-[#FFE0D3] p-6 rounded-xl shadow-md flex items-start gap-4 h-full"
            style={{
              clipPath:
                "polygon(0 0, 70% 0, 70% 60%, 100% 60%, 100% 100%, 0 100%)",
            }}
          >
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center bg-white">
              <UserCircle className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h4 className="font-jost font-semibold text-lg text-black">
                Rachel Hadid
              </h4>
              <p className="font-jost text-sm text-gray-700 mt-2 max-w-2xl">
                1 Choosing the real estate service was the best decision I ever
                made. Their team demonstrated exceptional professionalism and
                expertise. I highly recommend their services to anyone!
              </p>
            </div>
          </div>
        </div>

        {/* Div3: Card */}
        <div className="col-span-2 row-span-1 col-start-4 row-start-2 bg-[#FFE0D3] p-6 rounded-xl shadow-md flex items-start gap-4">
          <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center bg-white">
            <UserCircle className="w-8 h-8 text-gray-600" />
          </div>
          <div>
            <h4 className="font-jost font-semibold text-lg text-black">
              Rachel Hadid
            </h4>
            <p className="font-jost text-sm text-gray-700 mt-2">
              2 Choosing the real estate service was the best decision I ever
              made. Their team demonstrated exceptional professionalism and
              expertise. I highly recommend their services to anyone!
            </p>
          </div>
        </div>

        {/* Div4: Card */}
        <div className="col-span-2 row-span-1 col-start-4 row-start-1 bg-[#FFE0D3] p-6 rounded-xl shadow-md flex items-start gap-4">
          <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center bg-white">
            <UserCircle className="w-8 h-8 text-gray-600" />
          </div>
          <div>
            <h4 className="font-jost font-semibold text-lg text-black">
              Rachel Hadid
            </h4>
            <p className="font-jost text-sm text-gray-700 mt-2">
              3 Choosing the real estate service was the best decision I ever
              made. Their team demonstrated exceptional professionalism and
              expertise. I highly recommend their services to anyone!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurMission;
