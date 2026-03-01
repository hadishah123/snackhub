import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

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
          <button
            onClick={logout}
            style={{ marginLeft: "10px" }}
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