import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ManageMenu() {
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);

  const cartVisible = cartItems && cartItems.length > 0;

  return (
    <button
      onClick={() => navigate("/admin/menu")}
      className={`fixed right-4 bg-yellow-400 text-black px-5 py-3 rounded-full shadow-xl font-semibold hover:scale-105 flex items-center gap-2 transition-all duration-100
        ${cartVisible ? "bottom-32" : "bottom-16"}
      `}
    >
      <FaEdit />
      Manage Menu
    </button>
  );
}