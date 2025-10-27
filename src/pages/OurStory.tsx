import Header from "@/components/Header";
import Hero from "@/components/Our Story/Hero";
import RightCrunch from "@/components/Our Story/Rightcrunch";
import SliderSection from "@/components/Our Story/slider"
import OurMission from "@/components/Our Story/Ourmission";
import TestimonialsSection from "@/components/Main Page/TestimonialsSection";
import CommunitySection from "@/components/Main Page/CommunitySection";
import Footer from "@/components/Footer";


import HighProteinIcon from "@/assets/proteinLogo.png";
import LowCaloriesIcon from "@/assets/calourieLogo.png";
import IngredientsIcon from "@/assets/ingredientsLogo.png";
import GlutenFreeIcon from "@/assets/GlutenLogo.png";
import FlavorIcon from "@/assets/deliciousLogo.png";


const OurStory = () => {
  return (
    <div className="min-h-screen bg-[#F8F7E5]">
      <Header/>
      <Hero/>

 <div className="relative z-10 max-w-8xl px-8 mt-5 mb-5 sm:mt-20 sm:mb-20">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center gap-10 sm:gap-0">
    
    {/* Feature 1 */}
    <div className="flex items-start space-x-4 w-[260px]">
      <img src={HighProteinIcon} alt="High Protein" className="w-12 h-12 flex-shrink-0" />
      <div className="flex flex-col text-left w-full">
        <h3 className="text-base md:text-lg font-suez text-[#325DE8] leading-tight">
          High Protein
        </h3>
        <p className="text-xs md:text-sm text-[#466DDF] font-jost leading-tight">
          Fuel your body with every crunchy bite.
        </p>
      </div>
    </div>

    {/* Feature 2 */}
    <div className="flex items-start space-x-4 w-[260px]">
      <img src={LowCaloriesIcon} alt="Low In Calories" className="w-12 h-12 flex-shrink-0" />
      <div className="flex flex-col text-left w-full">
        <h3 className="text-base md:text-lg font-suez text-[#325DE8] leading-tight">
          Low In Calories
        </h3>
        <p className="text-xs md:text-sm text-[#466DDF] font-jost leading-tight">
          Guilt-free snacking anytime
        </p>
      </div>
    </div>

    {/* Feature 3 */}
    <div className="flex items-start space-x-4 w-[260px]">
      <img src={IngredientsIcon} alt="Good Ingredients" className="w-12 h-12 flex-shrink-0" />
      <div className="flex flex-col text-left w-full">
        <h3 className="text-base md:text-lg font-suez text-[#325DE8] leading-tight">
          Good Ingredients
        </h3>
        <p className="text-xs md:text-sm text-[#466DDF] font-jost leading-tight">
          Only the best for you
        </p>
      </div>
    </div>

    {/* Feature 4 */}
    <div className="flex items-start space-x-4 w-[260px]">
      <img src={GlutenFreeIcon} alt="Gluten Free & Healthy" className="w-12 h-12 flex-shrink-0" />
      <div className="flex flex-col text-left w-full">
        <h3 className="text-base md:text-lg font-suez text-[#325DE8] leading-tight">
          Gluten-Free & Healthy
        </h3>
        <p className="text-xs md:text-sm text-[#466DDF] font-jost leading-tight">
          Better snacking, no worries
        </p>
      </div>
    </div>

    {/* Feature 5 */}
    <div className="flex items-start space-x-4 w-[260px]">
      <img src={FlavorIcon} alt="Deliciously Flavorful" className="w-12 h-12 flex-shrink-0" />
      <div className="flex flex-col text-left w-full">
        <h3 className="text-base md:text-lg font-suez text-[#325DE8] leading-tight">
          Deliciously Flavorful
        </h3>
        <p className="text-xs md:text-sm text-[#466DDF] font-jost leading-tight">
          Exciting flavors in every bite
        </p>
      </div>
    </div>

  </div>
</div>






       <RightCrunch/>
       <SliderSection/>
     <OurMission/>
      <CommunitySection/>
      <TestimonialsSection/>
      
      <Footer/>

    </div>
  );
};

export default OurStory;