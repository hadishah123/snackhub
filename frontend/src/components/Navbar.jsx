import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { LocationContext } from "../context/LocationContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaMapMarkerAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaUtensils,
  FaBox,
} from "react-icons/fa";
import { UIContext } from "../context/UIContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { locationEnabled } = useContext(LocationContext);

  const navigate = useNavigate();
  const location = useLocation();

const { isMenuOpen, setIsMenuOpen } = useContext(UIContext);

  const isAdmin = user?.email === "admin@snackhub.com";

  const cartCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const isActive = (path) => {
  if (path === "/") {
    return location.pathname === "/"
      ? "text-yellow-400 font-semibold"
      : "text-white";
  }

  return location.pathname.startsWith(path)
    ? "text-yellow-400 font-semibold"
    : "text-white";
};

  const handleNavigate = (path) => {
    navigate(path);
    isMenuOpen ? "translate-x-0" : "translate-x-full"
  };

  useEffect(() => {
  setIsMenuOpen(false);
},  [location.pathname, setIsMenuOpen] );
  return (
    <>
      {/* 🔹 Top Bar */}
      <nav className="bg-black text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">

        <Link to="/" className="font-bold text-lg text-yellow-400">
          SnackHub 🥟
        </Link>

        <div className="flex items-center gap-4">

          {!isAdmin && (
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
          )}

          <button onClick={() => setIsMenuOpen(true)}>
            <FaBars size={22} />
          </button>
        </div>
      </nav>

      {/* 🔥 FULL SCREEN MENU */}
      <div
        className={`fixed inset-0 bg-black text-white z-50 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Section */}
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl font-bold text-yellow-400">Menu</h2>
          <button onClick={() => setIsMenuOpen(false)}>
            <FaTimes size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 p-6 text-lg items-center">

          {/* User Info */}
          {user && (
            <div className="text-sm text-gray-400 border-b border-gray-800 pb-4">
              {user.email}
              {isAdmin && (
                <span className="text-xs text-yellow-400 ml-2">(Admin)</span>
              )}
            </div>
          )}

          <button
            onClick={() => handleNavigate("/")}
            // className={`text-left ${isActive("/")}`}
            className={`w-full py-2 active:scale-95 transition ${isActive("/")}`}
          >
            <FaHome className="inline-block mr-2" />
            Home
          </button>

          <button
            onClick={() => handleNavigate("/menu")}
            className={`w-full py-2 active:scale-95 transition ${isActive("/menu")}`}
          >
            <FaUtensils className="inline-block mr-2" />
            Menu
          </button>

          {!isAdmin && user && (
            <button
              onClick={() => handleNavigate("/orders")}
              className={`w-full py-2 active:scale-95 transition ${isActive("/orders")}`}
            >
              <FaBox className="inline-block mr-2" />
              My Orders
            </button>
          )}

          {/* Admin Section */}
          {isAdmin && (
            <div className="border-t border-gray-800 pt-4 flex flex-col gap-4">
              <p className="text-sm text-gray-400">Admin</p>

              <button
                onClick={() => handleNavigate("/admin")}
                className={`w-full py-2 ${isActive("/admin")}`}
              >
                Dashboard
              </button>

              <button
                onClick={() => handleNavigate("/admin/menu")}
                className={`w-full py-2 ${isActive("/admin/menu")}`}
              >
                Manage Menu
              </button>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-4">
            <FaMapMarkerAlt />
            {locationEnabled ? "Location ON" : "Enable Location"}
          </div>

          {/* Auth */}
          <div className="mt-6">
            {user ? (
              <button
                onClick={() => {
                  logout();
                    setIsMenuOpen(false);
                }}
                className="text-red-400"
              >
                Logout
              </button>
            ) : (
              <button onClick={() => handleNavigate("/login")} className={`w-full py-2 ${isActive("/login")}`}>
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;