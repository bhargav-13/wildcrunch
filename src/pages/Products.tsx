import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Product from "@/components/Product/Product"

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header/>

      {/* Two-column welcome section */}
      <section className="container mx-auto px-4 py-12 sm:px-4 sm:py-24">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Left side */}
    <div className="flex items-center justify-center">
      <h2 className="text-4xl md:text-7xl font-bold font-suez text-foreground">
        WELCOME!
      </h2>
    </div>

    {/* Right side */}
   <div className="flex justify-center">
  <p className="font-jost text-lg text-center sm:text-left leading-relaxed max-w-[340px] sm:max-w-[600px]">
    At WildCrunch, we bring light, wholesome snacks straight to your door. 
    Discover our carefully crafted range from crunchy makhana to flavorful 
    popcorn and protein-rich puffs. Each snack tells our story of passion 
    for taste, health, and quality ingredients. We hope you enjoy exploring 
    our selection and find joy in every crunch. Thank you for choosing 
    WildCrunch. Happy snacking!
  </p>
</div>


  </div>
</section>


      <Product/>

      <Footer />
    </div>
  );
};

export default Products;
