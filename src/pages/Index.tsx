import Top from "@/components/Main Page/Top";
import Header from "@/components/Header";
import HeroSection from "@/components/Main Page/HeroSection";
import ProductGrid from "@/components/Main Page/ProductGrid";
import ProteinSection from "@/components/Main Page/ProteinSection";
import CrunchEraSection from "@/components/Main Page/CrunchEraSection";
import WelcomeSection from "@/components/Main Page/WelcomeSection";
import CommunitySection from "@/components/Main Page/CommunitySection";
import TestimonialsSection from "@/components/Main Page/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Top />
      <Header />
      <HeroSection />
      <ProductGrid />
      <ProteinSection />
      <CrunchEraSection />
      <WelcomeSection />
      <CommunitySection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
