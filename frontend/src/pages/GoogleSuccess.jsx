import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function GoogleSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [params, navigate]);

  return <h2>Logging you in...</h2>;
}

export default GoogleSuccess;