const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../middleware/authMiddleware");
const { getMe, register, login } = require("../controllers/authController");

// ---------- Auth Routes ----------

// Register user
router.post("/register", register);

// Login user (email/password)
router.post("/login", login);

// Get currently logged-in user
router.get("/me", authMiddleware, getMe);

// ---------- Google OAuth Routes ----------

// Step 1: Redirect user to Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Create JWT token for authenticated user
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect to frontend with JWT token
    res.redirect(`${process.env.CLIENT_URL}/google-success?token=${token}`);
  }
);

module.exports = router;