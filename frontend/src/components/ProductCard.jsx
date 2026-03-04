import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { dispatch } = useContext(CartContext);

  const addToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600 mt-1">₹{product.price}</p>
      <button
        onClick={addToCart}
        className="bg-black text-white px-4 py-2 mt-3 rounded hover:bg-gray-800 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;