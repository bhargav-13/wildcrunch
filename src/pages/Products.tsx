import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroImg from "@/assets/hero.png";
import Product from "@/components/Product/Product";

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section (same style as Contact page) */}
      <section className="relative w-full mt-2">
        {/* Background with text */}
        <div
          className="relative w-full min-h-[80vh] flex items-start justify-center mt-12"
          style={{
            backgroundImage: `url(${HeroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 text-center px-4 mt-16 lg:mt-10">
            <h1 className="font-suez font-semibold text-4xl lg:text-7xl text-[#212121] mb-3 mt-12 lg:mt-20">
              Welcome!
            </h1>

            <p className="font-jost font-normal text-lg lg:text-2xl mb-6 text-[#212121]">
              Explore our wholesome, handcrafted range of crunchy, flavorful, and healthy snacks made with love.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <Product />

      <Footer />
    </div>
  );
};

export default Products;
