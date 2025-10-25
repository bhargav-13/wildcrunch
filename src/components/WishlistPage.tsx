import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { X, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import localProducts from "@/data/product";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
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

  // Merge backend wishlist items with local product data for images
  const wishlistProducts = wishlistItems.slice(0, 6).map(item => {
    const product = item.product || item;
    const localProduct = localProducts.find(p => p.id === (item.productId || product.id));
    
    // Merge backend data with local images
    return {
      ...product,
      productId: item.productId || product.id,
      imageSrc: localProduct?.imageSrc || product.imageSrc,
      bgColor: localProduct?.bgColor || product.bgColor,
      name: product.name || localProduct?.name,
      price: product.price || localProduct?.price,
      weight: product.weight || localProduct?.weight,
    };
  });

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7E5] relative">
      <Header />

      {/* Section */}
      <section className="container mx-auto px-4 py-12 sm:py-24 mt-16">
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
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F1B213]"></div>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="font-jost text-lg text-gray-600">Your wishlist is empty</p>
          </div>
        ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-20 sm:gap-x-12 sm:gap-y-24 mt-12">
{wishlistProducts.map((product) => (
  <div
    key={product.productId}
    className="relative rounded-3xl p-6 shadow-md min-h-[280px] sm:min-h-[320px] overflow-visible block cursor-pointer"
    style={{ backgroundColor: product.bgColor }}
  >
    {/* Cross Button */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleRemoveFromWishlist(product.productId);
      }}
      className="absolute top-4 right-4 text-white hover:text-red-500"
    >
      <X size={20} />
    </button>

    {/* Product Image */}
    <motion.div
      layoutId={`product-image-container-${product.productId}`}
      className="absolute -top-20 inset-x-0 flex justify-center"
    >
      <motion.img
        layoutId={`product-image-${product.productId}`}
        src={product.imageSrc}
        alt={product.name}
        className=" max-w-none w-[270px] sm:w-[330px] h-auto transition-transform duration-500 hover:-rotate-12"
      />
    </motion.div>

    {/* Details */}
    <div className="mt-2 flex flex-col justify-end text-left text-white h-full">
      <h3 className="font-suez text-lg md:text-3xl mb-1">{product.name}</h3>
      <p className="font-jost text-sm">{product.weight}</p>
      <p className="font-suez text-lg">{product.price}</p>
    </div>

    {/* Shopping Cart Button */}
    <motion.button 
      onClick={(e) => {
        e.stopPropagation();
        handleAddToCart(product.productId);
      }}
      className="absolute bottom-[-16px] right-[-16px] bg-[#FCEB81] w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
    >
      <ShoppingCart size={20} className="text-gray-800" />
    </motion.button>
  </div>
))}

        </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default WishlistPage;
