import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

import Products from "./pages/Products";
import InProduct from "./components/Product/Inproduct";
import Index from "./pages/Index";
import OurStory from "./pages/OurStory";
import Dealerships from "./pages/Dealerships";
import Contact from "./pages/Contact";
import WishlistPage from "./components/WishlistPage"
import Cart from "./components/Buy/Cart";
import PaymentPage from "./components/Buy/Payment";
import ConfirmPage from "./components/Buy/Confirm";
import NotFound from "./pages/NotFound";
import AddressPage from "./components/Buy/Address";
import OrderDetailPage from "./components/Buy/OrderDetail";
import ScrollToTop from "./components/extra/ScrollTop";
import LoginPage from "./components/Profile & Login/login";
import Profile from "./components/Profile & Login/profile";
import ProtectedRoute from "./components/ProtectedRoute";


function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<InProduct />} /> {/* dynamic route */}
        <Route path="/dealerships" element={<Dealerships />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>} />
        <Route path="/address" element={<ProtectedRoute><AddressPage/></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentPage/></ProtectedRoute>} />
        <Route path="/confirm" element={<ProtectedRoute><ConfirmPage/></ProtectedRoute>} />
        <Route path="/order/:id" element={<ProtectedRoute><OrderDetailPage/></ProtectedRoute>} />
        <Route path="/Login" element={<LoginPage/>} />
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <AnimatedRoutes />
    <Toaster position="top-right" richColors />
  </BrowserRouter>
);

export default App;
