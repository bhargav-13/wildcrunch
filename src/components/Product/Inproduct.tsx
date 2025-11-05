import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { productsAPI } from "@/services/api";
import Special from "./Special.tsx";
import Review from "./Review.tsx";
import Others from "./Others.tsx";
import Footer from "../Footer.tsx";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";

const InProduct = () => {
  const [rotation, setRotation] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // State for product data from backend
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const handleRotate = (direction) => {
    setRotation((prev) => prev + (direction === "right" ? 90 : -90));
  };

  // State management
  const [selectedPack, setSelectedPack] = useState<'1' | '2' | '4'>('1'); // Default to individual
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getById(id);
        
        if (response.data.success) {
          const product = response.data.data;
          // Transform backend data to match frontend format
          setSelectedProduct({
            id: product._id,
            _id: product._id,
            name: product.name,
            description: product.description,
            weight: product.weight ? `${product.weight}g` : '80g',
            price: `₹${product.price}`,
            priceNumeric: product.price,
            pricing: product.pricing,
            category: product.category,
            imageSrc: product.images?.[0] || '',
            images: product.images || [],
            bgColor: product.backgroundColor || '#F1B213',
            ingredients: product.ingredients,
            nutritionInfo: product.nutritionInfo,
            inStock: product.stock > 0,
            stockQuantity: product.stock,
            ratings: product.ratings,
          });
        }
      } catch (err: any) {
        console.error('Failed to fetch product:', err);
        setError(err.response?.data?.message || 'Failed to load product');
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // Check if product is in wishlist
  useEffect(() => {
    if (selectedProduct && isAuthenticated) {
      setIsWishlisted(isInWishlist(selectedProduct.id));
    }
  }, [selectedProduct, isAuthenticated, isInWishlist]);

  // Calculate dynamic price based on pack selection using backend pricing data
  const calculatePrice = () => {
    if (!selectedProduct) return 0;
    
    // If product has pricing variants from backend, use them
    if (selectedProduct.pricing) {
      if (selectedPack === '1') {
        return selectedProduct.pricing.individual.price;
      } else if (selectedPack === '2') {
        return selectedProduct.pricing.packOf2.price;
      } else {
        return selectedProduct.pricing.packOf4.price;
      }
    }
    
    // Fallback to legacy calculation for products without pricing variants
    const basePrice = parseInt(selectedProduct.price.replace(/[^0-9]/g, ''));
    if (selectedPack === '1') {
      return basePrice;
    } else if (selectedPack === '2') {
      return Math.round(basePrice * 2 * 0.95);
    } else {
      return Math.round(basePrice * 4 * 0.90);
    }
  };

  const displayPrice = calculatePrice();

  // Quantity handlers
  const handleIncrement = () => {
    console.log('Increment clicked, current quantity:', quantity);
    setQuantity(prev => {
      console.log('New quantity:', prev + 1);
      return prev + 1;
    });
  };

  const handleDecrement = () => {
    console.log('Decrement clicked, current quantity:', quantity);
    if (quantity > 1) {
      setQuantity(prev => {
        console.log('New quantity:', prev - 1);
        return prev - 1;
      });
    } else {
      console.log('Already at minimum quantity (1)');
    }
  };

  const handleClose = () => {
    navigate("/products");
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!selectedProduct) return;

    try {
      await addToCart(selectedProduct.id, quantity, selectedPack, displayPrice);
      const packLabel = selectedPack === '1' ? 'Individual' : `Pack of ${selectedPack}`;
      toast.success(`${selectedProduct.name} (${packLabel}, Qty: ${quantity}) added to cart!`);
      console.log('Added to cart:', { productId: selectedProduct.id, quantity, pack: selectedPack, packPrice: displayPrice });
    } catch (error: any) {
      console.error('Cart error:', error);
      if (error.message.includes('not found')) {
        toast.error('Product not available. Please ensure products are seeded in the database.');
      } else {
        toast.error(error.message || 'Failed to add to cart');
      }
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    if (!selectedProduct) return;

    try {
      const action = await toggleWishlist(selectedProduct.id);
      setIsWishlisted(action === 'added');
      toast.success(action === 'added' ? 'Added to wishlist!' : 'Removed from wishlist!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wishlist');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !selectedProduct) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-[#F1B213] text-white px-6 py-2 rounded-full"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <Header />

      {/* Background with grain + color fade */}
      <div
        className="w-full"
        style={{
          backgroundColor: selectedProduct.bgColor,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* Back button */}
        <button
          onClick={handleClose}
          className="absolute top-24 left-4 bg-white/20 p-2 rounded-full hidden md:block"
        >
          <ArrowLeft />
        </button>

        {/* Product content */}
        <div className="w-full px-4 pt-32 pb-16">
          <div className="w-full max-w-[1300px] mx-auto">
{/* Mobile Layout */}
<div className="block lg:hidden">
  {/* Product Title */}
  <motion.div
    className="text-left mb-6"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.5 }}
  >
    <h3 className="font-suez text-sm mb-1 text-white">DISCOVER OUR MAKHANA</h3>
    <p className="font-suez text-4xl text-black mb-2">{selectedProduct.name}</p>
    <div className="flex items-center gap-4 text-white">
      <p className="font-suez text-base">{selectedProduct.weight}</p>
      <p className="font-suez text-lg">₹{displayPrice}</p>
    </div>
  </motion.div>

  {/* Redesigned Product Image + Pack Options */}
  <div className="flex flex-col items-center gap-6 mb-10">
    {/* Product Image with Decorative Borders */}
<div className="relative flex items-center justify-center gap-3">
      {/* ✅ Left Arrow */}
      <button
        onClick={() => handleRotate("left")}
        className="rounded-[12px] border-2 border-dashed border-white p-2 bg-black/30 hover:bg-white/10 transition absolute left-[-65px] z-10"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      {/* ✅ Main Image Container (Your Original Code) */}
      <motion.div
        className="relative w-[220px] sm:w-[250px]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {/* Outer dashed border */}
        <div className="absolute inset-0 border-2 border-dashed border-white rounded-[40px] translate-x-3 translate-y-3 overflow-hidden"></div>

        {/* Inner solid border */}
        <div className="relative border border-white rounded-[40px] p-4 bg-black/10 backdrop-blur-sm flex justify-center items-center overflow-hidden perspective-[800px]">
          <motion.div
            style={{
              transformStyle: "preserve-3d",
            }}
            animate={{
              rotateY: rotation,
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
            className="relative w-[200px] h-[180px]"
          >
            {/* 4 Cube Faces */}
            {[0, 90, 180, 270].map((angle, i) => (
              <div
                key={i}
                className="absolute w-full h-full rounded-[30px] border border-white flex justify-center items-center"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(100px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  key={`modal-image-${selectedProduct.id}-${i}`}
                  src={selectedProduct.imageSrc}
                  alt={selectedProduct.name}
                  className="rounded-[30px] w-full h-full object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ✅ Right Arrow */}
      <button
        onClick={() => handleRotate("right")}
        className="rounded-[12px] border-2 border-dashed border-white p-2 bg-black/30 hover:bg-white/10 transition absolute right-[-75px] z-10"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>

    {/* Pack Selection */}
    <motion.div
      className="w-full px-6 flex flex-col items-center gap-4 bg-white/10 border border-white/30 rounded-2xl py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <p className="text-white font-suez text-sm mb-2">Choose Your Pack</p>
      <div className="flex justify-center gap-4">
        {[
          { value: "1", label: "Individual" },
          { value: "2", label: "Pack of 2 (5% off)" },
          { value: "4", label: "Pack of 4 (10% off)" },
        ].map((pack) => (
          <label key={pack.value} className="flex flex-col items-center cursor-pointer">
            <input
              type="radio"
              name="pack-mobile"
              value={pack.value}
              checked={selectedPack === pack.value}
              onChange={(e) =>
                setSelectedPack(e.target.value as "1" | "2" | "4")
              }
              className="appearance-none w-5 h-5 border-2 border-white rounded-full checked:bg-[#F1B213] transition-all"
            />
            <span className="text-white text-xs font-jost mt-1">{pack.label}</span>
          </label>
        ))}
      </div>
    </motion.div>

    {/* Quantity, Wishlist, Add to Cart (All in One Line) */}
    <motion.div
      className="w-full px-6 flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="flex items-center justify-between w-full gap-3">
        {/* Quantity selector */}
        <div className="flex items-center border border-white rounded-full px-3 py-1 bg-transparent">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="px-2 text-white font-suez text-sm hover:text-[#F1B213] transition-colors disabled:opacity-50"
          >
            -
          </button>
          <span className="px-2 text-white font-suez text-sm text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            className="px-2 text-white font-suez text-sm hover:text-[#F1B213] transition-colors"
          >
            +
          </button>
        </div>

        {/* Wishlist */}
        <button
          className="border border-white rounded-full p-2 bg-transparent hover:bg-white/10 transition-colors"
          onClick={handleWishlistToggle}
        >
          <Heart
            size={16}
            className={`text-white ${isWishlisted ? "fill-white" : ""}`}
          />
        </button>

        {/* Add to Cart */}
        <button
          className="flex-1 bg-[#F1B213] text-white py-2 rounded-full font-jost font-semibold text-sm"
          onClick={handleAddToCart}
        >
          ADD TO CART
        </button>
      </div>

      <p className="text-white text-xs text-center">3000+ Happy Customers</p>
    </motion.div>
  </div>

  {/* --- DO NOT TOUCH BELOW THIS (features, ingredients, desc etc.) --- */}
  <motion.div
    className="flex flex-col gap-3 mb-8 mx-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.9, duration: 0.5 }}
  >
    <div className="border-t border-dashed border-white"></div>
    <div className="flex items-center justify-center text-white font-suez text-xs sm:text-sm gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <span>Made with Multigrams</span>
        <span className="border-t border-dashed border-white w-20 sm:w-28"></span>
        <span>Fried Not Baked</span>
      </div>
      <div className="border-l border-dashed border-white h-14"></div>
      <div className="flex flex-col items-center gap-2 text-center">
        <span>High Protein</span>
        <span className="border-t border-dashed border-white w-20 sm:w-28"></span>
        <span>Low in Cholesterol</span>
      </div>
    </div>
    <div className="border-t border-dashed border-white"></div>
  </motion.div>

  {/* Ingredients */}
  <motion.div
    className="mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.0, duration: 0.5 }}
  >
    <h3 className="font-suez text-lg mb-3 text-black">INGREDIENTS</h3>
    <p className="font-suez text-sm text-white leading-relaxed">
      {selectedProduct.ingredients || 'Makhana (Fox Nuts), Rice Bran Oil, Habanero Chili Powder, Red Chili Flakes, Rock Salt, Black Pepper, Natural Spices'}
    </p>
  </motion.div>

  {/* Description */}
  <motion.div
    className="mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.1, duration: 0.5 }}
  >
    <h3 className="font-suez text-lg mb-3 text-black">
      Taste the Lightness in Every Bite of Makhana.
    </h3>
    <p className="font-jost text-sm text-white leading-relaxed">
      {selectedProduct.description || 'Craving something light yet flavorful? No worries. Just grab a handful of our perfectly roasted makhana, seasoned to hit every taste bud with the right crunch and spice. Pure, wholesome, and guilt-free. Damn tasty. It\'s the little joys of snacking, made better…'}
    </p>
  </motion.div>
</div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex flex-col lg:flex-row gap-8 h-[600px]">
              {/* Left Column */}
              <motion.div
                className="flex-1 flex flex-col justify-between text-white min-w-0"
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
                    className="font-suez text-xl mb-4 text-black break-words"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    Taste the Lightness in Every Bite of Makhana.
                  </motion.h2>
                  <motion.p
                    className="font-jost text-base text-white"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    {selectedProduct.description || 'Craving something light yet flavorful? No worries. Just grab a handful of our perfectly roasted makhana, seasoned to hit every taste bud with the right crunch and spice. Pure, wholesome, and guilt-free. Damn tasty. It\'s the little joys of snacking, made better…'}
                  </motion.p>
                </div>

                {/* Features Section - Moved from Right Column */}
                <motion.div
                  className="mt-8 flex flex-col gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.5 }}
                >
                  <div className="border-t border-dashed border-white"></div>
                  <div className="flex items-center justify-start text-white font-suez gap-4 pl-4 flex-wrap">
                    <span>Made with Multigrams</span>
                    <span className="border-l border-dashed border-white h-8 hidden sm:block"></span>
                    <span>Fried Not Baked</span>
                  </div>
                  <div className="border-t border-dashed border-white"></div>
                  <div className="flex items-center justify-start text-white font-suez gap-4 pl-4 flex-wrap">
                    <span className="mr-[75px]">High Protein</span>
                    <span className="border-l border-dashed border-white h-8 hidden sm:block"></span>
                    <span>Low in Cholesterol</span>
                  </div>
                  <div className="border-t border-dashed border-white"></div>
                </motion.div>

                <motion.div
                  className="text-right mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <h3 className="font-suez text-xl mb-2 text-white">
                    INGREDIENTS
                  </h3>
                  <p className="font-suez text-base text-black break-words">
                    {selectedProduct.ingredients || 'Makhana (Fox Nuts), Rice Bran Oil, Habanero Chili Powder, Red Chili Flakes, Rock Salt, Black Pepper, Natural Spices'}
                  </p>
                </motion.div>
              </motion.div>
              {/* Middle Column (Product Image) */}
 <div className="flex-1 flex flex-col items-center relative min-w-0">
      {/* ✅ Main Cube Container */}
      <div className="rounded-[30px] border-dashed border-2 border-white p-6 h-[500px] flex justify-center items-center perspective-[1200px] overflow-hidden">
        <motion.div
          style={{
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: rotation,
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          className="relative w-[350px] h-[450px]"
        >
          {/* Cube Faces */}
          {[0, 90, 180, 270].map((angle, index) => (
            <div
              key={index}
              className="absolute w-full h-full rounded-[30px] border border-white flex justify-center items-center"
              style={{
                transform: `rotateY(${angle}deg) translateZ(210px)`,
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src={selectedProduct.imageSrc}
                alt={`Cube side ${index}`}
                className="h-full w-full object-cover rounded-[55px]"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* ✅ Arrow Controls */}
      <div className="mt-6 flex items-center justify-center gap-6">
        {/* Left Arrow */}
        <button
          onClick={() => handleRotate("left")}
          className="rounded-[20px] border-2 border-dashed border-white p-3 hover:bg-white/10 transition"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => handleRotate("right")}
          className="rounded-[20px] border-2 border-dashed border-white p-3 hover:bg-white/10 transition"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
              {/* Right Column */}{" "}
              <motion.div
                className="flex-1 flex flex-col justify-between text-white min-w-0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              >
                {" "}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mt-12"
                >
                  {" "}
                  <h3 className="font-suez text-3xl mb-2 text-white break-words">
                    {" "}
                    Discover our {" "}
                  </h3>{" "}
                  <p className="font-suez text-3xl xl:text-7xl text-[#212121] break-words">
                    {" "}
                    {selectedProduct.name}{" "}
                  </p>{" "}
                  <div className="flex items-center gap-4 text-white flex-wrap">
                    {" "}
                    <p className="font-suez text-lg">
                      {" "}
                      {selectedProduct.weight}{" "}
                    </p>{" "}
                    <p className="font-suez text-xl">
                      {" "}
                      ₹{displayPrice}{" "}
                    </p>{" "}
                  </div>{" "}
                </motion.div>{" "}
                {/* Pack Selection Radio Buttons */}{" "}
                <motion.div
                  className=" flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  {" "}
                  <div className="flex flex-col ">
                    {" "}
                    <div className="flex gap-3 flex-wrap">
                      {" "}
                      <label className="flex items-center gap-2 cursor-pointer">
                        {" "}
                        <div className="relative">
                          {" "}
                          <input
                            type="radio"
                            name="pack-desktop"
                            value="1"
                            checked={selectedPack === '1'}
                            onChange={(e) => setSelectedPack(e.target.value as '1' | '2' | '4')}
                            className="appearance-none w-5 h-5 rounded-full border-2 border-white cursor-pointer checked:bg-black"
                          />{" "}
                        </div>{" "}
                        <span className="font-jost text-white">Individual</span>{" "}
                      </label>{" "}
                      <label className="flex items-center gap-2 cursor-pointer">
                        {" "}
                        <div className="relative">
                          {" "}
                          <input
                            type="radio"
                            name="pack-desktop"
                            value="2"
                            checked={selectedPack === '2'}
                            onChange={(e) => setSelectedPack(e.target.value as '1' | '2' | '4')}
                            className="appearance-none w-5 h-5 rounded-full border-2 border-white cursor-pointer checked:bg-black"
                          />{" "}
                        </div>{" "}
                        <span className="font-jost text-white">Pack of 2 (5% off)</span>{" "}
                      </label>{" "}
                      <label className="flex items-center gap-2 cursor-pointer">
                        {" "}
                        <div className="relative">
                          {" "}
                          <input
                            type="radio"
                            name="pack-desktop"
                            value="4"
                            checked={selectedPack === '4'}
                            onChange={(e) => setSelectedPack(e.target.value as '1' | '2' | '4')}
                            className="appearance-none w-5 h-5 rounded-full border-2 border-white cursor-pointer checked:bg-black"
                          />{" "}
                        </div>{" "}
                        <span className="font-jost text-white">Pack of 4 (10% off)</span>{" "}
                      </label>{" "}
                    </div>{" "}
                  </div>{" "}
                </motion.div>{" "}
                <motion.div
                  className="flex items-center gap-4 flex-wrap"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  {" "}
                  <div className="flex items-center border border-white rounded-full px-6 py-3 bg-transparent">
                    {" "}
                    <button 
                      type="button"
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="px-3 text-white font-suez hover:text-[#F1B213] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {" "}
                      -{" "}
                    </button>{" "}
                    <span className="px-4 text-white font-suez min-w-[30px] text-center"> {quantity} </span>{" "}
                    <button 
                      type="button"
                      onClick={handleIncrement}
                      className="px-2 text-white font-suez hover:text-[#F1B213] transition-colors"
                    > + </button>{" "}
                  </div>{" "}
                  <button 
                    className="border border-white rounded-full p-3 bg-transparent hover:bg-white/10 transition-colors"
                    onClick={handleWishlistToggle}
                  >
                    {" "}
                    <Heart size={20} className={`text-white ${isWishlisted ? 'fill-white' : ''}`} />{" "}
                  </button>{" "}
                  <button 
                    className="bg-[#F1B213] text-white px-6 py-3 rounded-full font-jost whitespace-nowrap"
                    onClick={handleAddToCart}
                  >
                    {" "}
                    ADD TO CART{" "}
                  </button>{" "}
                </motion.div>{" "}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Imported sections - now outside the padding container */}
      <Special />
      <Review />
      <Others />
      <Footer />
    </div>
  );
};

export default InProduct;
