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
import { FaGoogle, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

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

    navigate(user.email === "admin@snackhub.com" ? "/admin" : "/", {
      replace: true,
    });
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch {
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
    } catch {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
        }
      );
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
      const result = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        window.recaptchaVerifier
      );
      setConfirmationResult(result);
      alert(`OTP sent to +91 ${phone}`);
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
    } catch {
      setError("Invalid OTP. Try again.");
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-gray-300">
        Syncing SnackHub Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#121212] border border-gray-800 rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-yellow-400 mb-2">
            SnackHub
          </h1>
          <p className="text-gray-400">Login to continue your foodie journey</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white text-black font-semibold py-3 hover:scale-[1.02] transition"
        >
          <FaGoogle />
          {loading ? "Verifying..." : "Continue with Google"}
        </button>

        <div className="relative my-8">
          <div className="border-t border-gray-800" />
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#121212] px-4 text-sm text-gray-500">
            OR
          </span>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-gray-700 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-gray-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-yellow-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
          >
            {loading ? "Logging in..." : "Login with Email"}
          </button>
        </form>

        <div className="relative mb-8">
          <div className="border-t border-gray-800" />
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#121212] px-4 text-sm text-gray-500">
            OR
          </span>
        </div>

        <div className="space-y-4">
          {!confirmationResult ? (
            <>
              <div className="flex items-center bg-[#1A1A1A] border border-gray-700 rounded-2xl overflow-hidden">
                <span className="px-4 py-3 text-gray-400 border-r border-gray-700">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  maxLength="10"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                  className="flex-1 bg-transparent px-4 py-3 text-white outline-none"
                />
              </div>

              <button
                onClick={handleSendOTP}
                disabled={loading || phone.length < 10}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-800 text-white hover:bg-gray-700 transition"
              >
                <FaPhoneAlt />
                Send OTP
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-yellow-400"
              />

              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
              >
                Verify OTP
              </button>
            </>
          )}
        </div>

        <div id="recaptcha-container" className="mt-6" />
      </div>
    </div>
  );
}

export default Login;
