import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { LocationContext } from "../context/LocationContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaMapMarkerAlt, FaBars, FaTimes, FaAlignCenter } from "react-icons/fa";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { locationEnabled } = useContext(LocationContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path) =>
    location.pathname === path ? "text-yellow-400" : "";

  return (
    <nav className="bg-black text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">

      {/* 🔹 Logo */}
      <a className="font-bold text-lg text-yellow-400" href="/">
        SnackHub 🥟
      </a>

      {/* 🔹 Location Indicator */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <FaMapMarkerAlt />
        <span>
          {locationEnabled ? "Location ON" : "Enable Location"}
        </span>
      </div>

      {/* 🔹 Right Side */}
      <div className="flex items-center gap-4">

        {/* Cart */}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <FaShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-1 rounded-full">
              {cartCount}
            </span>
          )}
        </div>

        {/* Burger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* 🔹 Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-14 right-4 bg-black border border-gray-700 rounded-lg p-4 flex flex-col gap-3 w-44">

          <Link to="/" className={isActive("/")}>
            Home
          </Link>
          <Link to="/menu" className={isActive("/menu")}>
            Menu
          </Link>

          {user && (
            <>
              <button onClick={() => navigate(isAdmin ? "/admin" : "/orders")}>
                {isAdmin ? "Admin Orders" : "My Orders"}
              </button>

              {isAdmin && (
                <button onClick={() => navigate("/admin/menu")}>
                  Manage Menu
                </button>
              )}

              <button onClick={logout} className="text-red-400">
                Logout
              </button>
            </>
          )}

          {!user && (
            <Link to="/login">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;