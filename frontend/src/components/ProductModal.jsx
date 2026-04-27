import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function ProductModal({ product, onClose }) {
  const { dispatch } = useContext(CartContext);

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end md:items-center justify-center"
      >
        {/* CLOSE AREA */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* MODAL */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 28,
          }}
          className="relative bg-[#121212] w-full md:w-104 rounded-t-2xl md:rounded-2xl p-4 z-50"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white text-lg"
          >
            <FaTimes size={22} />
          </button>

          <motion.img
            src={product.image}
            alt={product.name}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-48 object-cover rounded-xl"
          />

          <h2 className="text-lg font-bold text-white mt-3">{product.name}</h2>

          <p className="text-gray-400 text-sm mt-1">{product.description}</p>

          <p className="text-yellow-400 font-bold mt-2">₹{product.price}</p>

          {!product.isAvailable ? (
            <button
              disabled
              className="w-full bg-gray-700 text-gray-400 font-bold py-3 mt-4 rounded-xl cursor-not-allowed"
            >
              UNAVAILABLE
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                dispatch({ type: "ADD_TO_CART", payload: product });
                onClose();
              }}
              className="w-full bg-yellow-400 text-black font-bold py-3 mt-4 rounded-xl"
            >
              Add to Cart
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ProductModal;
