import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Top from "@/components/Main Page/Top";
import Header from "@/components/Main Page/Main_Header";
import HeroSection from "@/components/Main Page/HeroSection";
import ProductGrid from "@/components/Main Page/ProductGrid";
import ProteinSection from "@/components/Main Page/ProteinSection";
import CrunchEraSection from "@/components/Main Page/CrunchEraSection";
import WelcomeSection from "@/components/Main Page/WelcomeSection";
import Blog from "@/components/Main Page/Blog";
import CommunitySection from "@/components/Main Page/CommunitySection";
import TestimonialsSection from "@/components/Main Page/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  const location = useLocation();

  // Handle hash navigation when component mounts or location changes
  useEffect(() => {
    // Check if there's a hash in the URL
    if (location.hash) {
      // Remove the # from hash to get the element ID
      const elementId = location.hash.substring(1);
      
      // Small delay to ensure all components are rendered
      const timer = setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [location.hash]);

return (
  <div className="min-h-screen bg-background">
    {/* Top bar only on Index */}
  <Top />
      <Header/>

    <HeroSection />
        <CrunchEraSection />
    <ProteinSection />
    <WelcomeSection />
    <Blog/>
    <CommunitySection />
    <TestimonialsSection />
    <Footer />
  </div>
);
;
};

export default Index;