import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import products from "@/data/product";
import { useWishlist } from "@/components/WishlistContext.tsx";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { wishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  // Limit to 4 products
  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 4);

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="bg-[#F8F7E5] flex flex-col items-center overflow-x-hidden">
      {/* Header */}
      <div className="w-full max-w-8xl ml-10 mb-16 px-4 sm:px-8 py-10">
        <h2 className="font-suez text-5xl text-[#212121] mb-6 text-left">
          Wild Crunch Specials
        </h2>
      </div>

      {/* Product Grid */}
      <div className="w-full max-w-8xl px-4 sm:px-10 grid grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 pb-20 overflow-visible">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleProductClick(product)}
            className="relative rounded-3xl p-6 shadow-md min-h-[260px] sm:min-h-[360px] overflow-visible cursor-pointer"
            style={{ backgroundColor: product.bgColor }}
          >
            {/* Heart Button */}
            <button
              className="absolute top-4 right-4 z-20"
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
              key={`product-image-${product.id}-${index}`}
              className="absolute left-1/2 transform -translate-x-1/2 -top-28 sm:-top-36 z-10 pointer-events-none overflow-visible"
            >
              <motion.img
                src={product.imageSrc}
                alt={product.name}
                className="w-[260px] sm:w-[420px] h-auto mx-auto transform transition-transform duration-500 hover:-rotate-12"
                style={{ maxWidth: "none" }}
              />
            </motion.div>

            {/* Product Details */}
            <div className="mt-6 flex flex-col justify-end text-left text-white h-full">
              <h3 className="font-suez text-lg sm:text-4xl mb-1">
                {product.name}
              </h3>
              <p className="font-jost text-lg">{product.weight}</p>
              <p className="font-suez text-xl">{product.price}</p>
            </div>

            {/* Cart Button */}
            <button
              className="absolute -bottom-4 -right-4 bg-[#FCEB81] w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
              onClick={(e) => e.stopPropagation()}
            >
              <ShoppingCart size={20} className="text-gray-800" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Products;
