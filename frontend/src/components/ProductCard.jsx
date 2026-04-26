import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { LocationContext } from "../context/LocationContext";
import ProductModal from "./ProductModal";

function ProductCard({ product }) {
  const { cartItems, dispatch } = useContext(CartContext);
  const { locationEnabled, getLocation } = useContext(LocationContext);

  const item = cartItems.find((i) => i._id === product._id);
  const quantity = item?.quantity || 0;

  const [showModal, setShowModal] = useState(false);

  // 🔥 VEG / NON-VEG LOGIC
  const isNonVeg = product.name?.toLowerCase().includes("chicken");

  const handleAddClick = async () => {
    if (!locationEnabled) {
      await getLocation();
      return;
    }
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const increase = () => {
    if (!locationEnabled) return getLocation();
    dispatch({ type: "INCREASE_QTY", payload: product._id });
  };

  const decrease = () => {
    if (!locationEnabled) return getLocation();
    dispatch({ type: "DECREASE_QTY", payload: product._id });
  };

  return (
    <>
      {/* CARD */}
      <div
        className="flex justify-between gap-4 py-4 border-b border-gray-800 last:border-none cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        {/* LEFT */}
        <div className="flex-1">
          {/* NAME + VEG/NONVEG INDICATOR */}
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 border flex items-center justify-center ${
                isNonVeg ? "border-red-500" : "border-green-500"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-lg ${
                  isNonVeg ? "bg-red-500" : "bg-green-500"
                }`}
              />
            </div>

            <h3 className="text-base font-semibold text-white leading-snug">
              {product.name}
            </h3>
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* PRICE */}
          <p className="mt-2 font-bold text-yellow-400 text-sm">
            ₹{product.price}
          </p>

          {/* LOCATION WARNING */}
          {!locationEnabled && (
            <p className="text-red-400 text-xs mt-1 font-medium">
              ⚠ Enable location to order
            </p>
          )}
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative w-28 h-28 shrink-0">
          <img
            src={product.image || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover rounded-2xl border border-gray-800"
          />

          <div className="absolute inset-0 bg-black/10 rounded-2xl" />

          {!product.isAvailable ? (
            <button
              disabled
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-900/90 text-gray-400 text-[11px] px-3 py-1 rounded-full border border-gray-700"
            >
              UNAVAILABLE
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddClick();
              }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-bold text-xs px-4 py-1.5 rounded-full active:scale-95"
            >
              ADD
            </button>
          ) : (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center bg-black/80 border border-gray-700 rounded-full overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  decrease();
                }}
                className="px-3 py-1 text-white"
              >
                -
              </button>

              <span className="px-2 text-sm text-white">{quantity}</span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  increase();
                }}
                className="px-3 py-1 text-yellow-400"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
      
      {showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default ProductCard;