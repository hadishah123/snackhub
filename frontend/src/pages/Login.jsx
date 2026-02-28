import { useState } from "react";
import axios from "../api/axios";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      alert("Login successful!");
    } catch{
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Login</button>
      <button
        onClick={() =>
            (window.location.href =
            "http://localhost:5000/api/auth/google")
        }
        >
        Continue with Google
    </button>
    </form>
  );
}

export default Login;