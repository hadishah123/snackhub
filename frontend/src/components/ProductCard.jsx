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
    <div className="flex justify-between gap-4 py-4 border-b border-gray-400 last:border-none">
      
      {/* LEFT CONTENT */}
      <div className="flex-1">
        <h3 className="text-base font-semibold">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>
        <p className="mt-2 font-medium text-sm">
          ₹{product.price}
        </p>

        {!locationEnabled && (
          <p className="text-red-500 text-xs mt-1">
            Enable location to order
          </p>
        )}
      </div>

      {/* RIGHT IMAGE + BUTTON */}
      <div className="relative w-28 h-28 shrink-0">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg"
        />

        {/* BUTTON OVER IMAGE */}
        {!product.isAvailable ? (
          <button
            disabled
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-500 px-4 py-1 text-sm rounded"
          >
            Out
          </button>
        ) : quantity === 0 ? (
          <button
            onClick={handleAddClick}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white border border-gray-300 text-green-600 font-semibold px-4 py-1 text-sm rounded shadow"
          >
            ADD
          </button>
        ) : (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center bg-white border rounded shadow">
            <button onClick={decrease} className="px-2 text-lg">
              −
            </button>
            <span className="px-2 text-sm font-medium">
              {quantity}
            </span>
            <button onClick={increase} className="px-2 text-lg text-green-600">
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;