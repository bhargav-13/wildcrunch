import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/hooks/useWishlist";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { productsAPI } from "@/services/api";

// Helper function to get color based on category
const getColorForCategory = (category: string) => {
  const colorMap: { [key: string]: string } = {
    'Makhana': '#F1B213',
    'Plain Makhana': '#F0C4A7',
    'Protein Puffs': '#BE9A5E',
    'Popcorn': '#4683E9',
    'Combo': '#9EC417',
  };
  return colorMap[category] || '#F1B213';
};

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(["All Products"]);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productsAPI.getCategories();
        const backendCategories = response.data.data || response.data.categories || [];
        setCategories(["All Products", ...backendCategories]);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback categories
        setCategories(["All Products", "Makhana", "Plain Makhana", "Protein Puffs", "Popcorn", "Combo"]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products from backend
  const { products: apiProducts, loading, error } = useProducts({
    category: selectedCategory === "All Products" ? undefined : selectedCategory,
    search: searchTerm,
  });

  // Transform backend products to match frontend format
  const products = apiProducts.map((product: any) => ({
    id: product._id,
    _id: product._id,
    name: product.name,
    description: product.description,
    weight: product.weight ? `${product.weight}g` : '80g',
    price: `₹${product.pricing?.individual?.price || product.price}`,
    priceNumeric: product.pricing?.individual?.price || product.price,
    pricing: product.pricing,
    category: product.category,
    imageSrc: product.images?.[0] || '',
    images: product.images || [],
    bgColor: product.backgroundColor || getColorForCategory(Array.isArray(product.category) ? product.category[0] : product.category),
    ingredients: product.ingredients,
    nutritionInfo: product.nutritionInfo,
    inStock: product.stock > 0,
    stockQuantity: product.stock,
    ratings: product.ratings,
  }));

  // Filter products (excluding Combo from "All Products")
  const filteredProducts = products.filter((product) => {
    // Exclude Combo from "All Products"
    const categories = Array.isArray(product.category) ? product.category : [product.category];
    if (selectedCategory === "All Products" && categories.includes("Combo")) {
      return false;
    }
    return true;
  });

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }
    try {
      const action = await toggleWishlist(product.id);
      toast.success(action === 'added' ? 'Added to wishlist!' : 'Removed from wishlist!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7E5]">
      <div className="container mx-auto px-4 sm:px-12 py-8 flex gap-8">
        {/* Sidebar (Desktop only) */}
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
          {/* Search bar + Mobile filter icon */}
          <div className="sticky top-20 z-10 pb-16 sm:pb-10 flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
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

            {/* Mobile filter button */}
            <button
              className="md:hidden w-12 h-12 rounded-full border border-[#C06441] flex items-center justify-center bg-white shadow-sm"
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter size={20} className="text-[#C06441]" />
            </button>
          </div>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-[100] flex">
              {/* Backdrop */}
              <div
                className="flex-1 bg-black/50"
                onClick={() => setIsFilterOpen(false)}
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3 }}
                className="w-64 bg-[#F8F7E5] h-full shadow-xl p-6"
              >
                <h2 className="font-suez text-2xl text-[#212121] mb-6">
                  FILTERS
                </h2>
                <hr className="border-t-2 border-[#212121] mb-6" />
                <ul className="space-y-4">
                  {categories.map((cat) => (
                    <li
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsFilterOpen(false); // close after selecting
                      }}
                      className={`cursor-pointer font-suez text-lg ${
                        selectedCategory === cat
                          ? "text-[#DD815C]"
                          : "text-[#212121]"
                      }`}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C06441]"></div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-500 font-jost">{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="font-jost text-lg text-gray-600">No products found</p>
            </div>
          )}

          {/* Product grid */}
          {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 sm:gap-x-12 sm:gap-y-24 sm:mt-40">
            {filteredProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                onClick={() => handleProductClick(product)}
                className="relative rounded-3xl p-6 shadow-md min-h-[280px] sm:min-h-[320px] overflow-visible block cursor-pointer"
                style={{ backgroundColor: product.bgColor }}
              >
                {/* Heart */}
<button
  className="absolute top-4 right-4 z-20"
  onClick={(e) => handleWishlistToggle(e, product)}
>
  <Heart
    size={20}
    className={
      isInWishlist(product.id)
        ? "fill-black"
        : ""
    }
  />
</button>

                {/* Product Image */}
<motion.div
  key={`product-image-container-${product.id}-${index}`}
  className={`absolute left-1/2 transform -translate-x-1/2 z-10 ${
    product.category === "Combo"
      ? "top-[-5px] sm:top-[-30px]"
      : "-top-28 sm:-top-36"
  }`}
>
  <motion.img
    key={`product-image-${product.id}-${index}`}
    src={product.imageSrc}
    alt={product.name}
    className={`max-w-none mx-auto transform transition-transform duration-500 hover:-rotate-12 ${
      product.category === "Combo" && index === 0
        ? "w-[230px] h-[250px] sm:w-[350px] sm:h-[280px] -mt-8 object-contain"
        : product.category === "Combo"
        ? "w-[200px] sm:w-[250px] h-auto"
        : "w-[300px] mt-8 sm:mt-0 sm:w-[420px] h-auto"
    }`}
  />
</motion.div>

                {/* Details */}
                <div className="mt-2 flex flex-col justify-end text-left text-white h-full">
                  <h3 className="font-suez text-lg md:text-3xl mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="font-jost text-sm">{product.weight}</p>
                  <p className="font-suez text-lg">{product.price}</p>
                </div>

                {/* Cart */}
                <button
                  className="absolute -bottom-4 -right-4 bg-[#FCEB81] w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <ShoppingCart size={20} className="text-gray-800" />
                </button>
              </div>
            ))}
          </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
