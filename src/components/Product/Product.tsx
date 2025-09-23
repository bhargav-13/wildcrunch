import { useEffect } from "react";
import { useState } from "react";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import products from "@/data/product";
import Review from "./Review.tsx";
import Others from "./Others.tsx";
import FooterForInProduct from "./FooterForInProduct.tsx";
import Header from "@/components/Header";
import { useWishlist } from "@/components/WishlistContext.tsx";

// Categories
const categories = [
  "All Products",
  "Makhana",
  "Protein Puffs",
  "Popcorn",
  "Combo",
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // modal product
  const { wishlist, toggleWishlist } = useWishlist();

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All Products" ||
      product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden"; // disable page scroll
    } else {
      document.body.style.overflow = "auto"; // restore scroll
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedProduct]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-1/4 hidden md:block sticky top-20 h-fit">
          <h2 className="font-suez text-3xl text-[#212121] mb-6">SHOP ALL</h2>
          <hr className="border-t-2 border-[#212121] mb-8" />
          <ul className="space-y-3">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer font-suez text-lg ${
                  selectedCategory === cat ? "text-[#DD815C]" : "text-[#212121]"
                }`}
              >
                {cat}
                <hr className="border-b-2 border-dotted border-[#212121] w-1/2 mt-1" />
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Search bar */}
          <div className="sticky top-20 bg-background z-10 pb-16 sm:pb-10">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#C06441]"
                size={20}
              />
              <input
                type="text"
                placeholder="SEARCH"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-[#C06441] rounded-full bg-transparent placeholder-[#C06441] text-[#212121] focus:outline-none"
              />
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-20 sm:gap-x-12 sm:gap-y-24 mt-12">
            {filteredProducts.map((product, index) => (
              <div
                key={index}
                onClick={() => setSelectedProduct(product)}
                className="relative rounded-3xl p-6 shadow-md min-h-[280px] sm:min-h-[320px] overflow-visible block cursor-pointer"
                style={{ backgroundColor: product.bgColor }}
              >
                {/* Heart */}
                <button
                  className="absolute top-4 right-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                >
                  <Heart
                    size={20}
                    className={
                      wishlist.some((item) => item.id === product.id)
                        ? "fill-black"
                        : ""
                    }
                  />
                </button>

                {/* Product Image */}
                <motion.div
                  layoutId={`product-image-container-${product.id}`}
                  className="absolute -top-16 left-1/2 transform -translate-x-1/2"
                >
                  <motion.img
                    layoutId={`product-image-${product.id}`}
                    src={product.imageSrc}
                    alt={product.name}
                    className="max-w-none w-[120px] sm:w-[150px] h-auto mx-auto transform transition-transform duration-500 hover:-rotate-12"
                  />
                </motion.div>

                {/* Details */}
                <div className="mt-2 flex flex-col justify-end text-left text-white h-full">
                  <h3 className="font-suez text-lg md:text-3xl mb-1">
                    {product.name}
                  </h3>
                  <p className="font-jost text-sm">{product.weight}</p>
                  <p className="font-suez text-lg">{product.price}</p>
                </div>

                {/* Cart */}
                <button
                  className="absolute -bottom-4 -right-4 bg-[#FCEB81] w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ShoppingCart size={20} className="text-gray-800" />
                </button>
              </div>
            ))}
          </div>

          {/* Modal for selected product */}

          {/* Modal for selected product (InProduct starts here) */}
          <AnimatePresence>
            {selectedProduct && (
              <motion.div
                key="modal"
                className="fixed top-0 left-0 w-screen h-screen z-50 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <Header />

                {/* Background with grain + color fade */}
                <motion.div
                  className="absolute top-[82px] left-0 w-full h-full z-0"
                  style={{
                    backgroundColor: selectedProduct.bgColor,
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setSelectedProduct(null)}
                />

                {/* Back button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-24 left-4 bg-white/20 p-2 rounded-full"
                  style={{ zIndex: 9999 }}
                >
                  <ArrowLeft />
                </button>

                {/* Modal content */}
                <div className="relative w-full h-full flex flex-col items-center justify-start px-4 pt-32 z-50 overflow-auto hide-scrollbar">
                  <div className="w-[1400px] mx-auto flex flex-col md:flex-row gap-8">
                    {/* Left Column */}
                    <motion.div
                      className="flex-1 flex flex-col justify-between text-white"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.5,
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                    >
                      <div>
                        <motion.h2
                          className="font-suez text-xl mb-4 text-black"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                        >
                          Taste the Lightness in Every Bite of Makhana.
                        </motion.h2>
                        <motion.p
                          className="font-jost text-base text-[#DD815C]"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7, duration: 0.5 }}
                        >
                          Craving something light yet flavorful? No worries.
                          Just grab a handful of our perfectly roasted makhana,
                          seasoned to hit every taste bud with the right crunch
                          and spice. Pure, wholesome, and guilt-free. Damn
                          tasty. It’s the little joys of snacking, made better…
                        </motion.p>
                      </div>
                      <motion.div
                        className="text-right mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        <h3 className="font-suez text-xl mb-2 text-[#DD815C]">
                          INGREDIENTS
                        </h3>
                        <p className="font-suez text-base text-black">
                          Makhana (Fox Nuts), Rice Bran Oil,
                          <br /> Habanero Chili Powder, Red Chili <br />
                          Flakes, <br />
                          Rock Salt, Black Pepper, Natural Spices
                        </p>
                      </motion.div>
                    </motion.div>

                    {/* Middle Column (Product Image stays same) */}
                    <div className="flex-1 flex justify-center items-center relative">
                      <motion.div
                        layoutId={`product-image-${selectedProduct.id}`}
                        className="rounded-[80px] border-dashed border-2 border-[#DD815C] p-6"
                      >
                        <div className="rounded-[80px] border border-[#DD815C] p-4 flex justify-center items-center">
                          <motion.img
                            src={selectedProduct.imageSrc}
                            alt={selectedProduct.name}
                            className="w-[250px] sm:w-[300px]"
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Right Column */}
                    <motion.div
                      className="flex-1 flex flex-col justify-between text-white"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.5,
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        <h3 className="font-suez text-3xl mb-2 text-[#DD815C]">
                          Discover our Makhana
                        </h3>
                        <p className="font-suez text-5xl text-[#212121]">
                          {selectedProduct.name}
                        </p>
                        <div className="flex items-center gap-4 text-[#DD815C]">
                          <p className="font-suez text-lg">
                            {selectedProduct.weight}
                          </p>
                          <p className="font-suez text-xl">
                            {selectedProduct.price}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="mt-8 flex flex-col gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        <div className="border-t border-dashed border-[#DD815C]"></div>
                        <div className="flex items-center justify-start text-[#DD815C] font-suez gap-4 pl-4">
                          <span>Made with Multigrams</span>
                          <span className="border-l border-dashed border-[#DD815C] h-8"></span>
                          <span>Fried Not Baked</span>
                        </div>
                        <div className="border-t border-dashed border-[#DD815C]"></div>
                        <div className="flex items-center justify-start text-[#DD815C] font-suez gap-4 pl-4">
                          <span className="pr-[76px]">High Protein</span>
                          <span className="border-l border-dashed border-[#DD815C] h-8"></span>
                          <span>Low in Cholesterol</span>
                        </div>
                        <div className="border-t border-dashed border-[#DD815C]"></div>
                      </motion.div>

                      <motion.div
                        className="flex items-center mt-8 gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        <div className="flex items-center border border-[#DD815C] rounded-full px-6 py-3 bg-transparent">
                          <button className="px-3 text-[#DD815C] font-suez">
                            -
                          </button>
                          <span className="px-4 text-[#DD815C] font-suez">
                            1
                          </span>
                          <button className="px-2 text-[#DD815C] font-suez">
                            +
                          </button>
                        </div>
                        <button className="border border-[#DD815C] rounded-full p-3 bg-transparent">
                          <Heart size={20} className="text-[#DD815C]" />
                        </button>
                        <button className="bg-[#F1B213] text-white px-6 py-3 rounded-full font-jost">
                          ADD TO CART
                        </button>
                      </motion.div>
                    </motion.div>
                  </div>
                  <Review />
                  <Others />
                  <FooterForInProduct />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Products;
