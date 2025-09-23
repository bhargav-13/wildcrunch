import React from "react";
import { ArrowUpRight } from "lucide-react";
import CommunityBG from "@/assets/CommunityBG.png"; // Update path if needed

const CommunitySection = () => {
  return (
    <section
      className="relative min-h-[70vh] py-15 bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${CommunityBG})` }}
    >
      <div className="container mx-auto px-4 sm:px-0 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-12 text-left px-2 sm:px-0 lg:px-8">
            <h1 className="max-w-12xl text-6xl sm:text-7xl lg:text-8xl font-suez text-white leading-snug sm:leading-tight">
              BECOME
              <br />
              <div className="flex items-center lg:justify-start gap-4">
                <span className="text-6xl sm:text-7xl lg:text-8xl">PART</span>
                <span className="mx-3 text-base sm:text-xl lg:text-2xl font-suez leading-snug text-center">
                  BE THE
                  <br />
                  FIRST
                </span>
                <span className="text-6xl sm:text-7xl lg:text-8xl">OF</span>
              </div>
              OUR HOOD
            </h1>
          </div>

          {/* Right Content */}
          <div className="space-y-8 max-w-xl text-center lg:text-left px-2 sm:px-0 lg:px-8">
            <p className="font-jost text-white text-lg sm:text-xl lg:text-2xl leading-relaxed text-center lg:text-left mx-2 sm:mx-0">
              Only True Snack Lovers Who Join Our Wild Crunch Community Get The
              First Taste Of What’s Next. From New Flavors To Special Offers, We
              Celebrate Those Who’ve Been With Us From The Very Beginning Of
              This Crunchy Adventure.
            </p>

            {/* Email Input + Button */}
            <div className="relative flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full bg-transparent text-white placeholder-white focus:outline-none text-left"
                />
                {/* Underlines with more spacing */}
                <div className="space-y-4">
                  <div className="border-b border-white w-full"></div>
                  <div className="border-b border-dotted border-white w-full"></div>
                </div>
              </div>
              <button className="w-14 h-14 flex items-center justify-center rounded-full bg-[#FECACA] hover:bg-[#fdaaaa] transition">
                <ArrowUpRight className="w-6 h-6 text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
