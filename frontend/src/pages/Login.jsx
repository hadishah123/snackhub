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

  // Email/Password & Phone State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); 
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  // --- REDIRECT IF LOGGED IN ---
  useEffect(() => {
    // If the AuthContext finally has a user, kick them to home
    if (user) {
      navigate("/", { replace: true }); 
    }
  }, [user, navigate]);

  // --- GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // We don't necessarily need navigate("/") here because 
      // the useEffect above will catch the 'user' change.
    } catch (err) {
      console.error("Google Error:", err);
      setError("Google sign-in failed. Please try again.");
      setLoading(false); // Only set to false if it failed
    }
  };

  // --- EMAIL LOGIN ---
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

  // --- PHONE LOGIN ---
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

  // --- UI RENDER ---
  // If AuthContext is still syncing with backend, show a simple loader
  if (authLoading && !error) {
    return <div style={{textAlign: 'center', marginTop: '100px'}}>Syncing SnackHub Profile...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login to SnackHub</h2>
      
      {error && <div style={styles.errorBox}>{error}</div>}

      <button onClick={handleGoogleLogin} disabled={loading} style={styles.googleBtn}>
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" style={{width: '18px', marginRight: '10px'}} />
        {loading ? "Verifying..." : "Continue with Google"}
      </button>

      <div style={styles.divider}><span>OR</span></div>

      <form onSubmit={handleEmailLogin} style={styles.form}>
        <input 
          type="email" placeholder="Email Address" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input 
          type="password" placeholder="Password" required
          value={password} onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.primaryBtn}>
          {loading ? "Logging in..." : "Login with Email"}
        </button>
      </form>

      <div style={styles.divider}><span>OR</span></div>

      <div style={styles.form}>
        {!confirmationResult ? (
          <>
            <div style={styles.phoneInputGroup}>
              <span style={styles.prefix}>+91</span>
              <input
                type="tel" placeholder="Phone Number" maxLength="10"
                value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                style={styles.phoneInput}
              />
            </div>
            <button onClick={handleSendOTP} disabled={loading || phone.length < 10} style={styles.secondaryBtn}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text" placeholder="6-digit OTP"
              value={otp} onChange={(e) => setOtp(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleVerifyOTP} disabled={loading} style={styles.successBtn}>
              Verify OTP
            </button>
          </>
        )}
      </div>

      <div id="recaptcha-container" style={{ marginTop: '15px' }}></div>
    </div>
  );
}

// (Styles remain the same as your provided code)
const styles = {
  container: { maxWidth: "400px", margin: "50px auto", padding: "30px", border: "1px solid #ddd", borderRadius: "12px", fontFamily: "Arial, sans-serif", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  errorBox: { backgroundColor: "#fff0f0", color: "#d32f2f", padding: "10px", borderRadius: "5px", marginBottom: "20px", fontSize: "14px", textAlign: "center", border: "1px solid #f8d7da" },
  googleBtn: { width: "100%", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  divider: { textAlign: "center", borderBottom: "1px solid #eee", lineHeight: "0.1em", margin: "30px 0" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "12px", borderRadius: "5px", border: "1px solid #ccc", outline: "none" },
  phoneInputGroup: { display: "flex", border: "1px solid #ccc", borderRadius: "5px", overflow: "hidden" },
  prefix: { padding: "12px", background: "#f8f9fa", borderRight: "1px solid #ccc", color: "#555" },
  phoneInput: { flex: 1, padding: "12px", border: "none", outline: "none" },
  primaryBtn: { padding: "12px", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  secondaryBtn: { padding: "12px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  successBtn: { padding: "12px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }
};

export default Login;