import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { LocationContext } from "../context/LocationContext";

function ProductCard({ product }) {
  const { cartItems, dispatch } = useContext(CartContext);
  const { locationEnabled, getLocation } = useContext(LocationContext);

  const item = cartItems.find((i) => i._id === product._id);
  const quantity = item?.quantity || 0;

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
  <div className="flex justify-between gap-4 py-4 border-b border-gray-800 last:border-none">

    {/* LEFT */}
    <div className="flex-1">

      {/* NAME */}
      <h3 className="text-base font-semibold text-white leading-snug">
        {product.name}
      </h3>

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

      {/* soft overlay for premium look */}
      <div className="absolute inset-0 bg-black/10 rounded-2xl" />

      {/* OUT OF STOCK */}
      {!product.isAvailable ? (
        <button
          disabled
          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-900/90 text-gray-400 text-[11px] px-3 py-1 rounded-full border border-gray-700"
        >
          UNAVAILABLE
        </button>
      ) : quantity === 0 ? (
        /* ADD BUTTON */
        <button
          onClick={handleAddClick}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-bold text-xs px-4 py-1.5 rounded-full shadow-lg shadow-yellow-00/25 active:scale-95"
        >
          ADD
        </button>
      ) : (
        /* QUANTITY CONTROLLER */
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center bg-black/80 backdrop-blur-md border border-gray-700 rounded-full overflow-hidden shadow-xl">

          <button
            onClick={decrease}
            className="px-3 py-1 text-white text-lg active:scale-95"
          >
            -
          </button>

          <span className="px-2 text-sm font-semibold text-white min-w-5 text-center">
            {quantity}
          </span>

          <button
            onClick={increase}
            className="px-3 py-1 text-yellow-400 text-lg active:scale-95"
          >
            +
          </button>

        </div>
      )}

    </div>

  </div>
);
}

export default ProductCard;