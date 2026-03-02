import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "./AuthContext";
import axios from "../api/axios";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 🚀 STEP 1: Set user immediately. 
        // This makes the UI redirect and show "Welcome" INSTANTLY.
        setUser(firebaseUser);
        setLoading(false); 

        try {
          // 🚀 STEP 2: Handle Backend Sync in the background.
          // The user doesn't have to wait for this to finish to see the Home page.
          const token = await firebaseUser.getIdToken();

          const response = await axios.post("/users/sync", {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("✅ Background Sync Successful:", response.data);
          
          // Optional: If your backend returns extra data (like 'role'), 
          // you can update the user state again here without flashing the UI.
        } catch (err) {
          console.error("❌ Background sync failed:", err.response?.data || err.message);
          // We don't necessarily logout here anymore, because the user is already authenticated with Firebase.
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {/* We use loading only for the initial app load (the splash screen).
          Once Firebase gives us a 'yes' or 'no', children render immediately.
      */}
      {!loading && children}
    </AuthContext.Provider>
  );
}