import { useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FaHome, FaUtensils, FaShoppingCart, FaBox } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { UIContext } from "../context/UIContext";

function MobileBottomNav() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { cartItems } = useContext(CartContext);
  // const { user } = useContext(AuthContext);
  const { setIsMenuOpen } = useContext(UIContext);
  
  // ✅ Optimized cart count
  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems],
  );

  const handleNav = (path) => {
  navigate(path);
  setIsMenuOpen(false); // 👈 CLOSE MENU AUTOMATICALLY
};

  // const isAdmin = user?.email === "admin@snackhub.com";

  // ✅ Better active route handling (supports sub-routes)
  const isActive = (path) =>
    routerLocation.pathname === path ? "text-yellow-400" : "text-gray-400";

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black border-t border-gray-800 flex justify-around py-3 z-50">
      {/* HOME */}
      <button
        onClick={() => handleNav("/")}
        className={`flex flex-col items-center ${isActive("/")}`}
      >
        <FaHome />
        <span className="text-xs">Home</span>
      </button>

      {/* MENU */}
      <button
        // onClick={() => navigate("/menu")}
        onClick={() => handleNav("/menu")}
        className={`flex flex-col items-center ${isActive("/menu")}`}
      >
        <FaUtensils />
        <span className="text-xs">Menu</span>
      </button>

      {/* CART */}
      <button
        onClick={() => handleNav("/cart")}
        className={`relative flex flex-col items-center ${isActive("/cart")}`}
      >
        <FaShoppingCart />

        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-1 rounded-full">
            {cartCount}
          </span>
        )}

        <span className="text-xs">Cart</span>
      </button>

      {/* ORDERS */}
      <button
        onClick={() => handleNav("/orders")}
        className={`flex flex-col items-center ${isActive("/orders")}`}
      >
        <FaBox />
        <span className="text-xs">Orders</span>
      </button>
    </div>
  );
}

export default MobileBottomNav;
