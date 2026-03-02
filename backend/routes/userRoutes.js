const express = require("express");
const router = express.Router();
const admin = require("../config/firebaseAdmin");
const User = require("../models/User");

// This route is reached at /api/users/sync
router.post("/sync", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // 1. Verify the token with Firebase Admin SDK
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name, phone_number } = decoded;

    // 2. Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // 3. Create user if they don't exist
      // Phone users won't have an email or name initially
      user = await User.create({
        firebaseUid: uid,
        name: name || (phone_number ? `User ${phone_number.slice(-4)}` : "Guest"),
        email: email || null,
        phone: phone_number || null,
      });
      console.log(`New user synced: ${uid}`);
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Auth Sync Error:", error.message);
    res.status(401).json({ message: "Unauthorized/Invalid Token" });
  }
});

module.exports = router;