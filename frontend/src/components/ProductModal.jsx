import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { FaTimes } from "react-icons/fa";

function ProductModal({ product, onClose }) {
  const { dispatch } = useContext(CartContext);

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end md:items-center justify-center">
      {/* CLOSE AREA */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* MODAL */}
      <div className="relative bg-[#121212] w-full md:w-100 rounded-t-2xl md:rounded-2xl p-4 z-50">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-lg"
        >
          <FaTimes size={22} />
        </button>

        <img
          src={product.image}
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
          <button
            onClick={() => {
              dispatch({ type: "ADD_TO_CART", payload: product });
              onClose();
            }}
            className="w-full bg-yellow-400 text-black font-bold py-3 mt-4 rounded-xl active:scale-95"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductModal;
