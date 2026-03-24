import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Save user location once on mount
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Save coordinates for cart/WhatsApp
        localStorage.setItem(
          "userLocationCoords",
          JSON.stringify({ latitude, longitude })
        );

        // Optional: readable Google Maps link
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        localStorage.setItem("userLocation", mapsLink);
        console.log("Location saved:", mapsLink);
      },
      (error) => {
        console.log("Location error:", error);
      }
    );
  }, []);

  const isAdmin = user?.email === "admin@snackhub.com";
  const displayName = isAdmin ? "Admin" : user?.displayName || user?.email;

  const handleOrdersClick = () => {
    navigate(isAdmin ? "/admin" : "/orders");
    setIsOpen(false);
  };

  return (
    <nav className="bg-gray-200 p-4 flex items-center justify-between relative z-50">
      {/* Left: Welcome message or Login */}
      <div className="flex-1 w-7/12">
        {user ? (
          <span className="font-semibold truncate">
            Welcome, {displayName} 👋
          </span>
        ) : (
          <Link
            to="/login"
            className="border px-3 py-1 rounded hover:bg-black hover:text-white p-2 transition"
          >
            Login
          </Link>
        )}
      </div>

      {/* Right: Burger Menu Button */}
      <div className="md:hidden z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Menu Items */}
      <div
        className={`flex-col md:flex md:flex-row md:items-center md:gap-3 absolute md:static top-16 right-4 bg-gray-200 md:bg-transparent w-40 md:w-auto p-4 md:p-0 rounded shadow md:shadow-none transition-all duration-300 z-50 ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        <Link
          to="/"
          className="py-1 md:py-0"
          onClick={() => setIsOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/menu"
          className="py-1 md:py-0"
          onClick={() => setIsOpen(false)}
        >
          Menu
        </Link>
        <Link
          to="/cart"
          className="py-1 md:py-0"
          onClick={() => setIsOpen(false)}
        >
          Cart
        </Link>

        {user ? (
          <>
            <button
              onClick={handleOrdersClick}
              className="border px-2 py-1 rounded my-1 cursor-pointer md:my-0"
            >
              {isAdmin ? "Orders" : "My Orders"}
            </button>

            {isAdmin && (
              <button
                onClick={() => { navigate("/admin/menu"); setIsOpen(false); }}
                className="border px-2 py-1 rounded my-1 cursor-pointer md:my-0"
              >
                Manage Menu
              </button>
            )}

            <button
              onClick={() => { logout(); setIsOpen(false); }}
              className="border px-2 py-1 rounded hover:bg-black hover:text-white transition my-1 md:my-0"
            >
              Logout
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;