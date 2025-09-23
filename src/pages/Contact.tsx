import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroImg from "@/assets/hero.png";
import ContactSection from "@/components/Contact/contactSection";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative w-full mt-5">
        {/* Background with text */}
        <div
          className="relative w-[full] min-h-[80vh] flex items-start justify-center"
          style={{
            backgroundImage: `url(${HeroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 text-center px-4 mt-4 lg:mt-10">
            <h1 className="font-suez font-semibold text-4xl lg:text-7xl text-[#212121] mb-3 mt-12 lg:mt-20">
              Contact Us 
            </h1>

            <p className="font-jost font-normal text-lg lg:text-2xl mb-6 text-[#212121]">
              Discover our range and serve fresh, premium flavors that keep customers coming back.
            </p>
          </div>
        </div>
      </section>
      <ContactSection/>
      <Footer />
    </div>
  );
};

export default Contact;
