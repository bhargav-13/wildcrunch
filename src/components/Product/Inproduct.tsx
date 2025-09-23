import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";


export default function InProduct() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  let product = state?.product;
  if (!product) return <p>No product found</p>;

  if (!product) return <p>No product found</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }} // slight initial fade
      className="w-screen h-screen flex flex-col items-center justify-center relative"
    >
      {/* Delayed background layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }} // BG delay
        className="absolute top-0 left-0 w-full h-full"
        style={{ backgroundColor: product.bgColor, zIndex: 0 }}
      />

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-white/20 p-2 rounded-full z-20"
      >
        <ArrowLeft />
      </button>

      {/* Animated Product Image */}
      <motion.img
        layoutId={`product-image-${product.id}`}
        src={product.imageSrc}
        alt={product.name}
        className="w-[250px] sm:w-[300px] mb-6 z-10"
      />

      {/* Fade-in Details with delay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }} // details appear after image+BG
        className="flex flex-col items-center text-white z-20"
      >
        <h1 className="text-4xl font-suez mb-2">{product.name}</h1>
        <p className="font-jost text-lg">{product.weight}</p>
        <p className="text-2xl font-suez mt-2">{product.price}</p>
      </motion.div>
    </motion.div>
  );
}
