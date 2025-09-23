import { Button } from "@/components/ui/button";
import HeroImg from "@/assets/heroimg.png"; // your background image

const HeroSection = () => {
  return (
    <section className="relative w-full">
      {/* Bigger Top gap */}
      <div className="h-20 lg:h-30 bg-[#F8F7E5]"></div>

      {/* Background with text */}
      <div
        className="relative w-full min-h-[90vh] flex items-start justify-center"
        style={{
          backgroundImage: `url(${HeroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Content */}
        <div className="relative z-10 text-center px-4 mt-4 lg:mt-10">
          <h1 className="font-sfpro font-semibold text-4xl lg:text-6xl text-[#BE9A5E] mb-3">
            CRUNCH, Taste, LIGHT
          </h1>

          <p className="font-sfpro font-normal text-lg lg:text-2xl mb-6 uppercase text-[#BE9A5E]">
            Snacks that delight keep you light.
          </p>

          <Button
            size="lg"
            className="font-sfpro font-light bg-[#F1B213] hover:bg-[#d99c10] text-white px-8 py-6 text-lg rounded-full shadow-warm"
          >
            SHOP NOW
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
