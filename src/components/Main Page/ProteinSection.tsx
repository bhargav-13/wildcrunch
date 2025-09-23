import { useState, useEffect } from "react";
import Offer1 from "@/assets/Offer1.png";
import Offer2 from "@/assets/Offer2.png";
import Offer3 from "@/assets/Offer3.png";

const offers = [Offer1, Offer2, Offer3];

const FullScreenSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slider Images */}
      {offers.map((offer, index) => (
        <img
          key={index}
          src={offer}
          alt={`Offer ${index + 1}`}
          className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {offers.map((_, index) => (
          <span
            key={index}
            className="w-4 h-4 rounded-full"
            style={{
              backgroundColor:
                currentSlide === index ? "#80A305" : "#9EC319",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FullScreenSlider;
