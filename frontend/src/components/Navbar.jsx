import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav style={{ padding: "20px", background: "#eee" }}>
      <Link to="/">Home</Link> | 
      <Link to="/menu"> Menu</Link> | 
      <Link to="/cart"> Cart</Link> |

      {user ? (
        <>
          <span style={{ marginLeft: "10px" }}>
            Welcome, {user.displayName} 👋
          </span>
          <button className="border p-1 px-2 ml-2 rounded cursor-pointer" onClick={() => navigate("/orders")}>
            My Orders
          </button>
          <button
            onClick={logout}
            className="border p-1 px-2 ml-2 border-white-2 hover:bg-black hover:text-white rounded transition"
          >
            Logout
          </button>
        </>
      ) : (
        <Link to="/login"> Login</Link>
      )}
    </nav>
  );
}

export default Navbar;