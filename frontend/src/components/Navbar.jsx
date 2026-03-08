import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const isAdmin = user?.email === "admin@snackhub.com";

  const handleOrdersClick = () => {
    navigate(isAdmin ? "/admin" : "/orders");
  };

  const displayName = isAdmin
    ? "Admin"
    : user?.displayName || user?.email;

  return (
    <nav className="p-5 bg-gray-200 flex items-center gap-3">

      <Link to="/">Home</Link>
      <Link to="/menu">Menu</Link>

      {!isAdmin && user && <Link to="/cart">Cart</Link>}

      {user ? (
        <>
          <span className="ml-2">
            Welcome, {displayName} 👋
          </span>

          <button
            onClick={handleOrdersClick}
            className="border px-2 py-1 ml-2 rounded cursor-pointer"
          >
            {isAdmin ? "Orders" : "My Orders"}
          </button>

          <button
            onClick={logout}
            className="border px-2 py-1 ml-2 rounded hover:bg-black hover:text-white transition"
          >
            Logout
          </button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}

    </nav>
  );
}

export default Navbar;