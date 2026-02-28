import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Save JWT in localStorage
      localStorage.setItem("token", token);
      // Redirect to dashboard
      navigate("/dashboard");
    } else {
      // Fallback to login if no token
      navigate("/login");
    }
  }, [navigate]);

  return <p>Logging in...</p>;
}

export default GoogleSuccess;