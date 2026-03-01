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
        const token = await firebaseUser.getIdToken();

        try {
          await axios.post("/api/users/sync", { token }); // ✅ make sure endpoint exists
        } catch (err) {
          console.error("Failed to sync user with backend:", err);
        }

        setUser(firebaseUser);
      } else {
        setUser(null);
      }

      setLoading(false);
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
      {children}
    </AuthContext.Provider>
  );
}