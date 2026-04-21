import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function StickyCartButton() {
  const { cartItems, totalAmount } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) return null;

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed bottom-12 left-0 right-0 p-3 bg-black/80  shadow-lg">
      <button
        onClick={() => navigate("/cart")}
        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg flex justify-between px-4"
      >
        <span>🛒 View Cart ({totalItems})</span>
        <span>₹{totalAmount}</span>
      </button>
    </div>
  );
}

export default StickyCartButton;
