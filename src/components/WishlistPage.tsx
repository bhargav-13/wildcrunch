import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { X, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/data/product";
import { useWishlist } from "@/components/WishlistContext";
import products from "@/data/product";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist(); // use context
  const [pathData, setPathData] = useState<string>("");

  // Generate random smooth ECG-like path
  const generateRandomPath = () => {
    const width = 1200;
    const segments = 100;
    const segmentWidth = width / segments;
    let path = `M0,14`;
    for (let i = 1; i <= segments; i++) {
      const y = 5 + Math.random() * 18;
      const x = i * segmentWidth;
      path += ` Q${x - segmentWidth / 2},${y} ${x},14`;
    }
    return path;
  };

  useEffect(() => {
    setPathData(generateRandomPath());
  }, []);

  // Take only first 6 wishlist items
  const wishlistProducts: Product[] = wishlist.slice(0, 6);

  return (
    <div className="min-h-screen bg-background relative">
      <Header />

      {/* Section */}
      <section className="container mx-auto px-4 py-12 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center">
            <h2 className="text-4xl md:text-7xl font-bold font-suez text-foreground">
              YOUR SAVED <br /> CRAVINGS!
            </h2>
          </div>
          <div className="flex justify-center">
            <p className="font-jost text-lg text-center sm:text-left leading-relaxed max-w-[340px] sm:max-w-[600px]">
              Keep all your favorite WildCrunch snacks in one place. From crunchy makhana to protein-packed puffs, your wishlist is where taste and lightness wait for you until you’re ready to enjoy them.
            </p>
          </div>
        </div>
      </section>

      {/* Wavy ECG border */}
      {pathData && (
        <svg viewBox="0 0 1200 28" preserveAspectRatio="none" className="w-screen h-7">
          <path
            d={pathData}
            fill="none"
            stroke="#F1B213"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Wishlist Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-20 sm:gap-x-12 sm:gap-y-24 mt-12">
{wishlistProducts.map((product: Product) => (
  <div
    key={product.id}
    className="relative rounded-3xl p-6 shadow-md min-h-[280px] sm:min-h-[320px] overflow-visible block cursor-pointer"
    style={{ backgroundColor: product.bgColor }}
  >
    {/* Cross Button */}
    <button
      onClick={() => removeFromWishlist(product.id)}
      className="absolute top-4 right-4 text-white hover:text-red-500"
    >
      <X size={20} />
    </button>

    {/* Product Image */}
    <motion.div
      layoutId={`product-image-container-${product.id}`}
      className="absolute -top-20 inset-x-0 flex justify-center"
    >
      <motion.img
        layoutId={`product-image-${product.id}`}
        src={product.imageSrc}
        alt={product.name}
        className="w-[120px] sm:w-[150px] h-auto transition-transform duration-500 hover:-rotate-12"
      />
    </motion.div>

    {/* Details */}
    <div className="mt-2 flex flex-col justify-end text-left text-white h-full">
      <h3 className="font-suez text-lg md:text-3xl mb-1">{product.name}</h3>
      <p className="font-jost text-sm">{product.weight}</p>
      <p className="font-suez text-lg">{product.price}</p>
    </div>

    {/* Cart Button */}

<button
  onClick={() => removeFromWishlist(String(product.id))}
  className="absolute top-4 right-4 text-white hover:text-red-500"
>
  <X size={20} />
</button>
  </div>
))}

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WishlistPage;
