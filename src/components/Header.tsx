import { Heart, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoWC from "../assets/LogoWC.png"; 
import Cart from "./cart"; // import the new Cart component

const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // burger menu
  const [cartOpen, setCartOpen] = useState(false); // cart sidebar toggle
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Our Story", path: "/our-story" },
    { name: "Products", path: "/products" },
    { name: "Dealerships", path: "/dealerships" },
    { name: "Contact", path: "/contact" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Random ECG path
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
  const pathData = generateRandomPath();

  return (
    <>
      <header className="bg-[#F8F7E5] sticky top-0 z-50 relative">
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
              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex w-8 h-8 rounded-full border border-black text-black hover:bg-[#F1B213] hover:text-white hover:border-[#F1B213]"
                onClick={() => navigate("/wishlist")}
              >
                <Heart className="h-4 w-4" />
              </Button>

              {/* Cart button */}
              <Button
                className="flex items-center gap-1.5 bg-[#F1B213] text-white px-5 py-1.5 rounded-full text-xs font-semibold hover:bg-[#F8F7E5] hover:text-black"
                onClick={() => setCartOpen(true)} // open cart directly
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="font-sfpro">CART</span>
              </Button>

              {/* User */}
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full border border-black text-black hover:bg-[#F1B213] hover:text-white hover:border-[#F1B213]"
              >
                <User className="h-4 w-4" />
              </Button>

              {/* Burger Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-10 h-10 rounded-md text-black hover:text-[#F1B213] hover:bg-transparent border-0 flex items-center justify-center"
                  >
                    <Menu style={{ width: "28px", height: "28px" }} />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-72 bg-background">
                  <div className="flex flex-col space-y-5 mt-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <img
                        src={LogoWC}
                        alt="Wild Crunch Logo"
                        className="h-8 w-auto"
                      />
                    </div>

                    <nav className="flex flex-col space-y-3">
                      {menuItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.path)}
                          className="text-left text-base font-medium text-foreground hover:text-primary transition-colors py-1.5"
                        >
                          {item.name}
                        </button>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
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

      {/* Cart Sidebar - Pass props to Cart component */}
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;