import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login", form);
      // Save JWT in localStorage
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login redirect
  const handleGoogleLogin = () => {
    // Vite environment variable for backend
    const backendURL = import.meta.env.VITE_API_URL;
    window.location.href = `${backendURL}/auth/google`;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-4 text-center">OR</div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-full"
      >
        Continue with Google
      </button>
    </div>
  );
}

export default Login;