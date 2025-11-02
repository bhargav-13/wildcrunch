import { Heart, ShoppingCart, User, Menu, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import LogoWC from "@/assets/LogoWC.png";
import Cart from "@/components/cart"; // import the new Cart component
import img1 from "@/assets/1.png";
import img2 from "@/assets/2.png";
import img3 from "@/assets/3.png";
import img4 from "@/assets/4.png";

const images = [img1, img2, img3, img4];

const TOP_HEIGHT = 50;

const Header = ({ offset = 0 }) => {
  const [isOpen, setIsOpen] = useState(false); // burger menu
  const [cartOpen, setCartOpen] = useState(false); // cart sidebar toggle
  const [isVisible, setIsVisible] = useState(true); // header visibility
  const [lastScrollY, setLastScrollY] = useState(0); // track last scroll position
  const [pathData, setPathData] = useState(""); // store ECG path data
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();

  // Generate ECG path only once when component mounts
  useEffect(() => {
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
    
    setPathData(generateRandomPath());
  }, []);

  // Scroll detection effect
useEffect(() => {
  const controlHeader = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      setIsVisible(false); // hide on scroll down
    } else if (currentScrollY < lastScrollY) {
      setIsVisible(true);  // show on scroll up
    }

    setLastScrollY(currentScrollY);
  };

  const throttledControlHeader = () => requestAnimationFrame(controlHeader);
  window.addEventListener("scroll", throttledControlHeader, { passive: true });
  return () => window.removeEventListener("scroll", throttledControlHeader);
}, [lastScrollY]);



  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Our Story", path: "/our-story" },
    { name: "Shop", path: "/products" },
    { name: "Cart", path: "/cart" },
    { name: "Contact Us", path: "/contact" },
    { name: "Dealerships", path: "/dealerships" },
    ...(isAuthenticated 
      ? [{ name: "Profile", path: "/profile" }]
      : [{ name: "Login", path: "/login" }]
    ),
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsOpen(false);
  };

  return (
    <>
<header
  className="bg-[#F8F7E5] fixed left-0 right-0 z-[60] transition-transform duration-300 ease-in-out"
  style={{
    top: window.scrollY < TOP_HEIGHT ? `${TOP_HEIGHT}px` : '0px',
    transform: isVisible ? "translateY(0)" : "translateY(-100%)",
  }}
>



        <div className="container mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={LogoWC}
                alt="Wild Crunch Logo"
                className="h-[60px] w-auto"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2.5">
              {/* Show Login button when not authenticated */}
              {!isAuthenticated ? (
                <Button
                  className="flex items-center gap-1.5 bg-[#F1B213] text-white px-4 sm:px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#F8F7E5] hover:text-black"
                  onClick={() => navigate('/login')}
                >
                  <User className="h-5 w-5" />
                  <span className="font-sfpro">LOGIN</span>
                </Button>
              ) : (
                <>
                  {/* Wishlist - Only visible when authenticated */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:w-8 sm:h-8 w-10 h-10 rounded-full border border-black text-black hover:bg-[#F1B213] hover:text-white hover:border-[#F1B213]"
                    onClick={() => navigate("/wishlist")}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>

                  {/* Cart button - Only visible when authenticated */}
                  <Button
                    className="relative flex items-center gap-1.5 bg-[#F1B213] text-white px-3 sm:px-5 py-1.5 rounded-full text-xs font-semibold hover:bg-[#F8F7E5] hover:text-black"
                    onClick={() => setCartOpen(true)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="font-sfpro hidden sm:inline">CART</span>
                    {/* Cart notification badge */}
                    {totalItems > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white"
                      >
                        {totalItems > 99 ? '99+' : totalItems}
                      </motion.span>
                    )}
                  </Button>

                  {/* User - Only visible when authenticated */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 rounded-full border border-black text-black hover:bg-[#F1B213] hover:text-white hover:border-[#F1B213]"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Burger Menu - Custom Implementation */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className="w-10 h-10 rounded-md text-black hover:text-[#F1B213] hover:bg-transparent border-0 flex items-center justify-center"
                  onClick={() => setIsOpen(true)}
                >
                  <Menu style={{ width: "28px", height: "28px" }} />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* High-Frequency Random ECG Border */}
        <svg
          viewBox="0 0 1200 28"
          preserveAspectRatio="none"
          className="w-full h-7 absolute left-0 bottom-[-15px]"
        >
          <path
            d={pathData}
            fill="none"
            stroke="#F1B213"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </header>

      {/* Custom Menu Sidebar with Framer Motion */}
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Sidebar */}
      <motion.div
        className="fixed top-0 right-0 h-full w-[300px] sm:w-[500px] bg-white z-[101] overflow-hidden"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Background Images Layer */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <motion.img
            src={img1}
            alt="bg-1"
            className="absolute opacity-40"
            style={{ top: "-25%", left: "15%" }}
            initial={{ scale: 0.8, rotate: 0, opacity: 0 }}
            animate={{ scale: 0.9, rotate: 25, opacity: 0.4 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          <motion.img
            src={img2}
            alt="bg-2"
            className="absolute opacity-40"
            style={{ top: "10%", left: "7%" }}
            initial={{ scale: 0.6, rotate: 0, opacity: 0 }}
            animate={{ scale: 0.7, rotate: -50, opacity: 0.4 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
          <motion.img
            src={img3}
            alt="bg-3"
            className="absolute opacity-70"
            style={{ top: "55%", left: "35%" }}
            initial={{ scale: 1, rotate: 0, opacity: 0 }}
            animate={{ scale: 1.2, rotate: -30, opacity: 0.7 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />
          <motion.img
            src={img4}
            alt="bg-4"
            className="absolute opacity-50"
            style={{ top: "40%", left: "-35%" }}
            initial={{ scale: 0.7, rotate: 0, opacity: 0 }}
            animate={{ scale: 0.9, rotate: 25, opacity: 0.5 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          />
        </div>

        {/* Actual Menu Content */}
        <div className="relative z-20 p-6">
          {/* Header with Back Arrow + Title */}
          <motion.div
            className="flex items-center space-x-3 mt-16 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => setIsOpen(false)}
              className="p-1"
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6 text-black" />
            </motion.button>
            <h2 className="font-suez text-3xl text-[#212121]">Menu</h2>
          </motion.div>

          {/* Navigation Links */}
          <nav className="space-y-3 mt-16">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <motion.button
                    onClick={() => handleNavigation(item.path)}
                    className={`text-left font-suez text-lg transition-colors w-full py-2 ${
                      isActive 
                        ? 'text-[#DD815C]' 
                        : 'text-[#212121] hover:text-[#DD815C]'
                    }`}
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                  </motion.button>
                  <motion.hr
                    className="border-b-2 border-dotted border-[#212121] w-1/2 mt-1"
                    initial={{ width: 0 }}
                    animate={{ width: "50%" }}
                    transition={{
                      delay: 0.5 + index * 0.1,
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  />
                </motion.div>
              );
            })}
            
            {/* Logout button - only shown when authenticated */}
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + menuItems.length * 0.1 }}
              >
                <motion.button
                  onClick={handleLogout}
                  className="text-left font-suez text-lg transition-colors w-full py-2 text-red-600 hover:text-red-700 flex items-center gap-2"
                  whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </motion.button>
                <motion.hr
                  className="border-b-2 border-dotted border-[#212121] w-1/2 mt-1"
                  initial={{ width: 0 }}
                  animate={{ width: "50%" }}
                  transition={{
                    delay: 0.5 + menuItems.length * 0.1,
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                />
              </motion.div>
            )}
            
            {/* User info display when authenticated */}
            {isAuthenticated && user && (
              <motion.div
                className="mt-8 pt-6 border-t-2 border-dashed border-[#212121]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + menuItems.length * 0.1 }}
              >
                <p className="text-sm font-jost text-gray-600">Logged in as:</p>
                <p className="text-lg font-suez text-[#212121] mt-1">{user.name}</p>
                <p className="text-sm font-jost text-gray-600">{user.email}</p>
              </motion.div>
            )}
          </nav>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>


      {/* Cart Sidebar - Pass props to Cart component */}
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;