import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

function Login() {
  const navigate = useNavigate();

  // Email/password state
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Phone login state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Setup invisible reCAPTCHA once
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  }, []);

  // Email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const sendOTP = async () => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      alert("OTP sent!");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP");
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    try {
      await confirmationResult.confirm(otp);
      alert("Phone login successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      {/* Email Login */}
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
        <button onClick={googleLogin}>
          Continue with Google
        </button>
      <div className="text-center mb-2 font-semibold">Phone Login</div>

      {/* Phone Login */}
      <input
        type="tel"
        placeholder="+1234567890"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />

      <button
        type="button"
        onClick={sendOTP}
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 w-full mb-2"
      >
        Send OTP
      </button>

      {confirmationResult && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            type="button"
            onClick={verifyOTP}
            className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 w-full"
          >
            Verify OTP
          </button>
        </>
      )}

      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default Login;