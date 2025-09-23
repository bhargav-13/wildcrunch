import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroImg from "@/assets/HeroImg.png";
import Perks from "@/components/Dealerships/Perks";
import OurWork from "@/components/Dealerships/OurWorking";
import Form from "@/components/Dealerships/Form";

const Dealerships = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
 <section className="relative w-full">


      {/* Background with text */}
      <div
        className="relative w-full min-h-[90vh] flex items-start justify-center"
        style={{
          backgroundImage: `url(${HeroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >


      </div>
    </section>
    
      <OurWork/>
      <Perks/>
      <Form/>
      <Footer />
    </div>
  );
};

export default Dealerships;