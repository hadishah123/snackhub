// backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const passport = require("passport");

const authMiddleware = require("../middleware/authMiddleware");
const { getMe, register, login } = require("../controllers/authController");

// --- Auth Routes ---
router.post("/register", register);
router.post("/login", login);

// --- Get current logged-in user ---
router.get("/me", authMiddleware, getMe);

// --- Google OAuth Routes ---
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const jwt = require("jsonwebtoken");

    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect to frontend with JWT
    res.redirect(`http://localhost:5173/google-success?token=${token}`);
  }
);

module.exports = router; // ← Must export the router