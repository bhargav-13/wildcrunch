import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

import Products from "./pages/Products";
import InProduct from "./components/Product/Inproduct";
import Index from "./pages/Index";
import OurStory from "./pages/OurStory";
import Dealerships from "./pages/Dealerships";
import Contact from "./pages/Contact";
import Cart from "./components/Buy/Cart";
import PaymentPage from "./components/Buy/Payment";
import ConfirmPage from "./components/Buy/Confirm";
import NotFound from "./pages/NotFound";
import AddressPage from "./components/Buy/Address";
import OrderDetailPage from "./components/Buy/OrderDetail";
import TrackOrder from "./pages/TrackOrder";
import ScrollToTop from "./components/extra/ScrollTop";


function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:category" element={<Products />} /> {/* category route */}
        <Route path="/product/:id" element={<InProduct />} /> {/* dynamic route */}
        <Route path="/dealerships" element={<Dealerships />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/address" element={<AddressPage/>} />
        <Route path="/payment" element={<PaymentPage/>} />
        <Route path="/confirm" element={<ConfirmPage/>} />
        <Route path="/order/:id" element={<OrderDetailPage/>} />
        <Route path="/track-order" element={<TrackOrder/>} />
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
