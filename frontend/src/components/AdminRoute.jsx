import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.email !== "admin@snackhub.com") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
