import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone login state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EMAIL LOGIN ----------------
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error("Email login error:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- PHONE LOGIN ----------------
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );
    }
  };

  const handleSendOTP = async () => {
    try {
      setError("");
      setLoading(true);
      setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError("");
      await confirmationResult.confirm(otp);
      navigate("/");
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* -------- Google Login -------- */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{ width: "100%", marginBottom: "15px" }}
      >
        Continue with Google
      </button>

      <hr />

      {/* -------- Email Login -------- */}
      <form onSubmit={handleEmailLogin}>
        <h4>Email Login</h4>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          Login with Email
        </button>
      </form>

      <hr />

      {/* -------- Phone Login -------- */}
      <div>
        <h4>Phone Login</h4>

        <input
          type="text"
          placeholder="+91XXXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        {!confirmationResult ? (
          <button
            onClick={handleSendOTP}
            disabled={loading}
            style={{ width: "100%", marginBottom: "10px" }}
          >
            Send OTP
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              style={{ width: "100%" }}
            >
              Verify OTP
            </button>
          </>
        )}

        <div id="recaptcha-container"></div>
      </div>

      {loading && <p>Processing...</p>}
    </div>
  );
}

export default Login;