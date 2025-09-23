import React from "react";
import { motion } from "framer-motion";
import { Tag, Clock, Handshake, Star } from "lucide-react";

const Perks = () => {
  const perksData = [
    {
      title: "Exclusive pricing",
      detail: "Special rates for bulk orders",
      icon: <Tag className="w-8 h-8 text-[#7C4D3B]" />,
    },
    {
      title: "Timely deliveries",
      detail: "Reliable and on-time shipments",
      icon: <Clock className="w-8 h-8 text-[#7C4D3B]" />,
    },
    {
      title: "Quality snacks",
      detail: "Product that keeps customers coming back",
      icon: <Star className="w-8 h-8 text-[#7C4D3B]" />,
    },
    {
      title: "Partnership growth",
      detail: "As we grow, you grow",
      icon: <Handshake className="w-8 h-8 text-[#7C4D3B]" />,
    },
  ];

  return (
    <section className="bg-[#F8F7E5] py-16 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-0">
        {/* 3-column layout with custom widths */}
        <div className="grid grid-cols-12 gap-0">
          {/* -------- LEFT COLUMN -------- */}
          <div className="col-span-3 flex flex-col items-center justify-between">
            {/* Top card */}
            <motion.div
              className="w-full h-[250px] p-6 rounded-lg shadow-sm border-2 border-[#D6CCC1] flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-[#DD815C80] rounded-full flex items-center justify-center mb-4">
                {perksData[0].icon}
              </div>
              <h3 className="text-lg font-bold text-[#1B2735] font-suez">
                {perksData[0].title}
              </h3>
              <p className="mt-2 text-sm font-semibold text-[#1B2735]">
                {perksData[0].detail}
              </p>
            </motion.div>

            {/* Middle vertical lines (gap increased) */}
            <div className="relative h-16 flex flex-col items-center justify-center">
              <div className="absolute left-24 top-0 bottom-0 w-[3px] bg-[#D6CCC1]" />
              <div className="absolute right-24 top-0 bottom-0 w-[3px] bg-[#D6CCC1]" />
            </div>

            {/* Bottom card */}
            <motion.div
              className="w-full h-[250px] p-6 rounded-lg shadow-sm border-2 border-[#D6CCC1] flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-[#DD815C80] rounded-full flex items-center justify-center mb-4">
                {perksData[1].icon}
              </div>
              <h3 className="text-lg font-bold text-[#1B2735] font-suez">
                {perksData[1].title}
              </h3>
              <p className="mt-2 text-sm font-semibold text-[#1B2735]">
                {perksData[1].detail}
              </p>
            </motion.div>
          </div>

          {/* -------- CENTER COLUMN -------- */}
          <div className="col-span-6 flex flex-col items-center justify-center">
            {/* Center horizontal line */}
            <div className="w-full h-[3px] bg-[#D6CCC1]" />

            {/* Center title card */}
            <div className="bg-[#DD815C80] p-8 rounded-lg shadow-md text-center w-[350px] h-[250px] flex flex-col items-center justify-center mt-6 mb-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1B2735] font-suez">
                Perks of our <br /> Partnership
              </h2>
            </div>

            {/* Bottom horizontal line */}
            <div className="w-full h-[3px] bg-[#D6CCC1]" />
          </div>

          {/* -------- RIGHT COLUMN -------- */}
          <div className="col-span-3 flex flex-col items-center justify-between">
            {/* Top card */}
            <motion.div
              className="w-full h-[250px] p-6 rounded-lg shadow-sm border-2 border-[#D6CCC1] flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-[#DD815C80] rounded-full flex items-center justify-center mb-4">
                {perksData[2].icon}
              </div>
              <h3 className="text-lg font-bold text-[#1B2735] font-suez">
                {perksData[2].title}
              </h3>
              <p className="mt-2 text-sm font-semibold text-[#1B2735]">
                {perksData[2].detail}
              </p>
            </motion.div>

            {/* Middle vertical lines (gap increased) */}
            <div className="relative h-16 flex flex-col items-center justify-center">
              <div className="absolute left-24 top-0 bottom-0 w-[3px] bg-[#D6CCC1]" />
              <div className="absolute right-24 top-0 bottom-0 w-[3px] bg-[#D6CCC1]" />
            </div>

            {/* Bottom card */}
            <motion.div
              className="w-full h-[250px] p-6 rounded-lg shadow-sm border-2 border-[#D6CCC1] flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-[#DD815C80] rounded-full flex items-center justify-center mb-4">
                {perksData[3].icon}
              </div>
              <h3 className="text-lg font-bold text-[#1B2735] font-suez">
                {perksData[3].title}
              </h3>
              <p className="mt-2 text-sm font-semibold text-[#1B2735]">
                {perksData[3].detail}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Perks;
