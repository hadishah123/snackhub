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
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); 
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    if (!user) return;

    localStorage.setItem(
      "user",
      JSON.stringify({
        email: user.email,
        name: user.displayName || "Guest",
      })
    );

    if (user.email === "admin@snackhub.com") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Google Error:", err);
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Email Login Error:", err);
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
        callback: () => console.log("reCAPTCHA solved"),
      });
    }
  };

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit number.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setupRecaptcha();
      const phoneNumber = `+91${phone}`;
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      alert("OTP sent to +91 " + phone);
    } catch (err) {
      setError("SMS Error: " + err.message);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError("");
      await confirmationResult.confirm(otp);
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError("Invalid OTP. Try again.");
      setLoading(false);
    }
  };

  if (authLoading && !error) {
    return <div className="text-center mt-24">Syncing SnackHub Profile...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-8 border border-gray-300 rounded-xl font-sans shadow-lg" onLoad={handleGoogleLogin}>
      <h2 className="text-center mb-5 text-2xl font-semibold">Login to SnackHub</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-5 text-center border border-red-200 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center p-3 mb-5 bg-white border border-gray-300 rounded font-bold cursor-pointer hover:bg-gray-50"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt=""
          className="w-4 mr-2"
        />
        {loading ? "Verifying..." : "Continue with Google"}
      </button>

      <div className="text-center border-b border-gray-200 my-8 relative">
        <span className="bg-white px-3 text-gray-500 absolute left-1/2 -translate-x-1/2 -top-3">OR</span>
      </div>

      <form onSubmit={handleEmailLogin} className="flex flex-col gap-3 mb-8">
        <input
          type="email"
          placeholder="Email Address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
        >
          {loading ? "Logging in..." : "Login with Email"}
        </button>
      </form>

      <div className="text-center border-b border-gray-200 my-8 relative">
        <span className="bg-white px-3 text-gray-500 absolute left-1/2 -translate-x-1/2 -top-3">OR</span>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        {!confirmationResult ? (
          <>
            <div className="flex border border-gray-300 rounded overflow-hidden">
              <span className="p-3 bg-gray-100 border-r border-gray-300 text-gray-600">+91</span>
              <input
                type="tel"
                placeholder="Phone Number"
                maxLength="10"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="flex-1 p-3 outline-none"
              />
            </div>
            <button
              onClick={handleSendOTP}
              disabled={loading || phone.length < 10}
              className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="p-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>

      <div id="recaptcha-container" className="mt-4"></div>
    </div>
  );
}

export default Login;